import ArticleCard from "./ArticleCard";
import type { Post } from "@/types";

export default function ArticleList({ posts }: { posts: Post[] }) {
  return (
    <div className="space-y-4 mt-4">
      {posts.length > 0 ? (
        posts.map((post) => (
          <div 
            key={post.slug}
            className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 dark:bg-gray-800 dark:border dark:border-gray-700"
          >
            <ArticleCard post={post} />
          </div>
        ))
      ) : (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 text-center">
          <p className="text-gray-500 font-zenmaru dark:text-gray-400">No articles yet. Check back soon!</p>
        </div>
      )}
    </div>
  );
}