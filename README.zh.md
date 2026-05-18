<div align="center">
  <h1>🧩 Elemen — 技术博客</h1>
  <p><strong>前端 × Web3 · 像素美学 · MDX 驱动</strong></p>
  
  <p>
    <a href="./README.md">🌍 English Version</a>
  </p>
</div>

---

## 🚀 关于本博客

这是一个融合 **Web2 前端工程** 与 **Web3 技术** 的个人技术空间，基于最新的现代技术栈构建：

- **Next.js 16 App Router**
- **React 19**
- **TypeScript**
- **TailwindCSS v4**
- **MDX 内容系统**

博客内容涵盖前端工程、区块链技术、智能合约、Move/Solidity、UI/UX，以及我的组件库。

站点包含 **博客文章**（`/blog`）、**项目合集**（`/project`）、**手写练习**（`/practice`，Wiki 式目录 + 源码展示）、**关于我**（`/about`）。

---

## 🧰 技术栈

| 分类 | 技术 |
|------|------|
| **框架** | Next.js 16 (App Router, Server Components, ISR) |
| **UI** | React 19, TailwindCSS v4, Framer Motion |
| **内容** | MDX, Shiki (代码高亮), Remark GFM |
| **搜索** | Fuse.js (模糊搜索) |
| **开发体验** | TypeScript, Turbopack, Husky, ESLint |

---

## 🎨 特性

- 🔤 **基于 MDX 的文章系统** — 支持组件化写作
- ✍️ **手写练习** — `practice/` 子模块题库，`/practice` 侧栏浏览题面与源码
- 🔍 **模糊搜索** — Fuse.js 实现即时文章搜索
- 🌙 **暗黑模式** — 跟随系统主题自动切换
- ⚡ **ISR 增量静态生成** — 快速构建，内容即时更新
- 🎮 **复古像素美学** — 自定义字体与 2-bit 风格
- 📱 **响应式设计** — 移动端优先

---

## 📁 项目结构

```
app/
├── (site)/
│   ├── blog/          # 博客列表与文章页
│   ├── practice/      # 手写练习（Wiki 布局）
│   ├── project/       # 项目展示
│   └── about/         # 关于我
├── fonts/             # 本地字体 (JetBrains Mono, Zen Maru Gothic)
└── layout.tsx         # 根布局

content/               # MDX 文章
practice/              # git submodule（手写题 manifest + 源码）
components/            # 可复用组件
lib/                   # 工具函数 (MDX, 文章, practice)
scripts/               # 开发脚本 (new-post CLI)
```

---

## 🚀 快速开始

```bash
git clone --recurse-submodules https://github.com/404ll/Elemen-blog.git
cd Elemen-blog
pnpm install
pnpm dev
```

```bash
# 生产构建
pnpm build

# 新建文章（交互式 CLI）
npm run new-post

# 同步 practice 子模块
pnpm practice:sync
```

---

## 📄 许可证

MIT
