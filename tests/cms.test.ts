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
import {
  publishSchema,
  sourceHash,
  type SourceDocument,
  type PublishInput,
} from "../server/cms/model.ts";
import {
  cleanYouMindNodes,
  normalizeYouMindMarkdown,
  safeImageUrl,
} from "../lib/markdown/youmind.ts";
import { signSession, verifySession } from "../server/auth/session.ts";
import { extractYouMindCover } from "../lib/markdown/cover.ts";

test("cover selects a real supported image, ignoring code and unsafe URLs", () => {
  const url = "https://cdn.youmindassets.com/gen-images/cover.png";
  const example = "https://cdn.gooo.ai/example.png";
  assert.equal(
    extractYouMindCover(
      `\`\`\`md\n![example](${example})\n\`\`\`\n\n![unsafe](https://evil.test/a.png)\n\n![{\"alt\":\"封面\",\"width\":1067}](${url})\n\n![later](${example})`,
    ),
    url,
  );
  assert.equal(extractYouMindCover(`![cover][asset]\n\n[asset]: ${url}`), url);
  assert.equal(
    extractYouMindCover(`\`![example](${example})\`\n\n没有封面`),
    undefined,
  );
});

test("publishing stores the cover and removes it when the image is removed", async () => {
  const db = createClient({ url: "file::memory:" });
  try {
    const store = createArticleStore(db);
    const url = "https://cdn.youmindassets.com/gen-images/cover.png";
    const source = { ...document, content: `![封面](${url})\n\n正文` };
    const first = await store.publish(source, {
      ...input,
      sourceHash: sourceHash(source),
    });
    assert.equal((await store.list())[0].cover, url);
    await store.publish(document, {
      ...input,
      expectedRevision: first.revision,
    });
    assert.equal((await store.list())[0].cover, undefined);
  } finally {
    db.close();
  }
});

const document: SourceDocument = {
  $class: "DocumentV3Dto",
  id: "019fb372-d49d-723d-a38a-93bab2128525",
  boardId: "019c17cc-8dd9-7f84-b744-03e03737ce7b",
  title: "测试文章",
  content: "原文\n\n```ts\nconst x = 1;\n```",
  updatedAt: "2026-09-21T00:00:00Z",
};
const input: PublishInput = {
  id: document.id,
  expectedRevision: null,
  sourceHash: sourceHash(document),
  slug: "test-article",
  category: "ai",
  excerpt: "",
  tags: ["Agent"],
};

test("snapshot survives reconnect; updates keep URL/date; stale writers cannot replace published content", async () => {
  const dir = await mkdtemp(join(tmpdir(), "blog-cms-test-"));
  let db = createClient({ url: `file:${join(dir, "cms.db")}` });
  try {
    let store = createArticleStore(db);
    const first = await store.publish(document, input);
    db.close();
    db = createClient({ url: `file:${join(dir, "cms.db")}` });
    store = createArticleStore(db);
    assert.equal((await store.list())[0].markdown, document.content);
    const next = { ...document, title: "修改后的标题", content: "新的正文" };
    await assert.rejects(
      store.publish(next, { ...input, expectedRevision: first.revision }),
      /原文已改变/,
    );
    const second = await store.publish(next, {
      ...input,
      sourceHash: sourceHash(next),
      expectedRevision: first.revision,
    });
    assert.equal(second.slug, first.slug);
    assert.equal(second.publishedAt, first.publishedAt);
    assert.equal((await store.list()).length, 1);
    await assert.rejects(
      store.publish(document, { ...input, expectedRevision: first.revision }),
      /刚刚被更新/,
    );
    const other = { ...document, id: "019fb372-d49d-723d-a38a-93bab2128526" };
    await assert.rejects(
      store.publish(other, { ...input, id: other.id }),
      /网址已被使用/,
    );
    await assert.rejects(
      store.publish(next, {
        ...input,
        slug: "renamed",
        sourceHash: sourceHash(next),
        expectedRevision: second.revision,
      }),
      /保持不变/,
    );
    assert.equal((await store.list())[0].markdown, "新的正文");
  } finally {
    db.close();
    await rm(dir, { recursive: true, force: true });
  }
});

test("image JSON metadata is decoded without rewriting examples inside fences", () => {
  const line =
    '![{"alt":"a \\"quote\\" [x]","width":1075,"height":600}](https://cdn.gooo.ai/gen-images/example.png)';
  const body = `${line}\n\n\`\`\`md\n${line}\n<EMPTY_PARAGRAPH>\n\`\`\``;
  const normalized = normalizeYouMindMarkdown(body);
  assert.equal(
    normalized.images["https://cdn.gooo.ai/gen-images/example.png"].alt,
    'a "quote" [x]',
  );
  assert.equal(
    normalized.images["https://cdn.gooo.ai/gen-images/example.png"].width,
    1075,
  );
  assert.ok(
    normalized.markdown.includes(
      `\`\`\`md\n${line}\n<EMPTY_PARAGRAPH>\n\`\`\``,
    ),
  );
  assert.equal(safeImageUrl("http://127.0.0.1/a.png"), undefined);
  assert.equal(safeImageUrl("https://cdn.gooo.ai.evil.test/a.png"), undefined);
});

test("YouMind assets CDN images retain metadata and reject lookalike hosts", () => {
  const url = "https://cdn.youmindassets.com/gen-images/cover.png";
  const normalized = normalizeYouMindMarkdown(
    `![{"alt":"封面","width":1067,"height":600}](${url})`,
  );

  assert.equal(normalized.markdown, `![封面](${url})`);
  assert.deepEqual(normalized.images[url], {
    alt: "封面",
    caption: undefined,
    width: 1067,
    height: 600,
  });
  assert.deepEqual(normalized.warnings, []);
  assert.equal(
    safeImageUrl("https://cdn.youmindassets.com.evil.test/cover.png"),
    undefined,
  );
  assert.equal(
    safeImageUrl("http://cdn.youmindassets.com/cover.png"),
    undefined,
  );
});

test("Markdown-only render removes editor markers, fixes emphasis, preserves code, and never evaluates expressions", async () => {
  const source =
    '正文**。**\n\n<EMPTY_PARAGRAPH>\n\n{throw new Error("executed")}\n\n```text\n<EMPTY_PARAGRAPH>\n**。**\n  indented\n```';
  const compiled = await compile(source, {
    format: "md",
    outputFormat: "function-body",
    remarkPlugins: [cleanYouMindNodes],
  });
  const { default: Content } = await run(compiled, runtime);
  const html = renderToStaticMarkup(createElement(Content));
  assert.ok(html.includes("正文<strong>。</strong>"));
  assert.ok(html.includes("{throw new Error"));
  assert.equal((html.match(/&lt;EMPTY_PARAGRAPH&gt;/g) ?? []).length, 1);
  assert.ok(html.includes("**。**\n  indented"));
});

test("YouMind citations become source links while code examples remain literal", async () => {
  const citation = '[[citation:{"links":["https://vercel.com/pricing"]}]]';
  const multiple =
    '[[citation:{"links":["https://vercel.com/pricing","https://example.com/source"]}]]';
  const compiled = await compile(
    `正文${citation}，另一处${citation}\n\n多个来源${multiple}\n\n\`${citation}\`\n\n\`\`\`text\n${citation}\n\`\`\``,
    {
      format: "md",
      outputFormat: "function-body",
      remarkPlugins: [remarkGfm, cleanYouMindNodes],
    },
  );
  const { default: Content } = await run(compiled, runtime);
  const html = renderToStaticMarkup(createElement(Content));
  assert.ok(
    html.includes(
      '<sup class="cms-citation"><a href="https://vercel.com/pricing">1</a></sup>',
    ),
  );
  assert.equal((html.match(/>1<\/a>/g) ?? []).length, 3);
  assert.ok(
    html.includes(
      '<sup class="cms-citation"><a href="https://vercel.com/pricing">1</a>,<a href="https://example.com/source">2</a></sup>',
    ),
  );
  assert.equal((html.match(/\[\[citation:/g) ?? []).length, 2);
});

async function renderYouMindMarkdown(source: string) {
  const { markdown } = normalizeYouMindMarkdown(source);
  const compiled = await compile(markdown, {
    format: "md",
    outputFormat: "function-body",
    remarkPlugins: [remarkGfm, cleanYouMindNodes],
  });
  const { default: Content } = await run(compiled, runtime);
  return renderToStaticMarkup(createElement(Content));
}

test("YouMind callouts retain paragraphs, lists, emoji and code without exposing metadata", async () => {
  const opening =
    ':::callout{"backgroundColor":"var(--callout-blue-bg)","icon":{"type":"emoji","emoji":"🧭"}}';
  const html = await renderYouMindMarkdown(
    `${opening}\n**先记住一句话**\n\n正文\n\n- 一道闸\n- 两道闸\n\n\`\`\`text\n:::callout{}\n:::\n\`\`\`\n:::\n\n框外正文`,
  );

  assert.match(html, /<aside class="cms-callout cms-callout-blue">/);
  assert.match(html, /<span class="cms-callout-icon">🧭<\/span>/);
  assert.match(
    html,
    /<div class="cms-callout-body"><p><strong>先记住一句话<\/strong><\/p>/,
  );
  assert.match(html, /<ul>\n<li>一道闸<\/li>\n<li>两道闸<\/li>/);
  assert.match(html, /<code class="language-text">:::callout\{\}\n:::/);
  assert.match(html, /<\/aside>\n<p>框外正文<\/p>/);
  assert.doesNotMatch(html, /backgroundColor|YOUMIND-CALLOUT/);
});

test("Nested callouts work, while unclosed markers and code examples remain literal", async () => {
  const opening = ':::callout{"backgroundColor":"var(--callout-green-bg)"}';
  const html = await renderYouMindMarkdown(
    `${opening}\n外层\n\n${opening}\n内层\n:::\n\n外层结尾\n:::`,
  );
  assert.equal((html.match(/<aside /g) ?? []).length, 2);
  assert.match(html, /内层/);
  assert.match(html, /外层结尾/);

  assert.equal(
    normalizeYouMindMarkdown(`${opening}\n未闭合\n\n继续正文`).markdown,
    `${opening}\n未闭合\n\n继续正文`,
  );
  const example = `\`\`\`md\n${opening}\n:::\n\`\`\``;
  assert.equal(normalizeYouMindMarkdown(example).markdown, example);
  assert.equal(
    normalizeYouMindMarkdown(`    ${opening}\n    :::`).markdown,
    `    ${opening}\n    :::`,
  );
});

test("YouMind emphasis handles quoted Chinese, edge spaces and strong-wrapped inline code", async () => {
  const source =
    "按**“少 · 分 · 限 · 搜”**的思路\n\n**想让它一定调用，用** <strong>`tool_choice`</strong>**，别只靠 prompt**。\n\n**格式层：开 **<strong>`strict: true`</strong>**。**\n\n- **所有字段都列进 **<strong>`required`</strong>\n\n`**“保留”** <strong>示例</strong>`\n\n```text\n**“保留”**\n<strong>示例</strong>\n```";
  const html = await renderYouMindMarkdown(source);
  assert.match(html, /按<strong>“少 · 分 · 限 · 搜”<\/strong>的思路/);
  assert.match(html, /<strong><code>tool_choice<\/code><\/strong>/);
  assert.match(html, /<strong><code>strict: true<\/code><\/strong>/);
  assert.match(
    html,
    /<strong>所有字段都列进<\/strong> <strong><code>required<\/code><\/strong>/,
  );
  assert.match(
    html,
    /<code>\*\*“保留”\*\* &lt;strong&gt;示例&lt;\/strong&gt;<\/code>/,
  );
  assert.match(
    html,
    /<code class="language-text">\*\*“保留”\*\*\n&lt;strong&gt;示例&lt;\/strong&gt;/,
  );
  assert.equal(
    await renderYouMindMarkdown("\\*\\*“字面符号”\\*\\*"),
    "<p>**“字面符号”**</p>",
  );
});

test("Callout metadata and inline HTML cannot inject styles, event handlers or scripts", async () => {
  const html = await renderYouMindMarkdown(
    ':::callout{"backgroundColor":"url(https://evil.test/track)","borderColor":"red","onclick":"alert(1)"}\n正文 <strong onclick="alert(1)">加粗</strong>\n\n<script>throw new Error("executed")</script>\n\n{throw new Error("executed")}\n:::',
  );
  assert.match(html, /cms-callout-gray/);
  assert.match(html, /正文 加粗/);
  assert.match(html, /\{throw new Error/);
  assert.doesNotMatch(html, /evil\.test|onclick|<script|style=/);
});

test("sessions reject tampering, expiry, and weak secrets", () => {
  const secret = "x".repeat(32),
    session = { kind: "admin", user: "404ll", exp: Date.now() + 10000 };
  const token = signSession(session, secret);
  assert.deepEqual(verifySession(token, secret), session);
  assert.equal(verifySession(`${token.slice(0, -5)}xxxxx`, secret), null);
  assert.equal(
    verifySession(signSession({ ...session, exp: 0 }, secret), secret),
    null,
  );
  assert.equal(verifySession(token, "short"), null);
  assert.equal(verifySession(`${token}.extra`, secret), null);
});

test("publish input cannot address filesystem paths or arbitrary categories", () => {
  assert.equal(
    publishSchema.safeParse({ ...input, slug: "../../outside" }).success,
    false,
  );
  assert.equal(
    publishSchema.safeParse({ ...input, category: "admin" }).success,
    false,
  );
  assert.equal(publishSchema.safeParse(input).success, true);
});

test("Adding a Board retains the legacy source, published snapshots and both publication paths", async () => {
  const db = createClient({ url: "file::memory:" });
  try {
    const store = createArticleStore(db);
    assert.equal(await store.getBoard(), null);
    const article = await store.publish(document, input);
    await db.execute({
      sql: "INSERT INTO cms_settings (key, value) VALUES ('board', ?)",
      args: [document.boardId],
    });
    const addedBoardId = "01a0c28e-9db0-75c7-8b87-479b62b7fba4";
    await store.addBoard(addedBoardId);
    const reopened = createArticleStore(db);
    assert.equal(await reopened.getBoard(), addedBoardId);
    assert.deepEqual(await reopened.getBoards(), [
      addedBoardId,
      document.boardId,
    ]);
    assert.equal((await reopened.list())[0].revision, article.revision);
    await reopened.publish(document, {
      ...input,
      expectedRevision: article.revision,
    });
    const addedDocument = {
      ...document,
      id: "019fb372-d49d-723d-a38a-93bab2128526",
      boardId: addedBoardId,
    };
    await reopened.publish(addedDocument, {
      ...input,
      id: addedDocument.id,
      slug: "another-board",
    });
    assert.equal((await reopened.list()).length, 2);
    const outside = {
      ...document,
      boardId: "019fb372-d49d-723d-a38a-93bab2128527",
    };
    await assert.rejects(reopened.publish(outside, input), /内容来源已切换/);
  } finally {
    db.close();
  }
});

test("First Board connection preserves the environment source and repeated or concurrent additions do not lose Boards", async () => {
  const db = createClient({ url: "file::memory:" });
  try {
    const store = createArticleStore(db);
    const added = "01a0c28e-9db0-75c7-8b87-479b62b7fba4";
    await store.addBoard(added, document.boardId);
    await store.addBoard(added, document.boardId);
    assert.deepEqual(await store.getBoards(), [added, document.boardId]);
    const third = "019fb372-d49d-723d-a38a-93bab2128527";
    await Promise.all([
      store.addBoard(document.boardId),
      store.addBoard(third),
    ]);
    assert.deepEqual(
      new Set(await store.getBoards()),
      new Set([document.boardId, added, third]),
    );
  } finally {
    db.close();
  }
});

test("Board links are restricted to YouMind and folders include descendants without looping", async () => {
  const { parseBoardLink, folderPath, inFolder } =
    await import("../server/youmind/folders.ts");
  assert.equal(
    parseBoardLink(`https://youmind.com/boards/${document.boardId}?tab=file`),
    document.boardId,
  );
  assert.equal(parseBoardLink(document.boardId), document.boardId);
  assert.throws(() =>
    parseBoardLink(`https://example.com/boards/${document.boardId}`),
  );
  assert.throws(() => parseBoardLink("http://127.0.0.1/boards/test"));
  const parent = {
    $class: "GroupV3Dto" as const,
    id: "parent",
    boardId: document.boardId,
    title: "AI",
    parentGroupId: null,
  };
  const child = {
    ...parent,
    id: "child",
    title: "Agent",
    parentGroupId: "parent",
  };
  assert.deepEqual(
    folderPath("child", [parent, child]).map((f) => f.title),
    ["AI", "Agent"],
  );
  assert.equal(inFolder("child", "parent", [parent, child]), true);
  assert.equal(inFolder("parent", "child", [parent, child]), false);
  assert.equal(inFolder(null, "root", [parent, child]), true);
  assert.equal(
    folderPath("child", [{ ...parent, parentGroupId: "child" }, child]).length,
    2,
  );
});
