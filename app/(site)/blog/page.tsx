import { getAllPosts } from "@/lib/post";
import BlogClient from "./BlogClient";

// ISR: 每小时重新验证一次，新文章会自动更新
export const revalidate = 3600;

type BlogPageProps = {
  searchParams: Promise<{ q?: string | string[] }>;
};

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const posts = getAllPosts();
  const { q } = await searchParams;
  const initialSearchTerm = typeof q === "string" ? q.slice(0, 200) : "";

  return <BlogClient key={initialSearchTerm} posts={posts} initialSearchTerm={initialSearchTerm} />;
}
