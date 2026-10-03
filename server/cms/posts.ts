import "server-only";
import { cache } from "react";
import { getAllPosts, getPostBySlug, sortPostsByDate } from "@/lib/post";
import type { Post } from "@/types";
import { cmsStore } from "./database";
import type { PublishedArticle } from "./model";
import { extractYouMindCover } from "@/lib/markdown/cover";

export const publishedArticles = cache(async () => await cmsStore()?.list() ?? []);
export function toPost(article: PublishedArticle): Post {
  return { slug: article.slug, title: article.title, date: article.publishedAt, updatedAt: article.syncedAt,
    category: article.category, excerpt: article.excerpt, tags: article.tags, author: "Elemen", draft: false,
    cover: article.cover ?? extractYouMindCover(article.markdown) };
}
export async function allBlogPosts() {
  // 列表合并仓库 MDX 和数据库快照；相同网址优先保留仓库文章。
  const local = getAllPosts(), existing = new Set(local.map(post => post.slug));
  const synced = (await publishedArticles()).filter(article => !existing.has(article.slug)).map(toPost);
  return sortPostsByDate([...local, ...synced]);
}
export async function blogPost(slug: string) {
  // 返回内容来源标记，正文页据此选择 MDX 或 YouMind Markdown 渲染方式。
  const local = getPostBySlug(slug);
  if (local) return { ...local, format: "mdx" as const };
  const article = (await publishedArticles()).find(article => article.slug === slug);
  return article ? { frontmatter: toPost(article), content: article.markdown, format: "youmind" as const } : null;
}
