import ArticleCard from "./ArticleCard";
import type { Post } from "@/types";

export default function ArticleList({ posts }: { posts: Post[] }) {
  return (
    <div className="space-y-6">
      {posts.length > 0 ? (
        posts.map((post) => (
          <div 
            key={post.slug}
            className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            <ArticleCard post={post} />
          </div>
        ))
      ) : (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 text-center">
          <p className="text-gray-500 font-zenmaru">No articles yet. Check back soon!</p>
        </div>
      )}
    </div>
  );
}