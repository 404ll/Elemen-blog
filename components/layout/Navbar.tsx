'use client';
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import { SunIcon, MoonIcon, GithubIcon } from "lucide-react";
import { useTheme } from "next-themes";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { setTheme, resolvedTheme } = useTheme();
  // 直接初始化为 true，避免 effect 中 setState 的 lint 警告
  const [mounted] = useState(true);

  const isDark = resolvedTheme === 'dark';
  const isZhCN = i18n.language === 'zh-CN';
  const navFontClass = isZhCN ? 'font-zenmaru' : 'font-bitcount';

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <nav className="w-full flex items-center justify-between p-4 text-black dark:text-white fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-white/10 dark:bg-black/10 transition-colors duration-300"> {/* 毛玻璃效果 */}
      {/* 左侧：Logo + 标题 */}
      <Link href="/" className="flex items-center gap-2">
        <Image src="/icon/sun.png" alt="logo" className="w-8 h-8 rounded-full" width={100} height={100} />
        <div className="font-bitcount text-3xl font-semibold">Elemen&#39;s Blog</div>
      </Link>
      
      {/* 中间：导航链接 */}
      <div className="flex items-center gap-10">
        <Link href="/blog" className={`hover:opacity-70 transition-opacity text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-[#38bdf8]/50 focus:ring-offset-2 rounded-lg p-2 ${navFontClass}`}>{t('nav.blog')}</Link>
        <Link href="/project" className={`hover:opacity-70 transition-opacity text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-[#38bdf8]/50 focus:ring-offset-2 rounded-lg p-2 ${navFontClass}`}>{t('nav.project')}</Link>
        <Link href="/about" className={`hover:opacity-70 transition-opacity text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-[#38bdf8]/50 focus:ring-offset-2 rounded-lg p-2 ${navFontClass}`}>{t('nav.about')}</Link>
      </div>
      
      {/* 右侧：语言切换 + 主题切换 */}
      <div className="flex items-center gap-2">
        <Link href="https://github.com/404ll/Elemen-blog" target="_blank" className="hover:opacity-70 transition-opacity text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-[#38bdf8]/50 focus:ring-offset-2 rounded-lg p-2">
          <GithubIcon className="w-5 h-5 text-black dark:text-white transition-colors"/>
        </Link>
        <LanguageSwitcher />
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
        </button>
      
      </div>

    </nav>
  );
}