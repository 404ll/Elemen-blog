# Practice Collections Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `/practice` collection switch so handwriting exercises and lightweight work-collected code notes can live in one Wiki-style section without becoming blog posts.

**Architecture:** Extend practice manifest entries with an optional `collection`, defaulting to `handwriting`. Keep existing handwriting URLs working at `/practice/[id]`, add namespaced work URLs at `/practice/work/[id]`, and render work entries with a lightweight record-card template based on Markdown sections.

**Tech Stack:** Next.js App Router, TypeScript, Zod, Node test runner, MDX renderer, Shiki highlighting.

---

## File Structure

- Modify `lib/practice/types.ts`: add collection types and parsed work-note sections.
- Modify `lib/practice/schema.ts`: accept optional `collection` on problems.
- Modify `lib/practice/categories.ts`: add collection metadata and route helpers.
- Modify `lib/practice/loader.ts`: filter by collection, preserve legacy handwriting default, parse work note sections.
- Modify `components/practice/PracticeSidebar.tsx`: add collection selector and current collection description.
- Modify `app/(site)/practice/layout.tsx`: pass collection metadata into sidebar.
- Modify `app/(site)/practice/page.tsx`: redirect to first handwriting item.
- Modify `app/(site)/practice/[id]/page.tsx`: keep handwriting detail page and reject work entries on legacy URLs.
- Create `app/(site)/practice/work/page.tsx`: redirect to first work item or show empty state.
- Create `app/(site)/practice/work/[id]/page.tsx`: render work record-card detail.
- Modify `tests/practice.test.ts`: add collection filtering, defaulting, adjacent navigation, and work-note parsing coverage.
- Modify `tests/fixtures/practice/manifest.json`: include one work entry.
- Create `tests/fixtures/practice/problems/work-money-format/code.js`: small work snippet fixture.
- Create `tests/fixtures/practice/problems/work-money-format/article.md`: lightweight record-card fixture.

## Task 1: Data Model And Loader

**Files:**
- Modify: `lib/practice/types.ts`
- Modify: `lib/practice/schema.ts`
- Modify: `lib/practice/categories.ts`
- Modify: `lib/practice/loader.ts`
- Test: `tests/practice.test.ts`
- Test fixture: `tests/fixtures/practice/manifest.json`
- Create: `tests/fixtures/practice/problems/work-money-format/code.js`
- Create: `tests/fixtures/practice/problems/work-money-format/article.md`

- [ ] **Step 1: Write failing tests**

Add tests that expect:

```ts
test("collection defaults to handwriting and can filter work entries", () => {
  const handwriting = getAllProblems({ rootDir: fixtureRoot });
  assert.deepEqual(handwriting.map((problem) => problem.id), [
    "array-fill",
    "debounce",
  ]);

  const work = getAllProblems({ rootDir: fixtureRoot, collection: "work" });
  assert.deepEqual(work.map((problem) => problem.id), ["work-money-format"]);
});

test("getPracticeGroups filters groups by selected collection", () => {
  const groups = getPracticeGroups({
    rootDir: fixtureRoot,
    collection: "work",
  });
  assert.deepEqual(groups.map((group) => group.id), ["formatting"]);
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
```

- [ ] **Step 2: Run tests and confirm they fail**

Run: `npm test`

Expected: fail because loader functions do not accept the options object, schema does not accept work collection, and work note parsing does not exist.

- [ ] **Step 3: Implement minimal data model**

Add:

```ts
export type PracticeCollection = "handwriting" | "work";

export type PracticeWorkNoteSection = {
  title: string;
  content: string;
};

export type PracticeWorkNote = {
  scene?: string;
  code?: string;
  note?: string;
  optional: PracticeWorkNoteSection[];
};
```

Add `collection?: PracticeCollection` to `PracticeProblemMeta`, and `workNote?: PracticeWorkNote` to `PracticeProblem`.

- [ ] **Step 4: Implement schema and loader options**

Add `collection: z.enum(["handwriting", "work"]).optional()` to `PracticeProblemSchema`.

Change loader APIs to accept:

```ts
export type PracticeLoaderOptions = {
  rootDir?: string;
  collection?: PracticeCollection;
};
```

Keep string root arguments working by normalizing old calls.

- [ ] **Step 5: Implement collection filtering and work note parsing**

Filter problems by `problem.collection ?? "handwriting"`.

Parse `article.md` with heading sections:

```ts
const WORK_NOTE_SECTION_MAP = new Map([
  ["场景", "scene"],
  ["代码", "code"],
  ["记一下", "note"],
]);
```

Preserve unknown sections in `optional`.

- [ ] **Step 6: Run tests and confirm they pass**

Run: `npm test`

Expected: all practice and post tests pass.

## Task 2: Sidebar Collection Switch

**Files:**
- Modify: `components/practice/PracticeSidebar.tsx`
- Modify: `app/(site)/practice/layout.tsx`
- Modify: `lib/practice/categories.ts`

- [ ] **Step 1: Add collection metadata**

Add:

```ts
export const PRACTICE_COLLECTIONS = {
  handwriting: {
    id: "handwriting",
    title: "手写练习",
    description: "前端基础手写题，按知识点归档。",
    href: "/practice",
  },
  work: {
    id: "work",
    title: "工作收集",
    description: "工作中遇到的代码片段、伪代码、函数写法和实现思路。",
    href: "/practice/work",
  },
} as const;
```

- [ ] **Step 2: Render selector and description**

Add a native `<select>` at the top of desktop and mobile sidebar content. On change, navigate to the selected collection `href` with `useRouter().push(...)`.

- [ ] **Step 3: Pass collection from layout**

Keep root layout defaulting to handwriting. Work pages can still reuse the current layout if they render sidebar from the route state; if layout cannot know nested route collection cleanly, derive the active collection in the client sidebar from `usePathname()`.

- [ ] **Step 4: Run tests**

Run: `npm test`

Expected: tests still pass.

## Task 3: Work Routes And Detail Template

**Files:**
- Modify: `app/(site)/practice/page.tsx`
- Modify: `app/(site)/practice/[id]/page.tsx`
- Create: `app/(site)/practice/work/page.tsx`
- Create: `app/(site)/practice/work/[id]/page.tsx`

- [ ] **Step 1: Keep handwriting routes stable**

`/practice` redirects to `getAllProblems({ collection: "handwriting" })[0]`.

`/practice/[id]` loads only `collection: "handwriting"`.

- [ ] **Step 2: Add work index redirect**

`/practice/work` redirects to first work item. If no work item exists, render an empty state saying no work entries yet.

- [ ] **Step 3: Add work detail page**

Render:

```text
工作收集 / <group title> / <id>
标题
tags + updatedAt
场景
代码
记一下
optional sections
previous/next
```

Use `PracticeCodeBlock` for the source file and render the Markdown `代码` section as prose when it contains pseudocode or explanation.

- [ ] **Step 4: Run build**

Run: `npm run build`

Expected: Next build passes and includes `/practice/work` routes.

## Task 4: Final Verification And Push

**Files:**
- All changed files.

- [ ] **Step 1: Run full verification**

Run:

```bash
npm test
npm run lint
npm run build
```

Expected: all exit 0.

- [ ] **Step 2: Commit**

Run:

```bash
git add docs/superpowers/specs/2026-06-26-practice-collections-design.md docs/superpowers/plans/2026-06-26-practice-collections.md lib/practice components/practice app/(site)/practice tests/fixtures/practice tests/practice.test.ts
git commit -m "feat(practice): add work collection records"
```

- [ ] **Step 3: Push**

Run:

```bash
git push origin main
```

Expected: push succeeds.
