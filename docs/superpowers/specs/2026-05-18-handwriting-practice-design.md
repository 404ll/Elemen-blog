# 前端手写练习模块 — 设计规格文档

**日期：** 2026-05-18  
**范围：** 博客内「手写练习」展示模块（子仓库 + 列表/详情）；编辑器与 AI 为后续可选  
**状态：** 已批准（2026-05-18 修订：以展示为主，AI 暂不纳入）

---

## 1. 目标与约束

### 1.1 目标

- **博客职责**：展示与索引练习仓里的代码——博客不维护题库副本，构建时从 submodule 读取并渲染（Shiki 高亮 + 题面）。
- 手写题归档在**独立公开 Git 仓库**，通过 **git submodule** 链入博客（`practice/`），与 MDX 文章分离。
- **当前阶段（P1）**：`/practice` 列表 + `/practice/[id]` 详情（题面 + 源码展示，只读）。
- 练习仓 `push` 后，**GitHub Action** bump 博客 submodule 并开 PR，合并后 Vercel 部署更新线上。
- **后续可选（非本期）**：Sandpack 站内练习（P2）；从练习仓已有题目中随机抽一题推荐（P3，见 §6）。

### 1.2 已确认决策

| 项 | 选择 |
|----|------|
| 博客与题库 | 博客只展示练习仓内容，题目唯一来源是 submodule |
| 部署 | 公开子仓库 + 博客公开部署 |
| **当前重点** | **P1 只读展示** |
| 子仓库 → 博客同步 | P1 起 GitHub Action（PR 模式） |
| 子仓库名 | `elemen-handwriting-practice`（默认） |
| AI | **本期不做**；远期仅从 manifest 已有题目中随机/筛选，不 LLM 造题 |
| **展示形态** | **Wiki 壳**（侧栏目录 + 主内容区，OpenWiki 风格） |

### 1.3 非目标（本期不做）

- 用户账号、进度持久化、排行榜
- 服务端执行用户提交的任意 JS（P2 也用浏览器 Sandpack，非本期）
- **LLM 生成新题目**或 AI 自动写入练习仓
- 博客内维护与练习仓重复的题库文件

---

## 2. 整体架构（P1）

```
┌─────────────────────────────────────────────────────────┐
│  Elemen-blog (Next.js 16, Vercel)                        │
│  ┌─────────────┐  ┌──────────────────┐                  │
│  │ /practice   │  │ /practice/[id]    │                  │
│  │ 题目列表     │  │ 题面 + 源码展示    │  （P1 只读）      │
│  └──────┬──────┘  └────────┬─────────┘                  │
│         │ 构建时 fs 读取    │                            │
│         └──────────────────┘                            │
│              practice/ (git submodule)                   │
└──────────────────────────┼──────────────────────────────┘
                           │
              ┌────────────▼────────────┐
              │ elemen-handwriting-       │
              │ practice (GitHub 公开)    │
              │ manifest.json + problems/ │
              └────────────────────────────┘

练习仓 push → GitHub Action → 博客仓 PR (bump submodule) → merge → Vercel deploy
```

P2/P3 组件在架构上预留，**实施计划仅覆盖 P0 + P1**。

---

## 3. 子仓库结构

仓库：`elemen-handwriting-practice`（公开）

```
elemen-handwriting-practice/
├── README.md
├── manifest.json
└── problems/
    └── <id>/
        ├── prompt.md       # 题面说明（可选，无则用 title）
        ├── code.js         # 你的手写实现（P1 展示主文件）
        └── ...             # P2 可再拆 template / tests
```

**P1 简化**：迁移时可将现有单文件（如 `fill.js`）直接作为 `code.js`，`manifest.entry` 指向该文件；不必一期就拆 template/solution/tests。

### 3.1 `manifest.json`

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | string | URL slug → `/practice/array-fill` |
| `title` | string | 展示标题 |
| `category` | enum | `array` \| `function` \| `async` \| `react` \| `oop` |
| `difficulty` | enum | `easy` \| `medium` \| `hard` |
| `tags` | string[] | 可选 |
| `entry` | string | 如 `problems/fill/code.js` |
| `updatedAt` | string | ISO 8601 |

### 3.2 初始迁移

从 `learn/pracitice/`（14 个文件）迁入；`virtualList.jsx` → `category: react`。

---

## 4. 博客侧实现（P1）

### 4.1 Submodule

- 路径：`practice/`
- 本地：`git submodule add <url> practice`

### 4.2 路由（Wiki 壳）

| 路由 | 职责 |
|------|------|
| `/practice` | 重定向到 manifest 中第一题（或欢迎页） |
| `/practice/[id]` | 共享 `layout`：左侧目录 + 右侧题面与源码 |

桌面端侧栏常驻；移动端侧栏收成抽屉（☰）。换题时仅右侧内容变化。

Navbar 增加「手写练习」。

### 4.3 组件（P1 最小集）

```
app/(site)/practice/layout.tsx       # Wiki 壳：侧栏 + children
app/(site)/practice/page.tsx         # redirect → 第一题
app/(site)/practice/[id]/page.tsx    # 题面 + 代码 + 上/下题

components/practice/
  PracticeSidebar.tsx     # 按 category 分组目录，高亮当前 id
  PracticeCodeBlock.tsx   # Shiki 高亮
  PracticeNav.tsx         # 上一题 / 下一题

lib/practice/
  loader.ts
  types.ts
  highlight.ts
  categories.ts           # category → 中文标签
```

**不纳入 P1**：`PracticeEditor`、`PracticeAiPanel`、`/api/practice/*`。

### 4.4 `loader.ts`

- Server-only `fs.readFileSync` / `readFile`。
- `generateStaticParams` 来自 `manifest.problems[].id`。
- 子模块缺失时构建失败（CI 与 README 已说明 `recurse-submodules`）。

### 4.5 Vercel

- `git submodule update --init --recursive` 于安装/构建阶段。

---

## 5. 站内练习（P2，后续）

- Sandpack + `tests.js` 判题；`solution` 默认折叠。
- 本期不实施。

---

## 6. 随机推荐（P3，后续，非 LLM 造题）

- **行为**：从 `manifest.json` 已有 `problems` 中按 `category` / `difficulty` 随机选一道，跳转到 `/practice/[id]` 或列表内高亮。
- **可不调用 LLM**：纯 `Math.random` + 筛选即可；若用 AI，仅作「选题建议/排序」，**不生成新题干或新代码**。
- **本期不做**。

---

## 7. GitHub Action：子仓库 → 博客同步（P1）

### 7.1 触发

- 仓库：`elemen-handwriting-practice`，`push` → `main`

### 7.2 行为（PR 模式）

1. Checkout `Elemen-blog`（`BLOG_REPO_TOKEN`）
2. `git submodule update --remote practice`
3. 有 diff → commit → 开 PR `chore: sync practice @<sha>`
4. 合并 → Vercel 部署

### 7.3 Secrets

| Secret | 仓库 | 说明 |
|--------|------|------|
| `BLOG_REPO_TOKEN` | practice | PAT：`repo` + `pull_requests` on Elemen-blog |

---

## 8. 分期交付

| 阶段 | 交付物 | 本期 |
|------|--------|------|
| **P0** | 练习仓 + 迁移 14 题 + 博客 `submodule add` | ✅ |
| **P1** | `/practice` 列表/详情只读、Navbar、Action、Vercel submodule | ✅ |
| **P2** | Sandpack 可练可判题 | 后续 |
| **P3** | 从题库随机抽题（非造题） | 后续 |

---

## 9. 错误处理与测试

- 子模块缺失 → 构建失败
- manifest Zod 校验
- `loader` 单元测试（fixture manifest）

---

## 10. 依赖（P1）

| 包 | 阶段 |
|----|------|
| `zod` | P1 manifest 校验（已有） |
| `@codesandbox/sandpack-react` | P2 |
| LLM SDK | 不做（P3 也可能不需要） |

---

## 11. 参考

- 练习源：`/Users/elemen/Myself/learn/pracitice/`
- 列表 UI 参考：`app/(site)/project/page.tsx`
- 修订：2026-05-18（展示为主，AI 不纳入本期）
