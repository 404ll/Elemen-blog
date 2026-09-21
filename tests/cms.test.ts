import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createClient } from "@libsql/client";
import { compile, run } from "@mdx-js/mdx";
import remarkGfm from "remark-gfm";
import * as runtime from "react/jsx-runtime";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createArticleStore } from "../server/cms/store.ts";
import { publishSchema, sourceHash, type SourceDocument, type PublishInput } from "../server/cms/model.ts";
import { cleanYouMindNodes, normalizeYouMindMarkdown, safeImageUrl } from "../lib/markdown/youmind.ts";
import { signSession, verifySession } from "../server/auth/session.ts";

const document: SourceDocument = { $class: "DocumentV3Dto", id: "019fb372-d49d-723d-a38a-93bab2128525", boardId: "019c17cc-8dd9-7f84-b744-03e03737ce7b", title: "测试文章", content: "原文\n\n```ts\nconst x = 1;\n```", updatedAt: "2026-09-21T00:00:00Z" };
const input: PublishInput = { id: document.id, expectedRevision: null, sourceHash: sourceHash(document), slug: "test-article", category: "ai", excerpt: "", tags: ["Agent"] };

test("snapshot survives reconnect; updates keep URL/date; stale writers cannot replace published content", async () => {
  const dir = await mkdtemp(join(tmpdir(), "blog-cms-test-"));
  let db = createClient({ url: `file:${join(dir, "cms.db")}` });
  try {
    let store = createArticleStore(db);
    const first = await store.publish(document, input);
    db.close(); db = createClient({ url: `file:${join(dir, "cms.db")}` }); store = createArticleStore(db);
    assert.equal((await store.list())[0].markdown, document.content);
    const next = { ...document, title: "修改后的标题", content: "新的正文" };
    await assert.rejects(store.publish(next, { ...input, expectedRevision: first.revision }), /原文已改变/);
    const second = await store.publish(next, { ...input, sourceHash: sourceHash(next), expectedRevision: first.revision });
    assert.equal(second.slug, first.slug); assert.equal(second.publishedAt, first.publishedAt);
    assert.equal((await store.list()).length, 1);
    await assert.rejects(store.publish(document, { ...input, expectedRevision: first.revision }), /刚刚被更新/);
    const other = { ...document, id: "019fb372-d49d-723d-a38a-93bab2128526" };
    await assert.rejects(store.publish(other, { ...input, id: other.id }), /网址已被使用/);
    await assert.rejects(store.publish(next, { ...input, slug: "renamed", sourceHash: sourceHash(next), expectedRevision: second.revision }), /保持不变/);
    assert.equal((await store.list())[0].markdown, "新的正文");
  } finally { db.close(); await rm(dir, { recursive: true, force: true }); }
});

test("image JSON metadata is decoded without rewriting examples inside fences", () => {
  const line = '![{"alt":"a \\"quote\\" [x]","width":1075,"height":600}](https://cdn.gooo.ai/gen-images/example.png)';
  const body = `${line}\n\n\`\`\`md\n${line}\n<EMPTY_PARAGRAPH>\n\`\`\``;
  const normalized = normalizeYouMindMarkdown(body);
  assert.equal(normalized.images["https://cdn.gooo.ai/gen-images/example.png"].alt, 'a "quote" [x]');
  assert.equal(normalized.images["https://cdn.gooo.ai/gen-images/example.png"].width, 1075);
  assert.ok(normalized.markdown.includes(`\`\`\`md\n${line}\n<EMPTY_PARAGRAPH>\n\`\`\``));
  assert.equal(safeImageUrl("http://127.0.0.1/a.png"), undefined);
  assert.equal(safeImageUrl("https://cdn.gooo.ai.evil.test/a.png"), undefined);
});

test("Markdown-only render removes editor markers, fixes emphasis, preserves code, and never evaluates expressions", async () => {
  const source = '正文**。**\n\n<EMPTY_PARAGRAPH>\n\n{throw new Error("executed")}\n\n```text\n<EMPTY_PARAGRAPH>\n**。**\n  indented\n```';
  const compiled = await compile(source, { format: "md", outputFormat: "function-body", remarkPlugins: [cleanYouMindNodes] });
  const { default: Content } = await run(compiled, runtime);
  const html = renderToStaticMarkup(createElement(Content));
  assert.ok(html.includes("正文<strong>。</strong>"));
  assert.ok(html.includes("{throw new Error"));
  assert.equal((html.match(/&lt;EMPTY_PARAGRAPH&gt;/g) ?? []).length, 1);
  assert.ok(html.includes("**。**\n  indented"));
});

test("YouMind citations become source links while code examples remain literal", async () => {
  const citation = '[[citation:{"links":["https://vercel.com/pricing"]}]]';
  const compiled = await compile(`正文${citation}，另一处${citation}\n\n\`${citation}\`\n\n\`\`\`text\n${citation}\n\`\`\``, { format: "md", outputFormat: "function-body", remarkPlugins: [remarkGfm, cleanYouMindNodes] });
  const { default: Content } = await run(compiled, runtime);
  const html = renderToStaticMarkup(createElement(Content));
  assert.ok(html.includes('<a href="https://vercel.com/pricing">来源</a>'));
  assert.equal((html.match(/>来源<\/a>/g) ?? []).length, 2);
  assert.equal((html.match(/\[\[citation:/g) ?? []).length, 2);
});

test("sessions reject tampering, expiry, and weak secrets", () => {
  const secret = "x".repeat(32), session = { kind: "admin", user: "404ll", exp: Date.now() + 10000 };
  const token = signSession(session, secret);
  assert.deepEqual(verifySession(token, secret), session);
  assert.equal(verifySession(`${token.slice(0, -5)}xxxxx`, secret), null);
  assert.equal(verifySession(signSession({ ...session, exp: 0 }, secret), secret), null);
  assert.equal(verifySession(token, "short"), null);
  assert.equal(verifySession(`${token}.extra`, secret), null);
});

test("publish input cannot address filesystem paths or arbitrary categories", () => {
  assert.equal(publishSchema.safeParse({ ...input, slug: "../../outside" }).success, false);
  assert.equal(publishSchema.safeParse({ ...input, category: "admin" }).success, false);
  assert.equal(publishSchema.safeParse(input).success, true);
});

test("Board settings persist without deleting articles and block old-source publication", async () => {
  const db = createClient({ url: "file::memory:" });
  try {
    const store = createArticleStore(db);
    assert.equal(await store.getBoard(), null);
    const article = await store.publish(document, input);
    await store.setBoard("01a0c28e-9db0-75c7-8b87-479b62b7fba4");
    const reopened = createArticleStore(db);
    assert.equal(await reopened.getBoard(), "01a0c28e-9db0-75c7-8b87-479b62b7fba4");
    assert.equal((await reopened.list())[0].revision, article.revision);
    await assert.rejects(reopened.publish(document, { ...input, expectedRevision: article.revision }), /内容来源已切换/);
  } finally { db.close(); }
});

test("Board links are restricted to YouMind and folders include descendants without looping", async () => {
  const { parseBoardLink, folderPath, inFolder } = await import("../server/youmind/folders.ts");
  assert.equal(parseBoardLink(`https://youmind.com/boards/${document.boardId}?tab=file`), document.boardId);
  assert.equal(parseBoardLink(document.boardId), document.boardId);
  assert.throws(() => parseBoardLink(`https://example.com/boards/${document.boardId}`));
  assert.throws(() => parseBoardLink("http://127.0.0.1/boards/test"));
  const parent = { $class: "GroupV3Dto" as const, id: "parent", boardId: document.boardId, title: "AI", parentGroupId: null };
  const child = { ...parent, id: "child", title: "Agent", parentGroupId: "parent" };
  assert.deepEqual(folderPath("child", [parent, child]).map(f => f.title), ["AI", "Agent"]);
  assert.equal(inFolder("child", "parent", [parent, child]), true);
  assert.equal(inFolder("parent", "child", [parent, child]), false);
  assert.equal(inFolder(null, "root", [parent, child]), true);
  assert.equal(folderPath("child", [{ ...parent, parentGroupId: "child" }, child]).length, 2);
});
