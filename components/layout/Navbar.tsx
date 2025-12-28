'use client';
import Link from "next/link";
import LanguageSwitcher from "../i18n/LanguageSwitcher";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import { SunIcon, MoonIcon, GithubIcon } from "lucide-react";
import { useTheme } from "next-themes";

export default function Navbar() {
  const { t } = useTranslation();
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // 防止 SSR 水合不匹配
  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === 'dark';

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <nav className="w-full flex items-center justify-between p-4 text-black dark:text-white fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-white/10 dark:bg-black/10 transition-colors duration-300"> {/* 毛玻璃效果 */}
      {/* 左侧：Logo + 标题 */}
      <Link href="/" className="flex items-center gap-2">
        <Image src="/icon/sun.png" alt="logo" className="w-8 h-8 rounded-full" width={100} height={100} />
        <div className="font-bitcount text-3xl font-semibold">Elemen's Blog</div>
      </Link>
      
      {/* 中间：导航链接 */}
      <div className="flex items-center gap-6">
        <Link href="/blog" className="hover:opacity-70 transition-opacity text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-[#38bdf8]/50 focus:ring-offset-2 focus:p-2 rounded-lg">Blog</Link>
        <Link href="/project" className="hover:opacity-70 transition-opacity text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-[#38bdf8]/50 focus:ring-offset-2 focus:p-2 rounded-lg">Project</Link>
        <Link href="/about" className="hover:opacity-70 transition-opacity text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-[#38bdf8]/50 focus:ring-offset-2 focus:p-2 rounded-lg">About</Link>
      </div>
      
      {/* 右侧：语言切换 + 主题切换 */}
      <div className="flex items-center gap-2">
        <Link href="https://github.com/404ll/Elemen-blog" target="_blank" className="hover:opacity-70 transition-opacity text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-[#38bdf8]/50 focus:ring-offset-2 focus:p-2 rounded-lg">
          <GithubIcon className="w-5 h-5 text-black dark:text-white transition-colors"/>
        </Link>
        {/* <LanguageSwitcher />
        <button
          onClick={toggleTheme}
          className="relative p-2 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#38bdf8]/50 focus:ring-offset-2"
          aria-label={
            isDark ? t("theme.switchToLight") : t("theme.switchToDark")
          }
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
        </button> */}
      
      </div>

    </nav>
  );
}