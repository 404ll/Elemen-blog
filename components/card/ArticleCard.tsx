import Link from "next/link";
import type { Post } from "@/types";
import Image from "next/image";
import { CATEGORIES } from "@/constant";

interface ArticleCardProps {
  post: Post;
}

export default function ArticleCard({ post }: ArticleCardProps) {
  const { slug, title, subtitle, excerpt, date, category } = post;
  
  // 生成文章链接
  const href = `/blog/${slug}`;
  const categoryMeta = category ? CATEGORIES[category as keyof typeof CATEGORIES] : null;
  const categoryLabel = categoryMeta?.name ?? category ?? "随笔";
  const badgeTone = categoryMeta?.color ?? "gray";
  const badgeClassName =
    {
      blue: "bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-400/40 dark:text-blue-300 dark:border-blue-800",
      green: "bg-green-50 text-green-700 border border-green-100 dark:bg-green-400/40 dark:text-green-300 dark:border-green-800",
      purple: "bg-purple-50 text-purple-700 border border-purple-100 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800",
      gray: "bg-gray-100 text-gray-700 border border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700",
      orange: "bg-orange-50 text-orange-700 border border-orange-100 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800",
    }[badgeTone] ?? "bg-gray-100 text-gray-700 border border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700";

  const displayDate = date
    ? new Date(date).toLocaleDateString("zh-CN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <article className="font-zenmaru">
      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
        {categoryLabel && (
          category ? (
            <Link
              href={`/blog/category/${category}`}
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition-colors ${badgeClassName}`}
            >
              {categoryLabel}
            </Link>
          ) : (
            <span
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${badgeClassName}`}
            >
              {categoryLabel}
            </span>
          )
        )}
        {displayDate && (
          <span className="inline-flex items-center gap-1">
            📅 {displayDate}
          </span>
        )}
      </div>

      {/* 标题 */}
      <h2 className="text-2xl font-bold tracking-tight mb-2 text-black dark:text-white font-zenmaru flex items-center gap-2 transition-colors">
        <Image src="/icon/light.png" alt="light" width={20} height={20} className="flex-shrink-0" />
        <span>{title || "Untitled"}</span>
      </h2>
      
      {/* 副标题 */}
      {subtitle && (
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-3 transition-colors">
          {subtitle}
        </p>
      )}
      
      {/* 正文摘要 */}
      {excerpt && (
        <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed mb-4 transition-colors">
          {excerpt}
        </p>
      )}
      
      {/* Read more 链接 */}
      <Link 
        href={href}
        className="article-read-more"
      >
        Read More
      </Link>
    </article>
  );
}

