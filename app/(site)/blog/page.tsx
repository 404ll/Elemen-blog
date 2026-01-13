import { getAllPosts } from "@/lib/post";
import BlogClient from "./BlogClient";

// ISR: 每小时重新验证一次，新文章会自动更新
export const revalidate = 3600;

export default function BlogPage() {
  const posts = getAllPosts();
  return <BlogClient posts={posts} />;
}