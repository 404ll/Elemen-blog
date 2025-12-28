import ArticleList from "@/components/card/ArticleList";
import { getAllPosts } from "@/lib/post";
import { CATEGORIES } from "@/constant";
import Link from "next/link";

export default function BlogPage() {
  const posts = getAllPosts();
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
          <h1 className="text-3xl font-bold font-bitcount tracking-[0.2em] text-gray-800 dark:text-gray-400 font-semibold transition-colors">Blog</h1>
          <p className="text-gray-600 dark:text-gray-400 font-zenmaru transition-colors">
            技术、区块链与折腾记录。
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

        <ArticleList posts={posts} />
      </div>
    </div>
  );
}