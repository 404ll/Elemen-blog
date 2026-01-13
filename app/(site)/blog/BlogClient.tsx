'use client';
import ArticleList from "@/components/card/ArticleList";
import { CATEGORIES } from "@/constant";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useState, useMemo } from "react";
import Fuse from "fuse.js";
import type { Post } from "@/types";

export default function BlogClient({ posts }: { posts: Post[] }) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");

  // 创建 Fuse 实例用于模糊搜索
  const fuse = useMemo(() => new Fuse(posts, {
    keys: ['title', 'subtitle', 'excerpt', 'category'],
    threshold: 0.3, // 模糊匹配阈值，越小越精确
    ignoreLocation: true, // 忽略位置，全文搜索
  }), [posts]);

  // 根据搜索词过滤文章
  const filteredPosts = useMemo(() => {
    if (!searchTerm.trim()) return posts;
    return fuse.search(searchTerm).map(result => result.item);
  }, [searchTerm, fuse, posts]);

  const badgeClassName = {
    blue: "bg-blue-50 text-black border border-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
    green: "bg-green-50 text-black border border-green-100 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
    purple: "bg-purple-50 text-black border border-purple-100 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800",
    gray: "bg-gray-100 text-black border border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700",
  } as const;

  return (
    <div className="pt-20 pb-16">
      <div className="max-w-5xl mx-auto px-4 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold font-bitcount tracking-[0.2em] text-gray-800 dark:text-gray-400 font-semibold transition-colors">{t('blog.title')}</h1>
          <p className="text-gray-600 dark:text-gray-400 font-zenmaru transition-colors">
            {t('blog.subtitle')}
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {Object.entries(CATEGORIES).map(([key, meta]) => (
              <Link
                key={key}
                href={`/blog/category/${key}`}
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${badgeClassName[meta.color as keyof typeof badgeClassName] ?? badgeClassName.gray}`}
              >
                <span>{meta.name}</span>
                <span className="text-gray-500 dark:text-gray-400">→</span>
              </Link>
            ))}
          </div>
        </div>

        {/* 搜索框 */}
        <div className="relative">
          <input
            type="text"
            placeholder={t('blog.searchPlaceholder') || "搜索文章..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pl-12 rounded-xl border border-gray-200 bg-white/90 backdrop-blur-sm 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-400
                       font-zenmaru transition-all"
          />
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ✕
            </button>
          )}
        </div>

        {/* 搜索结果计数 */}
        {searchTerm && (
          <p className="text-sm text-gray-500 dark:text-gray-400 font-zenmaru">
            {t('blog.searchResults', { count: filteredPosts.length }) || `找到 ${filteredPosts.length} 篇文章`}
          </p>
        )}

        <ArticleList posts={filteredPosts} />
      </div>
    </div>
  );
}








