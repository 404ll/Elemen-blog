'use client';
import SelfCard from "@/components/card/SelfCard";
import ArticleList from "@/components/card/ArticleList";
import CategoryCard from "@/components/card/CategoryCard";
import Link from "next/link";
import { CATEGORIES, getColorStyle } from "@/constant";
import type { Post } from "@/types";

export default function HomeClient({ posts }: { posts: Post[] }) {
  return (
    <div className="pt-20 pb-8">
      {/* Hero 区域 */}
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <SelfCard />
      </div>

      {/* 移动端：横向滚动分类 chips（md 以上隐藏，由侧边栏接管） */}
      <div className="md:hidden max-w-7xl mx-auto px-4 mb-4">
        <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
          {Object.entries(CATEGORIES).map(([key, category]) => (
            <Link
              key={key}
              href={`/blog/category/${key}`}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-bold transition-all shadow-sm ${getColorStyle(category.color, 'badge')}`}
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>

      {/* 主要内容区域：文章列表 + 侧边栏 */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 左侧：文章列表 */}
          <div className="lg:col-span-3">
            <div className="mb-2">
              <h2 className="text-3xl font-bold text-black font-zenmaru mb-2 dark:text-white">
                最新文章
              </h2>
              <p className="text-gray-600 font-zenmaru dark:text-gray-400">
                探索 Web 开发和区块链的见解、教程和思考
              </p>
            </div>
            <div className="max-h-[50vh] overflow-y-auto pr-2 hide-scrollbar fade-bottom pb-6 overscroll-contain">
              <ArticleList posts={posts} />
            </div>
          </div>

          {/* 右侧：侧边栏（移动端隐藏） */}
          <div className="hidden lg:block lg:col-span-1 space-y-6">
            <CategoryCard />
          </div>
        </div>
      </div>
    </div>
  );
}
