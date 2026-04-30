# Blog Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 全站视觉重构——暖橙渐变背景 + SVG 不规则手绘边框卡片 + 方形等宽标签，去除所有阴影和浮层感。

**Architecture:** 新增一个 `SketchBorder` 共用组件，所有卡片统一用它替换原有的 `rounded-2xl shadow-lg`。标签样式从 `constant/index.ts` 的 `COLOR_STYLES` 统一改为方形等宽边框。全局背景色在 `globals.css` 的 CSS 变量一处改完，其余文件不涉及背景。

**Tech Stack:** Next.js 15, Tailwind CSS v4, TypeScript, inline SVG

---

## File Map

| 文件 | 操作 | 说明 |
|------|------|------|
| `app/globals.css` | Modify | 改 `--gradient-bg` 为暖橙渐变 |
| `components/ui/SketchBorder.tsx` | **Create** | 新增不规则边框组件 |
| `constant/index.ts` | Modify | `COLOR_STYLES` badge 样式改为方形等宽 |
| `components/layout/Navbar.tsx` | Modify | 背景暖色 + 底线 + 活跃链接下划线 |
| `components/card/ArticleList.tsx` | Modify | 用 SketchBorder 替换圆角阴影卡片 |
| `components/card/ArticleCard.tsx` | Modify | 日期去 emoji，Read More 改文字链接 |
| `components/card/SelfCard.tsx` | Modify | 移除 SunCard，改用 SketchBorder + 统计卡片 |
| `components/card/CategoryCard.tsx` | Modify | 容器改方形边框，分类改左竖线列表 |
| `components/card/ProjectCard.tsx` | Modify | SketchBorder 替换，移除顶部彩条 |
| `app/(site)/blog/[...slug]/page.tsx` | Modify | 容器去阴影圆角，header 加波浪分隔线，tags 改纯文字 |
| `app/(site)/about/page.tsx` | Modify | 3 个卡片改 SketchBorder，列表改左竖线 |

---

## Task 1: 全局背景色改为暖橙渐变

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: 修改 CSS 变量**

打开 `app/globals.css`，找到 `:root` 和 `.dark` 中的 `--gradient-bg`，替换为：

```css
:root {
  /* 其他变量保持不变，只改这一行 */
  --gradient-bg: linear-gradient(180deg, #fff4e6 0%, #fafaf8 100%);
}

.dark {
  /* 只改这一行 */
  --gradient-bg: linear-gradient(180deg, #1a0f00 0%, #0f0f0e 100%);
}
```

- [ ] **Step 2: 启动开发服务器验证**

```bash
cd /Users/0xelemen/myself/Elemen-blog
npm run dev
```

在浏览器打开 `http://localhost:3000`，确认背景由蓝天渐变变为暖橙→米白渐变。切换 dark mode 确认深琥珀黑色渐变生效。

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "style: change background gradient to warm orange"
```

---

## Task 2: 新建 SketchBorder 组件

**Files:**
- Create: `components/ui/SketchBorder.tsx`

- [ ] **Step 1: 创建组件文件**

```tsx
// components/ui/SketchBorder.tsx
interface SketchBorderProps {
  children: React.ReactNode;
  className?: string;
}

export default function SketchBorder({ children, className = "" }: SketchBorderProps) {
  return (
    <div className={`relative ${className}`}>
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible text-black dark:text-white"
        viewBox="0 0 400 200"
        preserveAspectRatio="none"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M4,4 Q100,2 200,3 Q300,1 396,4 Q398,50 397,100 Q398,150 396,196 Q300,198 200,197 Q100,199 4,196 Q2,150 3,100 Q2,50 4,4Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
      {children}
    </div>
  );
}
```

- [ ] **Step 2: 验证组件可以被 import**

```bash
cd /Users/0xelemen/myself/Elemen-blog
npx tsc --noEmit
```

Expected: 无报错。

- [ ] **Step 3: Commit**

```bash
git add components/ui/SketchBorder.tsx
git commit -m "feat: add SketchBorder component with irregular SVG border"
```

---

## Task 3: 更新全局标签样式（COLOR_STYLES）

**Files:**
- Modify: `constant/index.ts`

- [ ] **Step 1: 将 badge 样式改为方形等宽边框**

用以下内容完整替换 `COLOR_STYLES` 对象（`card` 样式也一并简化，去掉纯色背景）：

```ts
export const COLOR_STYLES = {
  blue: {
    badge: "border border-blue-600 text-blue-700 dark:border-blue-400 dark:text-blue-300 font-mono text-xs tracking-wider",
    card: "border-l-2 border-blue-600 dark:border-blue-400",
  },
  green: {
    badge: "border border-green-600 text-green-700 dark:border-green-400 dark:text-green-300 font-mono text-xs tracking-wider",
    card: "border-l-2 border-green-600 dark:border-green-400",
  },
  purple: {
    badge: "border border-purple-600 text-purple-700 dark:border-purple-400 dark:text-purple-300 font-mono text-xs tracking-wider",
    card: "border-l-2 border-purple-600 dark:border-purple-400",
  },
  gray: {
    badge: "border border-gray-500 text-gray-600 dark:border-gray-400 dark:text-gray-300 font-mono text-xs tracking-wider",
    card: "border-l-2 border-gray-500 dark:border-gray-400",
  },
  orange: {
    badge: "border border-orange-600 text-orange-700 dark:border-orange-400 dark:text-orange-300 font-mono text-xs tracking-wider",
    card: "border-l-2 border-orange-600 dark:border-orange-400",
  },
} as const;
```

- [ ] **Step 2: 验证类型无误**

```bash
npx tsc --noEmit
```

Expected: 无报错。

- [ ] **Step 3: 在浏览器确认标签变为方形边框样式**

访问 `http://localhost:3000`，文章卡片的分类标签应变为方形带色边框、无背景填充。

- [ ] **Step 4: Commit**

```bash
git add constant/index.ts
git commit -m "style: change category badges to square outlined monospace style"
```

---

## Task 4: 更新 Navbar

**Files:**
- Modify: `components/layout/Navbar.tsx`

- [ ] **Step 1: 修改 nav 背景和底线**

找到 `<nav className="w-full flex items-center ...">` 这行，将 className 改为：

```tsx
<nav className="w-full flex items-center justify-between p-4 text-black dark:text-white fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-[#fff4e6]/80 dark:bg-[#1a0f00]/80 border-b border-orange-200/60 dark:border-orange-900/40 transition-colors duration-300">
```

- [ ] **Step 2: 添加活跃链接下划线**

在文件顶部的 import 区添加 `usePathname`：

```tsx
'use client';
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { SunIcon, MoonIcon, GithubIcon, MenuIcon, XIcon } from "lucide-react";
import { useTheme } from "next-themes";
```

在组件函数体内（`const { setTheme, resolvedTheme } = useTheme();` 下方）添加：

```tsx
const pathname = usePathname();
```

- [ ] **Step 3: 更新桌面端导航链接 className**

找到桌面端导航链接的 map，将 `<Link>` 的 className 改为：

```tsx
<Link
  key={link.href}
  href={link.href}
  className={`text-xl font-semibold font-zenmaru transition-opacity focus:outline-none rounded-lg p-2 hover:opacity-60 ${
    pathname === link.href || pathname.startsWith(link.href + '/')
      ? 'border-b-2 border-black dark:border-white opacity-100'
      : 'opacity-70'
  }`}
>
  {link.label}
</Link>
```

- [ ] **Step 4: 验证 Navbar 效果**

访问 `http://localhost:3000`，确认：
- Navbar 背景为暖橙半透明
- 当前页面对应的导航链接有黑色下划线
- 切换 dark mode 后底线为白色

- [ ] **Step 5: Commit**

```bash
git add components/layout/Navbar.tsx
git commit -m "style: update navbar to warm bg, active link underline"
```

---

## Task 5: 更新 ArticleList 和 ArticleCard

**Files:**
- Modify: `components/card/ArticleList.tsx`
- Modify: `components/card/ArticleCard.tsx`

- [ ] **Step 1: 更新 ArticleList，用 SketchBorder 替换圆角阴影**

完整替换 `components/card/ArticleList.tsx`：

```tsx
import ArticleCard from "./ArticleCard";
import SketchBorder from "@/components/ui/SketchBorder";
import type { Post } from "@/types";

export default function ArticleList({ posts }: { posts: Post[] }) {
  return (
    <div className="space-y-4 mt-4">
      {posts.length > 0 ? (
        posts.map((post) => (
          <SketchBorder
            key={post.slug}
            className="bg-white/85 dark:bg-gray-900/85 p-6 transition-transform hover:-translate-y-1"
          >
            <ArticleCard post={post} />
          </SketchBorder>
        ))
      ) : (
        <SketchBorder className="p-8 text-center bg-white/85 dark:bg-gray-900/85">
          <p className="text-gray-500 font-zenmaru dark:text-gray-400">No articles yet. Check back soon!</p>
        </SketchBorder>
      )}
    </div>
  );
}
```

- [ ] **Step 2: 更新 ArticleCard，去 emoji、改 Read More 样式**

找到日期显示部分，将：
```tsx
{displayDate && (
  <span className="inline-flex items-center gap-1">
    📅 {displayDate}
  </span>
)}
```
改为：
```tsx
{displayDate && (
  <span className="inline-flex items-center gap-1 font-mono text-xs text-gray-400 dark:text-gray-500">
    {displayDate}
  </span>
)}
```

找到 `article-read-more`，将：
```tsx
<Link 
  href={href}
  className="article-read-more"
>
  Read More
</Link>
```
改为：
```tsx
<Link
  href={href}
  className="inline-flex items-center gap-1 font-mono text-sm font-bold text-black dark:text-white border-b border-black dark:border-white hover:opacity-60 transition-opacity"
>
  Read More →
</Link>
```

- [ ] **Step 3: 验证文章列表效果**

访问 `http://localhost:3000`，确认：
- 文章卡片有不规则 SVG 边框，无阴影
- 日期无 📅 emoji，改为灰色等宽字体
- "Read More" 变为带下划线的文字链接

- [ ] **Step 4: Commit**

```bash
git add components/card/ArticleList.tsx components/card/ArticleCard.tsx
git commit -m "style: replace article cards with SketchBorder, update Read More link"
```

---

## Task 6: 更新 SelfCard（移除 SunCard，改为简洁 Hero）

**Files:**
- Modify: `components/card/SelfCard.tsx`

- [ ] **Step 1: 完整替换 SelfCard**

`SunCard` 移除后，右侧改为一个简洁的统计卡片（文章数、分类数）。完整替换 `components/card/SelfCard.tsx`：

```tsx
import Image from "next/image";
import SketchBorder from "@/components/ui/SketchBorder";
import { PROFILE } from "@/config/profile";

interface SelfCardProps {
  postCount?: number;
  categoryCount?: number;
}

export default function SelfCard({ postCount = 0, categoryCount = 0 }: SelfCardProps) {
  return (
    <SketchBorder className="bg-white/85 dark:bg-gray-900/85 p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">

        {/* 左侧：文字信息 */}
        <div className="flex flex-col text-black dark:text-white space-y-4 md:max-w-lg">
          <div className="flex items-center gap-3">
            <Image
              src="/icon/sun.png"
              alt="logo"
              width={40}
              height={40}
              className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/50 p-2 rounded-full"
            />
            <span className="text-xl md:text-2xl font-bold tracking-tight font-zenmaru">
              Hello, I&apos;m {PROFILE.name}!
            </span>
          </div>

          <div className="flex gap-2 flex-wrap">
            {PROFILE.tags.map((tag) => (
              <span
                key={tag.label}
                className="px-2 py-1 border border-black dark:border-white font-mono text-xs font-bold tracking-wider"
              >
                {tag.label.toUpperCase()}
              </span>
            ))}
          </div>

          <div className="border-l-2 border-black dark:border-white pl-3 text-gray-700 dark:text-gray-300 font-zenmaru text-sm leading-relaxed space-y-1">
            <p>Web developer & blockchain developer.</p>
            <p>Learning in public, building things.</p>
          </div>
        </div>

        {/* 右侧：简洁统计 */}
        <div className="flex md:flex-col gap-6 md:gap-4 md:items-end">
          <div className="text-center md:text-right">
            <div className="font-mono text-4xl font-black text-black dark:text-white">{postCount}</div>
            <div className="font-mono text-xs text-gray-400 dark:text-gray-500 tracking-widest uppercase mt-1">Articles</div>
          </div>
          <div className="text-center md:text-right">
            <div className="font-mono text-4xl font-black text-black dark:text-white">{categoryCount}</div>
            <div className="font-mono text-xs text-gray-400 dark:text-gray-500 tracking-widest uppercase mt-1">Topics</div>
          </div>
        </div>

      </div>
    </SketchBorder>
  );
}
```

- [ ] **Step 2: 更新 HomeClient，传入 postCount 和 categoryCount，同时更新 mobile chips 样式**

打开 `app/HomeClient.tsx`，做以下两处修改：

**2a. 更新 mobile chips 样式**（保留 `getColorStyle` import，但改 chip 的 className）

找到 mobile chips 的 `<Link>` className：
```tsx
className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-bold transition-all shadow-sm ${getColorStyle(category.color, 'badge')}`}
```
改为：
```tsx
className="flex-shrink-0 px-2 py-1 border border-black dark:border-white font-mono text-xs font-bold tracking-wider text-black dark:text-white transition-all"
```
（不再使用 `getColorStyle`，可以同时删掉该 import）

**2b. 删掉 `getColorStyle` import**，将：
```tsx
import { CATEGORIES, getColorStyle } from "@/constant";
```
改为：
```tsx
import { CATEGORIES } from "@/constant";
```

**2c. 给 SelfCard 传入数据**，找到 `<SelfCard />` 那一行，改为：
```tsx
<SelfCard postCount={posts.length} categoryCount={Object.keys(CATEGORIES).length} />
```

- [ ] **Step 3: 验证首页 Hero**

访问 `http://localhost:3000`，确认：
- Hero 区域有不规则边框
- 右侧显示文章数和分类数（大数字 + 等宽小标签）
- WebGL 太阳 canvas 已消失

- [ ] **Step 4: Commit**

```bash
git add components/card/SelfCard.tsx app/HomeClient.tsx
git commit -m "style: replace SunCard with stats card in SelfCard hero"
```

---

## Task 7: 更新 CategoryCard

**Files:**
- Modify: `components/card/CategoryCard.tsx`

- [ ] **Step 1: 完整替换 CategoryCard**

```tsx
'use client';
import Link from "next/link";
import { CATEGORIES } from "@/constant";

export default function CategoryCard() {
  return (
    <div className="sticky top-24">
      <div className="border border-black dark:border-white bg-white/85 dark:bg-gray-900/85 p-5">
        <h2 className="font-mono text-xs font-bold tracking-widest uppercase text-black dark:text-white mb-4">
          Categories
        </h2>
        <div className="flex flex-col gap-2">
          {Object.entries(CATEGORIES).map(([key, category]) => (
            <Link
              key={category.name}
              href={`/blog/category/${key}`}
              aria-label={`查看 ${category.name} 分类`}
              className="block px-3 py-2 border-l-2 border-black dark:border-white font-mono text-sm font-bold text-black dark:text-white hover:opacity-60 hover:-translate-y-0.5 transition-all"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 验证侧边栏**

访问 `http://localhost:3000`（桌面端宽度），右侧侧边栏应变为方形边框 + 左竖线列表。

- [ ] **Step 3: Commit**

```bash
git add components/card/CategoryCard.tsx
git commit -m "style: update CategoryCard to square border with left-line list"
```

---

## Task 8: 更新 ProjectCard

**Files:**
- Modify: `components/card/ProjectCard.tsx`

- [ ] **Step 1: 完整替换 ProjectCard**

```tsx
import Link from "next/link";
import SketchBorder from "@/components/ui/SketchBorder";

export type Project = {
  name: string;
  description: string;
  repo?: string;
  source: string;
  article?: string;
  tags?: string[];
};

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const { name, description, repo, source, article, tags = [] } = project;

  return (
    <div className="relative h-full group">
      {repo && (
        <Link
          href={repo}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${name} 的${repo.includes('github.com') ? '仓库' : '链接'}`}
          className="absolute inset-0 z-0 rounded-none"
        />
      )}

      <SketchBorder className="relative z-10 h-full bg-white/85 dark:bg-gray-900/85 p-5 transition-transform group-hover:-translate-y-1 pointer-events-none">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <span className="font-mono text-xs font-bold tracking-wider border border-black dark:border-white px-2 py-0.5 text-black dark:text-white">
                {source.toUpperCase()}
              </span>
              <h3 className="text-lg font-bold text-black dark:text-white font-zenmaru leading-tight mt-1">
                {name}
              </h3>
            </div>
            {repo && (
              <span className="font-mono text-xs font-bold text-black dark:text-white opacity-50 flex-shrink-0">
                {repo.includes('github.com') ? 'GH' : '↗'}
              </span>
            )}
          </div>

          <p className="font-mono text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{description}</p>

          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-xs text-gray-500 dark:text-gray-400"
              >
                #{tag}
              </span>
            ))}
          </div>

          {article && (
            <Link
              href={article}
              target="_blank"
              rel="noopener noreferrer"
              className="pointer-events-auto inline-flex items-center gap-1 font-mono text-xs font-bold text-black dark:text-white border-b border-black dark:border-white hover:opacity-60 transition-opacity"
            >
              阅读文章 →
            </Link>
          )}
        </div>
      </SketchBorder>
    </div>
  );
}
```

- [ ] **Step 2: 验证项目页**

访问 `http://localhost:3000/project`，确认：
- 卡片有不规则边框，无顶部彩条，无阴影
- tags 变为 `#tag` 纯文字格式
- source badge 变为方形等宽边框

- [ ] **Step 3: Commit**

```bash
git add components/card/ProjectCard.tsx
git commit -m "style: update ProjectCard to SketchBorder, remove gradient bar and shadows"
```

---

## Task 9: 更新文章详情页

**Files:**
- Modify: `app/(site)/blog/[...slug]/page.tsx`

- [ ] **Step 1: 修改整体容器样式**

找到最外层 `<div className="mt-20 pb-16 mb-10 shadow-lg font-zenmaru ... bg-white dark:bg-gray-900 xl:pr-72">`，改为：

```tsx
<div className="mt-20 pb-16 mb-10 font-zenmaru selection:bg-orange-100 dark:selection:bg-orange-900 selection:text-orange-900 dark:selection:text-orange-100 max-w-6xl mx-auto xl:pr-72 bg-white/85 dark:bg-gray-900/85 border-x border-black/10 dark:border-white/10 transition-colors">
```

（移除 `shadow-lg rounded-2xl`，改为 `border-x`，选中色从蓝改为橙）

- [ ] **Step 2: 修改 category badge**

找到 category 显示：
```tsx
<span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-semibold border border-blue-200 dark:border-blue-800 transition-colors">
  {frontmatter.category}
</span>
```
改为：
```tsx
<span className="px-2 py-0.5 font-mono text-xs font-bold tracking-wider border border-black dark:border-white text-black dark:text-white uppercase">
  {frontmatter.category}
</span>
```

- [ ] **Step 3: 修改 tags 样式**

找到 tags 渲染，将每个 `<span>` 改为：
```tsx
{tags.map((tag: string) => (
  <span
    key={tag}
    className="font-mono text-xs text-gray-400 dark:text-gray-500"
  >
    #{tag}
  </span>
))}
```
（移除灰色背景 chip，改为纯文字 `#tag`）

- [ ] **Step 4: 在 header 底部加手绘波浪分隔线**

找到 `</header>` 标签，在它下方、`</div>` 之前插入：

```tsx
<svg
  className="w-full mt-6"
  height="6"
  viewBox="0 0 800 6"
  preserveAspectRatio="none"
  fill="none"
  aria-hidden="true"
>
  <path
    d="M0,3 Q100,1 200,4 Q300,6 400,3 Q500,0 600,3 Q700,5 800,3"
    stroke="currentColor"
    strokeWidth="1"
    className="text-black/20 dark:text-white/20"
  />
</svg>
```

- [ ] **Step 5: 验证文章详情页**

访问任意一篇文章，确认：
- 整体容器无圆角阴影，左右有细线边框
- category badge 为方形等宽大写
- tags 为 `#tag` 纯文字
- header 底部有手绘波浪分隔线
- 文字选中高亮为橙色

- [ ] **Step 6: Commit**

```bash
git add "app/(site)/blog/[...slug]/page.tsx"
git commit -m "style: update article page container, badges, tags, add wave divider"
```

---

## Task 10: 更新 About 页

**Files:**
- Modify: `app/(site)/about/page.tsx`

- [ ] **Step 1: 替换 3 个卡片容器**

找到 3 处 `<div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg">`，全部替换为 SketchBorder 包裹形式。

首先在文件顶部添加 import：
```tsx
import SketchBorder from '@/components/ui/SketchBorder';
```

然后将 3 处卡片容器从：
```tsx
<div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
  {/* 内容 */}
</div>
```
改为：
```tsx
<SketchBorder className="bg-white/85 dark:bg-gray-900/85 p-8">
  {/* 内容 */}
</SketchBorder>
```

- [ ] **Step 2: 更新 tags 样式**

找到个人信息卡片中的 tags 渲染：
```tsx
{PROFILE.tags.map((tag) => (
  <span key={tag.label} className={`px-3 py-1.5 ${tag.color} text-xs font-bold rounded-full shadow-sm`}>
    {tag.label}
  </span>
))}
```
改为：
```tsx
{PROFILE.tags.map((tag) => (
  <span key={tag.label} className="px-2 py-1 border border-black dark:border-white font-mono text-xs font-bold tracking-wider text-black dark:text-white">
    {tag.label.toUpperCase()}
  </span>
))}
```

- [ ] **Step 3: 更新工作经历列表为左竖线样式**

找到工作经历的 `<ul>` 列表：
```tsx
<ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 font-zenmaru ml-4">
```
改为：
```tsx
<ul className="space-y-2 text-gray-700 dark:text-gray-300 font-zenmaru border-l-2 border-black/20 dark:border-white/20 pl-4">
```

对 `<li>` 中的内容，移除 `list-disc`（因为改了 `<ul>`），无需单独修改 `<li>`。

- [ ] **Step 4: 更新技能列表为左竖线样式**

找到技能 `<ul>`：
```tsx
<ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300 font-zenmaru ml-4">
```
改为：
```tsx
<ul className="space-y-3 text-gray-700 dark:text-gray-300 font-zenmaru border-l-2 border-black/20 dark:border-white/20 pl-4">
```

- [ ] **Step 5: 验证 About 页**

访问 `http://localhost:3000/about`，确认：
- 3 个 section 卡片均有不规则边框
- tags 为方形等宽大写
- 工作经历和技能列表有左竖线，无 disc bullet

- [ ] **Step 6: Commit**

```bash
git add "app/(site)/about/page.tsx"
git commit -m "style: update about page cards to SketchBorder, lists to left-line style"
```

---

## Task 11: 全站最终验收

- [ ] **Step 1: 检查所有页面无 box-shadow**

```bash
grep -r "shadow-lg\|shadow-xl\|shadow-md" \
  components/card/ components/layout/ "app/(site)/" \
  --include="*.tsx"
```

Expected: 无输出（或仅剩 `ReadingEnhancements.tsx` 中 TOC 的 `shadow-lg`，可保留）。

- [ ] **Step 2: 检查所有页面无 rounded-2xl 在卡片上**

```bash
grep -r "rounded-2xl" \
  components/card/ "app/(site)/" \
  --include="*.tsx"
```

Expected: 无输出。

- [ ] **Step 3: 检查移动端响应式**

在浏览器 DevTools 中切换到 375px 宽度，访问：
- `http://localhost:3000` — Hero + 文章列表正常
- `http://localhost:3000/project` — 项目卡片网格正常
- `http://localhost:3000/about` — 3 个卡片正常

- [ ] **Step 4: 检查 dark mode**

点击 Navbar 右侧月亮图标切换 dark mode，访问所有页面，确认：
- SVG 边框在 dark mode 下为白色（`currentColor` 继承）
- 背景为深琥珀黑渐变
- 所有文字可读

- [ ] **Step 5: 最终 commit**

```bash
git add .
git commit -m "style: complete blog redesign - warm gradient, sketch borders, clean typography"
```
