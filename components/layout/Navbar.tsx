'use client';
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { SunIcon, MoonIcon, GithubIcon, MenuIcon, XIcon, ChevronDown } from "lucide-react";
import { useTheme } from "next-themes";

const NAV_LINKS = [
  { 
    label: "博客文章", 
    href: "/blog",
    children: [
      { label: "前端开发", href: "/blog/frontend" },
      { label: "后端技术", href: "/blog/backend" },
      { label: "算法结构", href: "/blog/algorithm" },
      { label: "AI与探索", href: "/blog/ai" },
      { label: "Web3/其他", href: "/blog/web3" }
    ]
  },
  { 
    label: "项目合集", 
    href: "/project" 
  },
  { 
    label: "代码练习", 
    href: "/practice" 
  },
  { 
    label: "资源分享", 
    href: "/resource",
    children: [
      { label: "工具推荐", href: "/resource/tools" },
      { label: "教程文档", href: "/resource/tutorials" },
    ]
  },
  { label: "关于我", href: "/about" },
];

export default function Navbar() {
  const { setTheme, resolvedTheme } = useTheme();
  const pathname = usePathname();
  const [mounted] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const [expandedMobileMenu, setExpandedMobileMenu] = useState<string | null>(null);

  const isDark = resolvedTheme === 'dark';
  const toggleTheme = () => setTheme(isDark ? 'light' : 'dark');

  const handleMobileMenuToggle = (href: string) => {
    setExpandedMobileMenu(prev => prev === href ? null : href);
  };

  return (
    <>
      <nav className="w-full flex items-center justify-between p-4 text-black dark:text-white fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-[#fff4e6]/80 dark:bg-[#1a0f00]/80 border-b border-orange-200/60 dark:border-orange-900/40 transition-colors duration-300">
        {/* 左侧：Logo */}
        <Link href="/" className="flex items-center">
          <div className="font-bitcount text-xl md:text-3xl font-semibold">Elemen&#39;s Blog</div>
        </Link>

        {/* 中间：桌面端导航链接（移动端隐藏） */}
        <div className="hidden md:flex items-center gap-6 lg:gap-10">
          {NAV_LINKS.map((link) => (
            <div 
              key={link.href}
              className="relative"
              onMouseEnter={() => setHoveredMenu(link.href)}
              onMouseLeave={() => setHoveredMenu(null)}
            >
              <Link
                href={link.href}
                className={`flex items-center gap-1 text-xl font-semibold font-zenmaru transition-opacity focus:outline-none rounded-lg p-2 hover:opacity-60 ${
                  pathname === link.href || pathname.startsWith(link.href + '/')
                    ? 'border-b-2 border-black dark:border-white opacity-100'
                    : 'opacity-70'
                }`}
              >
                {link.label}
                {link.children && <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${hoveredMenu === link.href ? 'rotate-180' : ''}`} />}
              </Link>
              
              {/* Desktop Dropdown */}
              {link.children && (
                <AnimatePresence>
                  {hoveredMenu === link.href && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 pt-2 min-w-32"
                    >
                      <div className="flex flex-col bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden py-2">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={`px-4 py-2 font-zenmaru text-base whitespace-nowrap transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${
                              pathname === child.href ? 'text-orange-500 font-bold' : 'text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
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
              className="fixed top-[73px] left-0 right-0 z-40 md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-xl max-h-[80vh] overflow-y-auto"
            >
              <div className="flex flex-col py-2">
                {NAV_LINKS.map((link) => (
                  <div key={link.href} className="border-b border-gray-100 dark:border-gray-800 last:border-0">
                    <div className="flex items-center justify-between px-6 py-4">
                      <Link
                        href={link.href}
                        onClick={() => setDrawerOpen(false)}
                        className={`text-lg font-semibold font-zenmaru transition-colors ${
                          pathname === link.href || pathname.startsWith(link.href + '/')
                            ? 'text-orange-500'
                            : 'text-black dark:text-white'
                        }`}
                      >
                        {link.label}
                      </Link>
                      
                      {link.children && (
                        <button 
                          onClick={() => handleMobileMenuToggle(link.href)}
                          className="p-2 -mr-2"
                        >
                          <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${expandedMobileMenu === link.href ? 'rotate-180' : ''}`} />
                        </button>
                      )}
                    </div>
                    
                    {/* Mobile Accordion */}
                    {link.children && (
                      <AnimatePresence>
                        {expandedMobileMenu === link.href && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="bg-gray-50 dark:bg-gray-900/50 overflow-hidden"
                          >
                            <div className="px-6 py-2 flex flex-col gap-2">
                              {link.children.map((child) => (
                                <Link
                                  key={child.href}
                                  href={child.href}
                                  onClick={() => setDrawerOpen(false)}
                                  className={`py-2 pl-4 text-base font-zenmaru border-l-2 transition-colors ${
                                    pathname === child.href
                                      ? 'border-orange-500 text-orange-500 font-bold'
                                      : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
                                  }`}
                                >
                                  {child.label}
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}
                  </div>
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
