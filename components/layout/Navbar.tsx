'use client';
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SunIcon, MoonIcon, GithubIcon, MenuIcon, XIcon } from "lucide-react";
import { useTheme } from "next-themes";

const NAV_LINKS = [
  { href: "/blog",    label: "博客文章" },
  { href: "/project", label: "项目合集" },
  { href: "/about",   label: "关于我"   },
];

export default function Navbar() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted] = useState(true);
  // 控制移动端抽屉开关
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isDark = resolvedTheme === 'dark';
  const toggleTheme = () => setTheme(isDark ? 'light' : 'dark');

  return (
    <>
      <nav className="w-full flex items-center justify-between p-4 text-black dark:text-white fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-white/10 dark:bg-black/10 transition-colors duration-300">
        {/* 左侧：Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/icon/sun.png" alt="logo" className="w-8 h-8 rounded-full" width={100} height={100} />
          <div className="font-bitcount text-3xl font-semibold">Elemen&#39;s Blog</div>
        </Link>

        {/* 中间：桌面端导航链接（移动端隐藏） */}
        <div className="hidden md:flex items-center gap-10">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:opacity-70 transition-opacity text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-[#38bdf8]/50 focus:ring-offset-2 rounded-lg p-2 font-zenmaru"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* 右侧：GitHub + 主题切换 + 汉堡（移动端） */}
        <div className="flex items-center gap-2">
          {/* GitHub 桌面端显示，移动端隐藏 */}
          <Link
            href="https://github.com/404ll/Elemen-blog"
            target="_blank"
            className="hidden md:flex hover:opacity-70 transition-opacity text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-[#38bdf8]/50 focus:ring-offset-2 rounded-lg p-2"
          >
            <GithubIcon className="w-5 h-5 text-black dark:text-white transition-colors" />
          </Link>

          {/* 主题切换 */}
          <button
            onClick={toggleTheme}
            className="relative p-2 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#38bdf8]/50 focus:ring-offset-2"
            aria-label={isDark ? "切换到浅色模式" : "切换到深色模式"}
          >
            <div className="relative w-5 h-5">
              {mounted && (
                <AnimatePresence mode="wait">
                  {isDark ? (
                    <motion.div
                      key="sun"
                      initial={{ opacity: 0, rotate: -90, scale: 0 }}
                      animate={{ opacity: 1, rotate: 0, scale: 1 }}
                      exit={{ opacity: 0, rotate: 90, scale: 0 }}
                      transition={{ duration: 0.2 }}
                      className="absolute inset-0"
                    >
                      <SunIcon className="w-5 h-5 text-yellow-400" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="moon"
                      initial={{ opacity: 0, rotate: 90, scale: 0 }}
                      animate={{ opacity: 1, rotate: 0, scale: 1 }}
                      exit={{ opacity: 0, rotate: -90, scale: 0 }}
                      transition={{ duration: 0.2 }}
                      className="absolute inset-0"
                    >
                      <MoonIcon className="w-5 h-5 text-black dark:text-white transition-colors" />
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          </button>

          {/* 汉堡按钮（移动端显示） */}
          <button
            onClick={() => setDrawerOpen((v) => !v)}
            className="md:hidden p-2 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-all"
            aria-label="打开菜单"
          >
            {drawerOpen
              ? <XIcon className="w-5 h-5" />
              : <MenuIcon className="w-5 h-5" />
            }
          </button>
        </div>
      </nav>

      {/* 移动端抽屉菜单 */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* 背景遮罩，点击关闭 */}
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/30 md:hidden"
              onClick={() => setDrawerOpen(false)}
            />

            {/* 抽屉本体，从顶部 navbar 下方滑入 */}
            <motion.div
              key="drawer"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="fixed top-16 left-0 right-0 z-40 md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 shadow-lg"
            >
              <div className="flex flex-col py-2">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setDrawerOpen(false)}
                    className="px-6 py-4 text-lg font-semibold font-zenmaru text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border-b border-gray-100 dark:border-gray-800 last:border-0"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="https://github.com/404ll/Elemen-blog"
                  target="_blank"
                  onClick={() => setDrawerOpen(false)}
                  className="px-6 py-4 text-lg font-semibold font-zenmaru text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
                >
                  <GithubIcon className="w-5 h-5" />
                  GitHub
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
