import ArticleCard from "./ArticleCard";
import SketchBorder from "@/components/ui/SketchBorder";
import type { Post } from "@/types";

export default function ArticleList({ posts }: { posts: Post[] }) {
  return (
    <div className="space-y-4 mt-4">
      {posts.length > 0 ? (
        posts.map((post) => (
          <SketchBorder
            key={post.slug}
            className="bg-white/85 dark:bg-gray-900/85 p-6 transition-transform hover:-translate-y-1"
          >
            <ArticleCard post={post} />
          </SketchBorder>
        ))
      ) : (
        <SketchBorder className="p-8 text-center bg-white/85 dark:bg-gray-900/85">
          <p className="text-gray-500 font-zenmaru dark:text-gray-400">No articles yet. Check back soon!</p>
        </SketchBorder>
      )}
    </div>
  );
}
