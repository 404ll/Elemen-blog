'use client';

import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { AnimatePresence, motion } from "framer-motion";
import { Languages } from "lucide-react";
export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  // 直接初始化为 true，避免 effect 中 setState 的 lint 警告
  const [mounted] = useState(true);

  // 🚀 SSR 期间不渲染按钮，避免 i18n.language 造成不一致
  if (!mounted) return null;

  return (
    <div className="flex gap-2 text-xl font-semibold">
     {/* 语言切换 */}
     <button
          onClick={() => i18n.changeLanguage(i18n.language === "zh" ? "en" : "zh")}
          className="relative p-2 rounded-lg text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#38bdf8]/50 focus:ring-offset-2"
          aria-label="切换语言"
        >
          <div className="flex items-center gap-1.5">
            <Languages className="w-5 h-5" />
            <AnimatePresence mode="wait">
              <motion.span
                key={i18n.language}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.2 }}
                className="text-xs font-medium hidden sm:inline"
              >
                {i18n.language === "zh" ? "ZH" : "EN"}
              </motion.span>
            </AnimatePresence>
          </div>
        </button>
    </div>
  );
}
