# Turbopack 字体加载问题修复指南

## 问题描述
Next.js 16.0.3 在使用 Turbopack 时，`next/font/google` 会出现模块解析错误。

## 解决方案

### 方案一：不使用 Turbopack（推荐）⭐

**确保开发服务器不使用 `--turbo` 标志：**

```bash
# ✅ 正确 - 使用 Webpack（默认）
npm run dev

# ❌ 错误 - 不要使用这个
npm run dev --turbo
# 或
next dev --turbo
```

### 方案二：升级 Next.js（长期方案）

```bash
npm install next@latest
```

### 方案三：临时禁用 Google Fonts 优化

如果必须使用 Turbopack，可以暂时改用 CSS 方式加载字体：

在 `app/layout.tsx` 中：

```tsx
// 临时方案：使用 link 标签加载字体
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=Geist+Mono:wght@100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
```

然后在 `globals.css` 中：

```css
:root {
  --font-geist-sans: 'Geist', sans-serif;
  --font-geist-mono: 'Geist Mono', monospace;
}
```

**注意**：这种方式会失去 Next.js 字体优化的好处（自动预加载、零布局偏移等）。

## 推荐做法

1. **开发环境**：使用 `npm run dev`（不使用 Turbopack）
2. **生产环境**：不受影响，正常构建和运行
3. **等待修复**：关注 Next.js 更新，未来版本会修复这个问题

