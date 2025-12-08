import Link from "next/link";
import type { Post } from "@/types";
import Image from "next/image";

interface ArticleCardProps {
  post: Post;
}

export default function ArticleCard({ post }: ArticleCardProps) {
  const { slug, title, subtitle, excerpt, date } = post;
  
  // 生成文章链接
  const href = `/blog/${slug}`;

  return (
    <article className="mb-8 last:mb-0 font-zenmaru">
      {/* 标题 */}
      <h2 className="text-2xl font-bold tracking-tight mb-2 text-black font-zenmaru flex items-center gap-2">
        <Image src="/icon/light.png" alt="light" width={20} height={20} className="flex-shrink-0" />
        <span>{title || "Untitled"}</span>
      </h2>
      
      {/* 副标题 */}
      {subtitle && (
        <p className="text-lg text-gray-700 mb-3">
          {subtitle}
        </p>
      )}
      
      {/* 正文摘要 */}
      {excerpt && (
        <p className="text-base text-gray-600 leading-relaxed mb-4">
          {excerpt}
        </p>
      )}
      
      {/* Read more 链接 */}
      <Link 
        href={href}
        className="article-read-more"
      >
        Read more
      </Link>
    </article>
  );
}

