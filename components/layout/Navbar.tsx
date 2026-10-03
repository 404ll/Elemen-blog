"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Github, Menu, Moon, Search, Sun, X } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";

const NAV_LINKS = [
  { label: "知识库", href: "/blog" },
  { label: "代码练习", href: "/practice" },
  { label: "关于", href: "/about" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  if (pathname === "/admin" || pathname.startsWith("/admin/")) return null;

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[#dedbd4]/70 bg-[#f2f1ed]/92 text-[#191916] backdrop-blur-md dark:border-white/10 dark:bg-[#121210]/92 dark:text-stone-50">
      <nav aria-label="主导航" className="mx-auto flex h-16 max-w-[1376px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <Link href="/" className="group inline-flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f05a28]" onClick={() => setMenuOpen(false)}>
          <Image src="/brand/flame-mark.png" alt="" width={28} height={28} className="h-7 w-7 object-contain transition-transform group-hover:scale-110 motion-reduce:transition-none" />
          <span className="font-bitcount text-base font-semibold tracking-[0.04em] sm:text-lg">Elemen</span>
        </Link>

        <div className="hidden items-center gap-1 rounded-full bg-[#e9e7e1]/70 p-1 md:flex dark:bg-white/5">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={`rounded-full px-4 py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f05a28] ${
                isActive(link.href)
                  ? "bg-[#fffefa] font-medium text-[#191916] shadow-sm dark:bg-[#34342f] dark:text-stone-50"
                  : "text-[#68655f] hover:bg-[#fffefa]/65 hover:text-[#191916] dark:text-stone-400 dark:hover:bg-white/10 dark:hover:text-stone-50"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <Link
            href="/blog"
            aria-label="搜索知识库"
            className="rounded-full p-2.5 text-[#5f5c56] transition-colors hover:bg-[#e9e7e1] hover:text-[#a45e3f] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#f05a28] dark:text-stone-300 dark:hover:bg-white/10"
          >
            <Search aria-hidden="true" className="h-[18px] w-[18px]" strokeWidth={1.7} />
          </Link>
          <Link
            href="https://github.com/404ll/Elemen-blog"
            target="_blank"
            rel="noreferrer"
            aria-label="在 GitHub 查看项目（新窗口）"
            className="hidden rounded-full p-2.5 text-[#5f5c56] transition-colors hover:bg-[#e9e7e1] hover:text-[#a45e3f] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#f05a28] dark:text-stone-300 dark:hover:bg-white/10 sm:block"
          >
            <Github aria-hidden="true" className="h-[18px] w-[18px]" strokeWidth={1.7} />
          </Link>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="切换显示模式"
            className="rounded-full p-2.5 text-[#5f5c56] transition-colors hover:bg-[#e9e7e1] hover:text-[#a45e3f] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#f05a28] dark:text-stone-300 dark:hover:bg-white/10"
          >
            <Moon aria-hidden="true" className="h-[18px] w-[18px] dark:hidden!" strokeWidth={1.7} />
            <Sun aria-hidden="true" className="hidden! h-[18px] w-[18px] dark:block!" strokeWidth={1.7} />
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "关闭导航菜单" : "打开导航菜单"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            className="rounded-full p-2.5 text-[#5f5c56] transition-colors hover:bg-[#e9e7e1] hover:text-[#a45e3f] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#f05a28] dark:text-stone-300 dark:hover:bg-white/10 md:hidden"
          >
            {menuOpen ? <X aria-hidden="true" className="h-5 w-5" /> : <Menu aria-hidden="true" className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div id="mobile-navigation" className="border-t border-[#cac7bf] bg-[#f2f1ed] px-5 py-3 dark:border-white/15 dark:bg-[#121210] md:hidden">
          <div className="mx-auto flex max-w-[1280px] flex-col">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`border-b border-[#d8d5ce] py-4 text-base focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#f05a28] dark:border-white/10 ${
                  isActive(link.href) ? "font-medium text-[#f05a28]" : "text-[#34342f] dark:text-stone-200"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="https://github.com/404ll/Elemen-blog"
              target="_blank"
              rel="noreferrer"
              onClick={() => setMenuOpen(false)}
              className="inline-flex items-center gap-2 py-4 text-sm text-[#68655f] focus-visible:outline-2 focus-visible:outline-[#f05a28] dark:text-stone-400"
            >
              <Github aria-hidden="true" className="h-4 w-4" />
              GitHub
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
