# 字体文件目录

将你的字体文件（.woff2, .woff, .ttf 等）放在这个目录下。

## 推荐的文件命名格式

```
字体名-字重-样式.扩展名

例如：
- Inter-Regular.woff2
- Inter-Bold.woff2
- Inter-Italic.woff2
- Inter-BoldItalic.woff2
```

## 如何在 layout.tsx 中使用

```typescript
import localFont from 'next/font/local';

const myFont = localFont({
  src: [
    {
      path: './fonts/Inter-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/Inter-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-inter',
  display: 'swap',
});
```

## 注意事项

1. **路径**：从 `app/layout.tsx` 引用时，使用 `../fonts/` 或 `./fonts/`
2. **格式**：优先使用 `.woff2` 格式（文件小，加载快）
3. **字体许可**：确保你有使用该字体的合法许可

