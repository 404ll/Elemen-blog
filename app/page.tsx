import { getAllPosts } from "@/lib/post";
import HomeClient from "./HomeClient";

export default function Home() {
  const posts = getAllPosts();

  return <HomeClient posts={posts} />;
}
