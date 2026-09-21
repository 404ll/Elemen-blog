import { allBlogPosts } from "@/server/cms/posts";
import HomeClient from "./HomeClient";

export const dynamic = "force-dynamic";

export default async function Home() {
  const posts = await allBlogPosts();

  return <HomeClient posts={posts} />;
}
