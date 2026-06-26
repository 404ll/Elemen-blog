# Practice Collections Design

## Context

The `/practice` section currently renders one exercise library from the `practice/` submodule. It is labeled as code practice in the global nav, but the page title and content model still assume one collection: handwriting exercises.

The next content type is work-collected snippets: useful functions, implementation notes, and small code patterns collected from real work. These should live beside handwriting exercises without mixing their sidebar groups, but they should not require the effort of writing full blog posts.

## Goals

- Add a first-level collection switch for `/practice`.
- Support two initial collections:
  - `handwriting`: 手写练习
  - `work`: 工作收集
- Keep the current Wiki layout: desktop sidebar, mobile drawer, detail page on the right.
- Use the selected collection to filter sidebar groups, problem count, detail breadcrumb, previous/next navigation, and `/practice` redirect behavior.
- Default `/practice` to the first handwriting exercise.
- Allow future collections without redesigning the page.
- Make work collection entries easy to write: a short scene, a code or pseudocode block, and a brief note are enough.

## Non-Goals

- Do not add search in this change.
- Do not build an editor or sandbox.
- Do not move practice entries into blog posts.
- Do not require the work collection to have many entries before the UI supports it.
- Do not require work entries to include article-level intros, transitions, conclusions, or exhaustive explanations.

## Interaction Design

Use layout option C from the visual review:

- Place a collection selector at the top of the practice sidebar.
- Under the selector, show a compact description for the current collection.
- Render only the groups and entries that belong to the selected collection.
- On mobile, show the same selector and description inside the drawer.

The selector should be obvious enough to discover, but it should not compete with the detail content. This keeps the page feeling like a reference library rather than a landing page.

## Work Entry Template

Work-collected entries use a lightweight record-card template, not a blog template. The author should only need to write:

```md
# 标题

## 场景
一句话说明这个代码是在什么情况下用到的。

## 代码
贴代码段或伪代码。

## 记一下
写当时觉得有意思、容易忘、下次能复用的点。
```

Optional sections are allowed but never required:

- `为什么这样写`
- `边界情况`
- `可复用场景`
- `相关链接`

The page should render only sections that exist. Empty optional headings should not appear. This keeps writing pressure low while still making the page more structured than a raw code dump.

## Detail Page Differences

Handwriting entries keep the current source-first detail page:

- Breadcrumb
- Title, difficulty, tags, GitHub source link
- 源码练习
- Optional 笔记记录
- Previous/next navigation

Work entries use a record-card detail page:

- Breadcrumb
- Title, tags, updated date, GitHub source link when available
- 场景
- 代码
- 记一下
- Optional sections when present
- Previous/next navigation

This makes the work collection visibly different from blog posts. Blog remains for polished long-form writing; work collection is for quick capture and later reuse.

## URL Design

Use path-based routes:

- `/practice` redirects to the first `handwriting` item.
- `/practice/[id]` keeps working for existing handwriting URLs.
- `/practice/work` redirects to the first work item.
- `/practice/work/[id]` shows a work-collected item.

This preserves existing links while giving work collection entries a stable namespace.

## Content Model

Extend `practice/manifest.json` entries with an optional `collection` field:

```json
{
  "id": "array-fill",
  "collection": "handwriting",
  "groupId": "array",
  "title": "手写 Array.prototype.fill"
}
```

If `collection` is missing, treat the problem as `handwriting` for backward compatibility.

Collection metadata should live in blog code first, not the submodule, so the UI can ship without requiring every old manifest to change:

- `handwriting`: 手写练习, description about frontend handwriting exercises.
- `work`: 工作收集, description about useful functions and snippets collected from work.

## Data Loading

Add loader helpers that filter by collection:

- `getPracticeCollections()`
- `getPracticeGroups({ collection })`
- `getAllProblems({ collection })`
- `getProblemById(id, { collection })`
- `getAdjacentProblems(id, { collection })`

Existing call sites without a collection continue to use handwriting.

For work entries, the loader should parse `article.md` sections by heading when present. The source file remains useful for syntax highlighting and GitHub links, but the author-facing record should be easy to write in Markdown.

## Testing

Add focused tests for:

- Manifest schema accepts optional `collection`.
- Missing `collection` falls back to handwriting.
- Group and problem loaders filter by selected collection.
- Adjacent navigation stays inside the selected collection.
- Existing handwriting URLs still resolve.
- Work entry notes can be parsed into `场景`, `代码`, and `记一下` sections without requiring optional sections.

## Open Decisions

- The initial work collection can start empty only if the UI handles an empty state. Prefer adding one real work item in the practice submodule when implementing the feature, so the selector has visible behavior.
