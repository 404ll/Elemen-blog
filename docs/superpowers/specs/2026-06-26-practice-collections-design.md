# Practice Collections Design

## Context

The `/practice` section currently renders one exercise library from the `practice/` submodule. It is labeled as code practice in the global nav, but the page title and content model still assume one collection: handwriting exercises.

The next content type is work-collected snippets: useful functions, implementation notes, and small code patterns collected from real work. These should live beside handwriting exercises without mixing their sidebar groups.

## Goals

- Add a first-level collection switch for `/practice`.
- Support two initial collections:
  - `handwriting`: 手写练习
  - `work`: 工作收集
- Keep the current Wiki layout: desktop sidebar, mobile drawer, detail page on the right.
- Use the selected collection to filter sidebar groups, problem count, detail breadcrumb, previous/next navigation, and `/practice` redirect behavior.
- Default `/practice` to the first handwriting exercise.
- Allow future collections without redesigning the page.

## Non-Goals

- Do not add search in this change.
- Do not build an editor or sandbox.
- Do not move practice entries into blog posts.
- Do not require the work collection to have many entries before the UI supports it.

## Interaction Design

Use layout option C from the visual review:

- Place a collection selector at the top of the practice sidebar.
- Under the selector, show a compact description for the current collection.
- Render only the groups and entries that belong to the selected collection.
- On mobile, show the same selector and description inside the drawer.

The selector should be obvious enough to discover, but it should not compete with the exercise detail content. This keeps the page feeling like a reference library rather than a landing page.

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

## Testing

Add focused tests for:

- Manifest schema accepts optional `collection`.
- Missing `collection` falls back to handwriting.
- Group and problem loaders filter by selected collection.
- Adjacent navigation stays inside the selected collection.
- Existing handwriting URLs still resolve.

## Open Decisions

- The initial work collection can start empty only if the UI handles an empty state. Prefer adding one real work item in the practice submodule when implementing the feature, so the selector has visible behavior.
