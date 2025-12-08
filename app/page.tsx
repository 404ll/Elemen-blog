import SelfCard from "@/components/card/SelfCard";
import ArticleList from "@/components/card/ArticleList";
import { getAllPosts } from "@/lib/post";
import SunCard from "@/components/card/SunCard";
import CategoryCard from "@/components/card/CategoryCard";

export default function Home() {
  const posts = getAllPosts();

  return (
    <div className="pt-20">
      <SelfCard />
      <div className="flex gap-4">
        {/*左边*/}
        <div className="max-w-2xl mx-auto mt-10">
          <ArticleList posts={posts} />
        </div>
        {/*右边*/}
        <div className="w-1/4">
        <CategoryCard />
        </div>
      </div>
     
     
      <SunCard />
      
    </div>
  );
}
