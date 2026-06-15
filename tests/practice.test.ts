import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PracticeManifestSchema } from "../lib/practice/schema.ts";
import {
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
  assert.equal(manifest.groups.length, 2);
  assert.equal(manifest.problems.length, 2);
  assert.equal(manifest.problems[0].id, "array-fill");
  assert.equal(manifest.problems[1].groupId, "async");
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

test("PracticeManifestSchema rejects empty problems", () => {
  assert.throws(() => PracticeManifestSchema.parse({ problems: [] }));
});
