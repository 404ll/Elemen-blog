'use client';
import SelfCard from "@/components/card/SelfCard";
import ArticleList from "@/components/card/ArticleList";
import CategoryCard from "@/components/card/CategoryCard";
import { useTranslation } from "react-i18next";
import type { Post } from "@/types";

export default function HomeClient({ posts }: { posts: Post[] }) {
  const { t } = useTranslation();

  return (
    <div className="pt-20 pb-8">
      {/* Hero 区域：介绍卡片 */}
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <SelfCard />
      </div>

      {/* 主要内容区域：文章列表 + 侧边栏 */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 左侧：文章列表（主要内容） */}
          <div className="lg:col-span-3">
            {/* 文章列表标题 */}
            <div className="mb-2">
              <h2 className="text-3xl font-bold text-black font-zenmaru mb-2 dark:text-white">
                {t('home.latestArticles')}
              </h2>
              <p className="text-gray-600 font-zenmaru dark:text-gray-400">
                {t('home.latestArticlesDesc')}
              </p>
            </div>
            <div className="max-h-[50vh] overflow-y-auto pr-2 hide-scrollbar fade-bottom pb-6">
              <ArticleList posts={posts} />
            </div>
          </div>
          
          {/* 右侧：侧边栏 */}
          <div className="lg:col-span-1 space-y-6">
            <CategoryCard />
          </div>
        </div>
      </div>
    </div>
  );
}

