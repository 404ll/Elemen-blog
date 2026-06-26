import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PracticeManifestSchema } from "../lib/practice/schema.ts";
import {
  getAdjacentProblems,
  getAllProblems,
  getProblemById,
  getPracticeGroups,
  loadManifest,
} from "../lib/practice/loader.ts";

const fixtureRoot = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "fixtures/practice"
);

test("PracticeManifestSchema accepts valid manifest", () => {
  const manifest = loadManifest(fixtureRoot);
  assert.equal(manifest.groups.length, 3);
  assert.equal(manifest.problems.length, 3);
  assert.equal(manifest.problems[0].id, "array-fill");
  assert.equal(manifest.problems[1].groupId, "async");
  assert.equal(manifest.problems[2].collection, "work");
});

test("getPracticeGroups returns ordered groups with items", () => {
  const groups = getPracticeGroups(fixtureRoot);
  assert.deepEqual(
    groups.map((group) => group.id),
    ["array", "async"]
  );
  assert.equal(groups[0].items[0].id, "array-fill");
  assert.equal(groups[1].items[0].id, "debounce");
});

test("getAllProblems returns group-aware sorted list from fixture", () => {
  const problems = getAllProblems(fixtureRoot);
  assert.equal(problems.length, 2);
  assert.equal(problems[0].title, "手写 Array.prototype.fill");
  assert.equal(problems[1].title, "手写防抖 debounce");
});

test("getAllProblems defaults to handwriting and can filter work entries", () => {
  const handwriting = getAllProblems({ rootDir: fixtureRoot });
  assert.deepEqual(
    handwriting.map((problem) => problem.id),
    ["array-fill", "debounce"]
  );

  const work = getAllProblems({ rootDir: fixtureRoot, collection: "work" });
  assert.deepEqual(
    work.map((problem) => problem.id),
    ["work-money-format"]
  );
});

test("getPracticeGroups filters groups by selected collection", () => {
  const groups = getPracticeGroups({
    rootDir: fixtureRoot,
    collection: "work",
  });
  assert.deepEqual(
    groups.map((group) => group.id),
    ["formatting"]
  );
  assert.equal(groups[0].items[0].title, "金额格式化函数");
});

test("getProblemById respects collection namespace", () => {
  assert.equal(
    getProblemById("work-money-format", {
      rootDir: fixtureRoot,
      collection: "handwriting",
    }),
    null
  );
  assert.ok(
    getProblemById("work-money-format", {
      rootDir: fixtureRoot,
      collection: "work",
    })
  );
});

test("getAdjacentProblems stays inside the selected collection", () => {
  const { prev, next } = getAdjacentProblems("work-money-format", {
    rootDir: fixtureRoot,
    collection: "work",
  });
  assert.equal(prev, null);
  assert.equal(next, null);
});

test("getProblemById loads code from entry file", () => {
  const problem = getProblemById("array-fill", fixtureRoot);
  assert.ok(problem);
  assert.match(problem!.code, /myFill/);
  assert.equal(problem!.lang, "javascript");
});

test("getProblemById loads article notes and ignores prompt files", () => {
  const problem = getProblemById("debounce", fixtureRoot);
  assert.ok(problem);
  assert.match(problem!.code, /function debounce/);
  assert.match(problem!.note ?? "", /Visible note/);
  assert.doesNotMatch(problem!.note ?? "", /Hidden prompt/);
});

test("getProblemById returns null for unknown id", () => {
  assert.equal(getProblemById("missing", fixtureRoot), null);
});

test("work note sections are parsed from article markdown", () => {
  const problem = getProblemById("work-money-format", {
    rootDir: fixtureRoot,
    collection: "work",
  });

  assert.ok(problem?.workNote);
  assert.match(problem.workNote.scene ?? "", /后台返回金额是分/);
  assert.match(problem.workNote.code ?? "", /formatMoney/);
  assert.match(problem.workNote.note ?? "", /统一处理空值/);
  assert.equal(problem.workNote.optional.length, 0);
});

test("PracticeManifestSchema rejects empty problems", () => {
  assert.throws(() => PracticeManifestSchema.parse({ problems: [] }));
});
