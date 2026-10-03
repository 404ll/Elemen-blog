import ArticleCard from "./ArticleCard";
import type { Post } from "@/types";

export default function ArticleList({ posts }: { posts: Post[] }) {
  if (!posts.length) {
    return (
      <div className="rounded-2xl border border-[#e4e1db] bg-[#fffefa] px-6 py-16 text-center dark:border-[#34342f] dark:bg-[#1b1b18]">
        <p className="text-sm text-[#77746d] dark:text-stone-400">暂无文章，可以试试其他关键词或分类。</p>
      </div>
    );
  }

  return (
    <ol className="flex flex-col gap-2.5">
      {posts.map((post) => (
        <li key={post.slug} className="min-w-0">
          <ArticleCard post={post} />
        </li>
      ))}
    </ol>
  );
}
