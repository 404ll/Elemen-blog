import test from "node:test";
import assert from "node:assert/strict";
import { PostFrontmatterSchema, normalizeTags, sortPostsByDate } from "../lib/post.ts";

test("PostFrontmatterSchema accepts minimal valid frontmatter", () => {
  const parsed = PostFrontmatterSchema.parse({
    title: "My post",
    date: "2026-04-21",
  });

  assert.equal(parsed.title, "My post");
  assert.equal(parsed.date, "2026-04-21");
  assert.equal(parsed.draft, false);
});

test("PostFrontmatterSchema rejects missing title", () => {
  assert.throws(
    () => PostFrontmatterSchema.parse({ date: "2026-04-21" }),
    /title/
  );
});

test("normalizeTags supports array and csv string", () => {
  assert.deepEqual(normalizeTags(["next", "tsx"]), ["next", "tsx"]);
  assert.deepEqual(normalizeTags("next, tsx, mdx"), ["next", "tsx", "mdx"]);
});

test("sortPostsByDate orders latest first", () => {
  const sorted = sortPostsByDate([
    { slug: "a", title: "A", date: "2024-01-01" },
    { slug: "b", title: "B", date: "2026-01-01" },
    { slug: "c", title: "C", date: "2025-01-01" },
  ]);

  assert.deepEqual(
    sorted.map((item) => item.slug),
    ["b", "c", "a"]
  );
});
