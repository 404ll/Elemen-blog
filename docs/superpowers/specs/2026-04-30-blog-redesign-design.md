# Blog Redesign — 设计规格文档

**日期：** 2026-04-30  
**范围：** 全站视觉重构（首页、博客列表页、文章详情页、项目页、关于页、导航栏）  
**方向：** 简洁 + 不规则手绘边框，去掉阴影/圆形标签，背景改为暖橙渐变，保留原有字体和 logo

---

## 1. 设计原则

1. **克制装饰** — 装饰只出现在一处：卡片的 SVG 不规则边框。其他地方用线条和留白建立层次。
2. **去除浮层感** — 移除所有 `box-shadow`、`backdrop-blur`。内容贴地，不悬浮。
3. **等宽字体用于元数据** — 日期、分类标签、阅读时间统一用 `font-mono`，和正文 Zen Maru 形成对比。
4. **线条即层次** — 用底线、左竖线、手绘波浪线替代卡片阴影来建立视觉分隔。

---

## 2. Design Tokens 变更

### 背景色
| 位置 | Before | After |
|------|--------|-------|
| `body` 背景（light） | `linear-gradient(#a8d3ff → #fff4df)`（蓝天） | `linear-gradient(180deg, #fff4e6 0%, #fafaf8 100%)`（暖橙→米白） |
| `body` 背景（dark） | `#0f172a → #1e1b4b` 蓝紫渐变 | `linear-gradient(180deg, #1a0f00 0%, #0f0f0e 100%)`（深琥珀→纯黑） |
| 卡片背景 | `rgba(255,255,255,0.9)` | `rgba(255,255,255,0.85)`（轻微透明，透出暖色背景） |
| Navbar 背景 | `bg-white/10` 半透明 | `bg-[#fff4e6]/80 dark:bg-[#1a0f00]/80` + `backdrop-blur-sm`（保留模糊，配合暖色背景） |

### 边框 / 阴影
| 元素 | Before | After |
|------|--------|-------|
| 卡片 | `rounded-2xl shadow-lg hover:shadow-xl` | SVG 不规则边框，无阴影 |
| hover 效果 | `hover:shadow-xl hover:-translate-y-1` | `hover:-translate-y-1`（保留位移，去阴影） |
| 导航栏 | `backdrop-blur-sm bg-white/10` | `border-bottom: 1px solid #111`，纯色背景 |

### 标签 / Badge
| 属性 | Before | After |
|------|--------|-------|
| 形状 | `rounded-full`（pill） | 无圆角（`rounded-none`） |
| 字体 | `font-zenmaru font-semibold` | `font-mono font-bold tracking-wider` |
| 样式 | 彩色填充背景 | `border: 1.5px solid currentColor`，透明背景 |
| 颜色 | 每个分类不同颜色 | 默认黑色边框，活跃/hover 时显色 |

---

## 3. SVG 不规则边框实现方式

所有卡片用一个共用的 SVG 覆盖层，用 `preserveAspectRatio="none"` 拉伸适配任意尺寸。

```tsx
// 通用 SketchBorder 组件（inline SVG，absolute 覆盖）
<div className="relative">
  <svg
    className="pointer-events-none absolute inset-0 h-full w-full"
    viewBox="0 0 400 200"
    preserveAspectRatio="none"
    fill="none"
  >
    <path
      d="M4,4 Q100,2 200,3 Q300,1 396,4 Q398,50 397,100 Q398,150 396,196 Q300,198 200,197 Q100,199 4,196 Q2,150 3,100 Q2,50 4,4Z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
  </svg>
  {children}
</div>
```

- `currentColor` 继承文字色，dark mode 自动适配
- path 的控制点故意不均匀，产生轻微不规则感
- 卡片内容需要足够的 `padding`（建议 `p-6`）避免文字压到边框

---

## 4. 各页面改动清单

### 4.1 全局 (`globals.css` / `layout.tsx`)
- [ ] `--gradient-bg` light 改为 `linear-gradient(180deg, #fff4e6 0%, #fafaf8 100%)`
- [ ] `--gradient-bg` dark 改为 `linear-gradient(180deg, #1a0f00 0%, #0f0f0e 100%)`
- [ ] 保留 `background-attachment: fixed`（渐变依然固定）

### 4.2 Navbar (`components/layout/Navbar.tsx`)
- [ ] 背景改为 `bg-[#fff4e6]/80 dark:bg-[#1a0f00]/80 backdrop-blur-sm`，配合暖色背景
- [ ] 加 `border-b border-orange-200/60 dark:border-orange-900/40`
- [ ] 活跃链接用 `border-b-2 border-black dark:border-white` 下划线（需读取 `usePathname`）
- [ ] hover 改为 `hover:opacity-60`（移除 hover:bg 效果）

### 4.3 ArticleList / ArticleCard
- [ ] `ArticleList`：移除 `rounded-2xl shadow-lg hover:shadow-xl`，改用 SketchBorder 包裹
- [ ] `ArticleCard`：category badge 从 pill 改为方形等宽边框样式
- [ ] 日期格式：移除 emoji `📅`，改为 `font-mono text-xs text-gray-400`
- [ ] "Read More" 按钮：从蓝底白字改为 `border-b border-black font-mono text-sm` 文字链接

### 4.4 SelfCard (`components/card/SelfCard.tsx`)
- [ ] 移除 `rounded-2xl shadow-lg hover:shadow-xl backdrop-blur-sm`
- [ ] 整个卡片改用 SketchBorder 包裹
- [ ] tags：从圆形彩色改为方形等宽边框
- [ ] 自我介绍 `<ul>` 改为左竖线引用块（`border-l-2 border-black pl-3`）

### 4.5 CategoryCard (`components/card/CategoryCard.tsx`)
- [ ] 容器：移除 `rounded-2xl shadow-lg`，改为 `border border-black dark:border-white`
- [ ] 分类链接：移除圆角彩色块，改为 `border-l-2 border-black pl-3` 左竖线列表项
- [ ] 标题改为 `font-mono tracking-widest text-xs uppercase`

### 4.6 ProjectCard (`components/card/ProjectCard.tsx`)
- [ ] 移除 `border-gray-100 shadow-lg group-hover:shadow-xl`
- [ ] 改用 SketchBorder 包裹
- [ ] 顶部渐变彩条（`h-1 bg-gradient-to-r`）移除
- [ ] source badge、tags 改为等宽方形边框样式

### 4.7 文章详情页 (`app/(site)/blog/[...slug]/page.tsx`)
- [ ] 整体容器：移除 `shadow-lg rounded-2xl`，改为左右 `border-x border-black/10`
- [ ] Header 区域：底部加手绘波浪 SVG 分隔线替代视觉分隔
- [ ] category badge：同上改为方形等宽
- [ ] tags：移除灰色背景，改为 `font-mono text-gray-400` 纯文字前缀 `#`
- [ ] footer 分隔线保持 `border-t`，无需改动

### 4.8 About 页 (`app/(site)/about/page.tsx`)
- [ ] 3 个 section 卡片：移除 `rounded-2xl shadow-lg backdrop-blur-sm`，改用 SketchBorder
- [ ] tags：同上改为方形等宽
- [ ] 工作经历、技能列表：`<ul>` 改为左竖线样式

---

## 5. 新增组件

### `components/ui/SketchBorder.tsx`
全站复用的 SVG 不规则边框包裹组件。接受 `children`，内部用 absolute SVG 覆盖。

```tsx
interface SketchBorderProps {
  children: React.ReactNode;
  className?: string;
}
```

---

## 6. 保留不变的部分

- `ReadingEnhancements`（进度条、目录，功能性组件，保留样式）
- 字体：`font-bitcount`（标题/logo）、`font-zenmaru`（正文）、`font-mono`（元数据）
- 暗色模式支持（所有改动需同时覆盖 dark variant）
- 移动端响应式布局结构

---

## 7. SelfCard 替换方案

`SunCard`（WebGL）移除后，首页 Hero 右侧空间改为：
- 一个简洁的**统计卡片**：显示文章总数、分类数、总阅读字数等
- 用 SketchBorder 包裹，内容用 `font-mono` 排版
- 或直接缩减 Hero 区域为纯文字介绍（更简洁），右侧不放内容

> 具体方案在实现时根据内容量决定。

---

## 8. 验收标准

- [ ] 所有页面无 `box-shadow`（除 ReadingEnhancements TOC 悬浮卡片）
- [ ] body 背景为暖橙→米白渐变（light）/ 深琥珀→纯黑（dark）
- [ ] 所有 badge/tag 为方形等宽字体样式
- [ ] 卡片均使用 SketchBorder 组件
- [ ] dark mode 下 SVG 边框色跟随文字色（用 `currentColor`）
- [ ] 移动端布局无破坏
