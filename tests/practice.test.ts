import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PracticeManifestSchema } from "../lib/practice/schema.ts";
import {
  getAllProblems,
  getProblemById,
  loadManifest,
} from "../lib/practice/loader.ts";

const fixtureRoot = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "fixtures/practice"
);

test("PracticeManifestSchema accepts valid manifest", () => {
  const manifest = loadManifest(fixtureRoot);
  assert.equal(manifest.problems.length, 1);
  assert.equal(manifest.problems[0].id, "array-fill");
});

test("getAllProblems returns sorted list from fixture", () => {
  const problems = getAllProblems(fixtureRoot);
  assert.equal(problems.length, 1);
  assert.equal(problems[0].title, "手写 Array.prototype.fill");
});

test("getProblemById loads code from entry file", () => {
  const problem = getProblemById("array-fill", fixtureRoot);
  assert.ok(problem);
  assert.match(problem!.code, /myFill/);
  assert.equal(problem!.lang, "javascript");
});

test("getProblemById returns null for unknown id", () => {
  assert.equal(getProblemById("missing", fixtureRoot), null);
});

test("PracticeManifestSchema rejects empty problems", () => {
  assert.throws(() => PracticeManifestSchema.parse({ problems: [] }));
});
