import ArticleCategory from "@/components/card/ArticleCategory";
import { CATEGORIES } from "@/constant";
import { allBlogPosts } from "@/server/cms/posts";
export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";


// 辅助函数：按分类获取文章
async function getPostsByCategory(category: string) {
  return (await allBlogPosts()).filter((post) => post.category === category);
}

export default async function BlogCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: categoryKey } = await params;
  const meta = CATEGORIES[categoryKey as keyof typeof CATEGORIES];

  if (!meta) {
    return notFound();
  }

  const posts = await getPostsByCategory(categoryKey);

  return <ArticleCategory name={meta.name} posts={posts} />;
}
