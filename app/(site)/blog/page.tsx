import { allBlogPosts } from "@/server/cms/posts";
import BlogClient from "./BlogClient";

// 发布快照更新后立即读取新版本。
export const dynamic = "force-dynamic";

type BlogPageProps = {
  searchParams: Promise<{ q?: string | string[] }>;
};

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const posts = await allBlogPosts();
  const { q } = await searchParams;
  const initialSearchTerm = typeof q === "string" ? q.slice(0, 200) : "";

  return <BlogClient key={initialSearchTerm} posts={posts} initialSearchTerm={initialSearchTerm} />;
}
