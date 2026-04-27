<div align="center">
  <h1>🧩 Elemen — Pixel Web Tech Blog</h1>
  <p><strong>Frontend × Web3 · Pixel Aesthetics · MDX Powered</strong></p>
  
  <p>
    <a href="./README.zh.md">中文</a>
  </p>
</div>

---

## 🚀 About This Blog

A personal technical space where **Web2 engineering** meets **Web3 innovation**, built with a fully modern stack:

- **Next.js 16 App Router**
- **React 19**
- **TypeScript**
- **TailwindCSS v4**
- **MDX Content System**

I write about frontend engineering, blockchain tech, smart contracts, Move/Solidity, UI/UX, and my component library.

If it makes me curious → I build & write.

---

## 🧰 Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16 (App Router, Server Components, ISR) |
| **UI** | React 19, TailwindCSS v4, Framer Motion |
| **Content** | MDX, Shiki (Code Highlighting), Remark GFM |
| **Search** | Fuse.js (Fuzzy Search) |
| **DX** | TypeScript, Turbopack, Husky, ESLint |

---

## 🎨 Features

- 🔤 **MDX-based article system** — Write with components
- 🔍 **Fuzzy search** — Instant article search with Fuse.js
- 🌙 **Dark mode** — System-aware theme switching
- ⚡ **ISR (Incremental Static Regeneration)** — Fast builds, fresh content
- 🎮 **Retro pixel aesthetic** — Custom fonts & 2-bit style
- 📱 **Responsive design** — Mobile-first approach

---

## 📁 Project Structure

```
app/
├── (site)/
│   ├── blog/          # Blog list & article pages
│   ├── about/         # About page
│   └── project/       # Projects showcase
├── fonts/             # Local fonts (JetBrains Mono, Zen Maru Gothic)
└── layout.tsx         # Root layout

content/               # MDX articles
components/            # Reusable components
lib/                   # Utilities (MDX, post helpers)
scripts/               # Dev scripts (new-post CLI)
```

---

## 🚀 Getting Started

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build

# Create a new post (interactive CLI)
npm run new-post
```

---

## 📄 License

MIT


