'use client';
import ArticleList from "@/components/card/ArticleList";
import { CATEGORIES } from "@/constant";
import Link from "next/link";
import { useState, useMemo } from "react";
import Fuse from "fuse.js";
import type { Post } from "@/types";

type BlogClientProps = {
  posts: Post[];
  initialSearchTerm?: string;
};

export default function BlogClient({ posts, initialSearchTerm = "" }: BlogClientProps) {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);

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

  return (
    <main id="main-content" className="pt-28 pb-16">
      <div className="max-w-[1080px] mx-auto px-5 sm:px-8 space-y-7">
        <div className="space-y-2">
          <p className="text-xs tracking-wide text-[#77746d] dark:text-stone-400">
            Knowledge Base / Notes
          </p>
          <h1 className="text-[2rem] font-semibold tracking-[-0.035em] text-[#191916] transition-colors dark:text-stone-100">
            博客
          </h1>
          <p className="text-sm leading-7 text-[#77746d] dark:text-stone-400">
            技术、区块链与折腾记录。
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {Object.entries(CATEGORIES).map(([key, meta]) => (
              <Link
                key={key}
                href={`/blog/${key}`}
                className="inline-flex items-center rounded-lg border border-[#dedbd4] px-3.5 py-2 text-xs text-[#68655f] transition-colors hover:border-[#bdb6aa] hover:bg-[#fffefa] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c45330] dark:border-[#34342f] dark:text-stone-300 dark:hover:bg-[#252521]"
              >
                <span>{meta.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* 搜索框 */}
        <div className="relative">
          <label htmlFor="article-search" className="sr-only">搜索文章</label>
          <input
            id="article-search"
            name="q"
            type="search"
            placeholder="搜索文章…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-[#dedbd4] bg-[#fffefa] py-3.5 pl-11 pr-12 text-sm text-[#282824] outline-none placeholder:text-[#87837a] focus:border-[#bc7256] focus:ring-2 focus:ring-[#bc7256]/15 dark:border-[#34342f] dark:bg-[#1b1b18] dark:text-stone-100"
          />
          <svg
            aria-hidden="true"
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#87837a]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              aria-label="清空搜索"
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded p-1 text-[#87837a] hover:text-[#c45330] focus-visible:outline-2 focus-visible:outline-[#c45330]"
            >
              ✕
            </button>
          )}
        </div>

        {/* 搜索结果计数 */}
        {searchTerm && (
          <p className="text-sm text-gray-500 dark:text-[#87837a]" aria-live="polite">
            找到 {filteredPosts.length} 篇文章
          </p>
        )}

        <ArticleList posts={filteredPosts} />
      </div>
    </main>
  );
}
