import ArticleList from "@/components/card/ArticleList";
import { CATEGORIES } from "@/constant";
import { getAllPosts } from "@/lib/post";
import { notFound } from "next/navigation";

const badgeClassName = {
  blue: "bg-blue-50 text-black border border-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
  green: "bg-green-50 text-black border border-green-100 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
  purple: "bg-purple-50 text-black border border-purple-100 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800",
  gray: "bg-gray-100 text-black border border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700",
} as const;

// 辅助函数：按分类获取文章
function getPostsByCategory(category: string) {
  return getAllPosts().filter((post) => post.category === category);
}

export default async function BlogCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: categoryKey } = await params;
  const meta = CATEGORIES[categoryKey as keyof typeof CATEGORIES];

  if (!meta) {
    return notFound();
  }

  const posts = getPostsByCategory(categoryKey);

  return (
    <div className="pt-20 pb-16">
      <div className="max-w-5xl mx-auto px-4 space-y-8">
        <header className="space-y-3">
          <p className="text-3xl font-bold font-bitcount tracking-[0.2em] text-gray-800 dark:text-gray-400 font-semibold transition-colors">
            Category
          </p>
          <h1 className="text-xl font-bold text-black dark:text-white font-zenmaru transition-colors">
            {meta.name}
          </h1>
        
          <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 transition-colors">
            <span className="text-gray-500 dark:text-gray-400">
              {posts.length > 0 ? `${posts.length} 篇文章` : "暂无文章"}
            </span>
          </div>
        </header>

        {posts.length > 0 ? (
          <ArticleList posts={posts} />
        ) : (
          <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-2xl p-10 text-center border border-gray-100 dark:border-gray-800 shadow-sm transition-colors">
            <p className="text-gray-600 dark:text-gray-400 font-zenmaru transition-colors">
              这个分类还没有文章，敬请期待。
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
