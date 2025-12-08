import ArticleCard from "./ArticleCard";
import type { Post } from "@/types";

export default function ArticleList({ posts }: { posts: Post[] }) {
  return (
  
    <div className="overflow-x-hidden">
    <div className="bg-white border-2 border-black rounded-xl p-8 transition-all"> 
      <div className="space-y-6">
        {posts.map((post) => (
          <ArticleCard key={post.slug} post={post} />
        ))}
        </div>
      </div>
    </div>
  );
}