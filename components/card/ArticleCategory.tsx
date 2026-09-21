import ArticleList from "./ArticleList";
import type { Post } from "@/types";

export default function ArticleCategory({ name, posts }: { name: string; posts: Post[] }) {
  return (
    <main id="main-content" className="pt-28 pb-16">
      <div className="mx-auto max-w-[1080px] space-y-7 px-5 sm:px-8">
        <header className="space-y-2">
          <p className="text-xs tracking-wide text-[#77746d] dark:text-stone-400">Category</p>
          <h1 className="text-[2rem] font-semibold tracking-tight text-[#282824] dark:text-stone-100">{name}</h1>
          <p className="text-sm leading-7 text-[#77746d] dark:text-stone-400">{posts.length > 0 ? `${posts.length} 篇文章` : "暂无文章"}</p>
        </header>
        <ArticleList posts={posts} />
      </div>
    </main>
  );
}
