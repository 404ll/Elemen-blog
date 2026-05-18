# 手写练习模块（P0 + P1）Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 用 git submodule 挂载练习仓，在博客提供 `/practice` Wiki 壳（侧栏目录 + 详情）只读展示，练习仓 push 后由 GitHub Action 自动 bump 子模块并开 PR。

**Architecture:** 题目唯一来源是 `practice/`；`layout.tsx` 常驻 `PracticeSidebar`，`[id]` 渲染题面与 Shiki 代码。P2 Sandpack、P3 题库随机推荐不在本计划内。

**Tech Stack:** Next.js 16 App Router, TypeScript, Zod, Shiki, git submodule, GitHub Actions

**Spec:** [`docs/superpowers/specs/2026-05-18-handwriting-practice-design.md`](../specs/2026-05-18-handwriting-practice-design.md)

---

## File Map

| 文件 | 操作 | 说明 |
|------|------|------|
| `practice/` | **Submodule** | 指向 `elemen-handwriting-practice` |
| `lib/practice/types.ts` | Create | `PracticeProblem`, manifest 类型 |
| `lib/practice/schema.ts` | Create | Zod manifest 校验 |
| `lib/practice/loader.ts` | Create | 读 manifest、单题、源码字符串 |
| `lib/practice/highlight.ts` | Create | Shiki 高亮（`one-dark-pro`，与 MDX 一致） |
| `components/practice/PracticeSidebar.tsx` | Create | Wiki 侧栏（分组目录 + 移动抽屉） |
| `components/practice/PracticeCodeBlock.tsx` | Create | Shiki 高亮 |
| `components/practice/PracticeNav.tsx` | Create | 上/下题 |
| `app/(site)/practice/layout.tsx` | Create | Wiki 壳 |
| `app/(site)/practice/page.tsx` | Create | 重定向第一题 |
| `app/(site)/practice/[id]/page.tsx` | Create | 详情页 |
| `components/layout/Navbar.tsx` | Modify | 增加「手写练习」链接 |
| `tests/practice.test.ts` | Create | loader + schema 单测 |
| `tests/fixtures/practice/manifest.json` | Create | 测试用最小 manifest |
| `.github/workflows/sync-practice-submodule.yml` | Create | 放在**练习仓**（见 Task 8） |
| `package.json` | Modify | 可选 `practice:sync` script |
| `README.zh.md` | Done | 已文档化 submodule 模式 |

---

## Task 1: 创建练习仓并迁移 14 题（P0）

**Files:**
- Create: GitHub repo `elemen-handwriting-practice`（本地目录可在 `../elemen-handwriting-practice`）

- [ ] **Step 1: 初始化仓库结构**

```text
elemen-handwriting-practice/
├── README.md
├── manifest.json
└── problems/
    ├── array-fill/
    │   ├── prompt.md      # 可选，一行题意即可
    │   └── code.js        # 从 fill.js 复制
    ├── array-map/
    │   └── code.js
    └── ...                # 共 14 题
```

- [ ] **Step 2: 编写 `manifest.json`**

每题一条，`entry` 指向 `problems/<id>/code.js`。`id` 用 kebab-case（如 `array-fill`）。`virtualList.jsx` → `category: "react"`，其余按题意标 `array` / `function` / `async` / `oop`。

- [ ] **Step 3: 从 `learn/pracitice/` 复制源码**

源路径：`/Users/elemen/Myself/learn/pracitice/*.js`（及 `virtualList.jsx`）。保留原有注释与 `console.log` 示例，博客只展示不执行。

- [ ] **Step 4: Push 到 GitHub `main`**

```bash
cd ../elemen-handwriting-practice
git init && git add . && git commit -m "feat: initial 14 handwriting problems"
git remote add origin git@github.com:404ll/elemen-handwriting-practice.git
git push -u origin main
```

---

## Task 2: 博客添加 git submodule（P0）

**Files:**
- Create: `practice/` submodule
- Modify: `.gitmodules`

- [ ] **Step 1: 在博客根目录添加 submodule**

```bash
cd /Users/elemen/Myself/Elemen-blog
git submodule add https://github.com/404ll/elemen-handwriting-practice.git practice
git submodule update --init --recursive
```

- [ ] **Step 2: 验证 `practice/manifest.json` 可读**

```bash
cat practice/manifest.json
```

- [ ] **Step 3: Commit**

```bash
git add .gitmodules practice
git commit -m "chore: add practice submodule for handwriting exercises"
```

---

## Task 3: Practice loader 与 schema

**Files:**
- Create: `lib/practice/types.ts`
- Create: `lib/practice/schema.ts`
- Create: `lib/practice/loader.ts`
- Test: `tests/fixtures/practice/manifest.json`
- Test: `tests/practice.test.ts`

- [ ] **Step 1: 写失败测试**

`tests/practice.test.ts` 使用 fixture 目录（不依赖真实 submodule），测 `PracticeManifestSchema.parse` 与 `loadProblemsFromDir(fixtureDir)` 返回条数、`getProblemById('array-fill')` 读 `code` 字符串。

- [ ] **Step 2: 实现 schema**

```ts
// lib/practice/schema.ts
export const PracticeProblemSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  category: z.enum(["array", "function", "async", "react", "oop"]),
  difficulty: z.enum(["easy", "medium", "hard"]),
  tags: z.array(z.string()).optional(),
  entry: z.string().min(1),
  updatedAt: z.string().optional(),
});
export const PracticeManifestSchema = z.object({
  problems: z.array(PracticeProblemSchema).min(1),
});
```

- [ ] **Step 3: 实现 loader**

- `PRACTICE_ROOT = path.join(process.cwd(), "practice")`
- `loadManifest()` → 读 `manifest.json` + Zod
- `getAllProblems()` → 排序（`updatedAt` 降序，无则按 title）
- `getProblemById(id)` → 找 meta + `fs.readFileSync(path.join(PRACTICE_ROOT, entry), "utf8")`
- `getPromptMarkdown(id)` → 可选读 `problems/<id>/prompt.md`（与 entry 同目录推断或 manifest 扩展字段；P1 可约定 `problems/{id}/prompt.md`）

- [ ] **Step 4: 运行测试**

```bash
pnpm test
```

- [ ] **Step 5: Commit**

```bash
git add lib/practice tests
git commit -m "feat(practice): add manifest loader and schema tests"
```

---

## Task 4: Shiki 代码高亮组件

**Files:**
- Create: `lib/practice/highlight.ts`
- Create: `components/practice/PracticeCodeBlock.tsx`

- [ ] **Step 1: `highlight.ts`**

使用 `shiki` `createHighlighter`，theme `one-dark-pro`（与 `lib/mdx.ts` 一致）。导出 `highlightCode(source: string, lang: 'javascript' | 'jsx')`。

- [ ] **Step 2: `PracticeCodeBlock`**

Server Component：接收 `code` + `lang`，调用 highlight，渲染 `dangerouslySetInnerHTML` 或解析后的 `<pre>`；外包与文章页一致的容器 class（可参考 `MdxContent` 内 code 样式 / `CodeCopyButton` 可选 P1.1）。

- [ ] **Step 3: 本地 smoke**

在临时 route 或 Story 中渲染一段 `fill.js` 片段，确认高亮正常。

- [ ] **Step 4: Commit**

```bash
git add lib/practice/highlight.ts components/practice/PracticeCodeBlock.tsx
git commit -m "feat(practice): add Shiki code block for practice pages"
```

---

## Task 5: 列表页 `/practice`

**Files:**
- Create: `components/practice/PracticeCard.tsx`
- Create: `components/practice/PracticeFilter.tsx`（可选，YAGNI 可先静态分类）
- Create: `app/(site)/practice/page.tsx`

- [ ] **Step 1: `PracticeCard`**

Props: `id`, `title`, `category`, `difficulty`, `tags?`。`Link` → `/practice/${id}`。布局参考 `ProjectCard`（可后续换 `SketchBorder`，P1 先与 project 页一致）。

- [ ] **Step 2: 列表页 Server Component**

```tsx
import { getAllProblems } from "@/lib/practice/loader";
// map → PracticeCard grid
// 页面标题：手写练习；副标题一句说明「题目来自 practice 子仓库」
```

- [ ] **Step 3: `generateMetadata`**

`title: "手写练习"`, `description: "前端手写题归档与源码展示"`

- [ ] **Step 4: 浏览器验证**

`pnpm dev` → `http://localhost:3000/practice`（需 submodule 已 init）

- [ ] **Step 5: Commit**

```bash
git add app/(site)/practice components/practice
git commit -m "feat(practice): add practice list page"
```

---

## Task 6: 详情页 `/practice/[id]`

**Files:**
- Create: `app/(site)/practice/[id]/page.tsx`

- [ ] **Step 1: `generateStaticParams`**

```ts
export async function generateStaticParams() {
  return getAllProblems().map((p) => ({ id: p.id }));
}
```

- [ ] **Step 2: 详情布局**

- 返回链接 → `/practice`
- 标题、category、difficulty、tags
- `prompt.md` 若有则渲染为简单 markdown（P1 可用 `<pre>` 或轻量 `react-markdown`；YAGNI 可纯文本段落）
- `PracticeCodeBlock` 展示 `code.js`
- 页脚链到练习仓 GitHub 该文件路径（`repo/blob/main/${entry}`）

- [ ] **Step 3: `notFound()`**

未知 `id` 时 `notFound()`。

- [ ] **Step 4: 验证**

打开 `/practice/array-fill`（或你的第一个 id），暗色模式切换正常。

- [ ] **Step 5: Commit**

```bash
git add app/(site)/practice/[id]
git commit -m "feat(practice): add practice detail page with code highlight"
```

---

## Task 7: 导航栏入口

**Files:**
- Modify: `components/layout/Navbar.tsx`

- [ ] **Step 1: 在 `NAV_LINKS` 增加**

```ts
{ href: "/practice", label: "手写练习" },
```

建议放在「项目合集」与「关于我」之间。

- [ ] **Step 2: 验证移动端抽屉含新链接**

- [ ] **Step 3: Commit**

```bash
git add components/layout/Navbar.tsx
git commit -m "feat(practice): add navbar link to practice section"
```

---

## Task 8: GitHub Action（练习仓 → 博客 PR）

**Files:**
- Create: 在 **`elemen-handwriting-practice`** 仓库：`.github/workflows/sync-blog-submodule.yml`

> 注意：workflow 文件在**练习仓**，不在博客仓。

- [ ] **Step 1: 创建 PAT**

GitHub → Settings → Developer settings → PAT（classic 或 fine-grained），权限：`repo` + `pull_requests` on `Elemen-blog`。写入练习仓 secret：`BLOG_REPO_TOKEN`。

- [ ] **Step 2: Workflow 内容（PR 模式）**

```yaml
name: Sync blog submodule
on:
  push:
    branches: [main]
jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Bump submodule in blog
        env:
          TOKEN: ${{ secrets.BLOG_REPO_TOKEN }}
        run: |
          git clone https://x-access-token:${TOKEN}@github.com/404ll/Elemen-blog.git blog
          cd blog
          git submodule update --init practice
          cd practice && git fetch origin main && git checkout origin/main && cd ..
          git add practice
          git diff --staged --quiet && exit 0
          git checkout -b chore/sync-practice-$(date +%Y%m%d%H%M%S)
          git commit -m "chore: sync practice submodule"
          git push origin HEAD
          gh pr create --title "chore: sync practice submodule" --body "Auto bump from practice repo push" || true
```

（实施时按实际 org/repo 名调整；若无 `gh` CLI 可用 `actions/github-script` 创建 PR。）

- [ ] **Step 3: 在练习仓 push workflow 并做一次端到端测试**

改 `manifest.json` 一行 → push → 博客出现 PR → merge → Vercel 部署。

- [ ] **Step 4: 文档**

README.zh 已说明；练习仓 README 补一句 Action 用途。

---

## Task 9: Vercel 与子模块构建

**Files:**
- Modify: Vercel Project Settings 或 `package.json` scripts

- [ ] **Step 1: 确认 Vercel 拉取 submodule**

Project Settings → Git → **Include Git Submodules** 开启；或在 Install Command：

```bash
git submodule update --init --recursive && pnpm install
```

- [ ] **Step 2: 本地生产构建验证**

```bash
git submodule update --init --recursive
pnpm build
```

无 submodule 时应明确失败（loader 读不到 manifest）。

- [ ] **Step 3: 部署后检查 `/practice`**

- [ ] **Step 4: Commit（若改了 vercel 相关脚本）**

```bash
git commit -m "chore: ensure submodule init in build"
```

---

## Task 10: 可选 `practice:sync` 脚本

**Files:**
- Modify: `package.json`

- [ ] **Step 1: 添加 script**

```json
"practice:sync": "git submodule update --remote practice && git add practice"
```

- [ ] **Step 2: Commit**

```bash
git add package.json
git commit -m "chore: add practice:sync script for manual submodule bump"
```

---

## 验收清单（P1 Done）

- [ ] `practice/` submodule 指向最新练习仓
- [ ] `/practice` 列出 manifest 中全部题目
- [ ] `/practice/[id]` 展示题面（若有）与高亮源码
- [ ] Navbar 可进入手写练习
- [ ] `pnpm test` 通过 practice 相关测试
- [ ] `pnpm build` 成功
- [ ] 练习仓 push → 博客自动 PR → 合并后线上更新

---

## 明确不在本计划

- Sandpack 编辑器与判题（P2）
- 从题库随机抽题 / AI（P3）
- 用户登录与进度
