import "server-only";
import { cache } from "react";
import { getAllPosts, getPostBySlug, sortPostsByDate } from "@/lib/post";
import type { Post } from "@/types";
import { cmsStore } from "./database";
import type { PublishedArticle } from "./model";

export const publishedArticles = cache(async () => await cmsStore()?.list() ?? []);
export function toPost(article: PublishedArticle): Post {
  return { slug: article.slug, title: article.title, date: article.publishedAt, updatedAt: article.syncedAt,
    category: article.category, excerpt: article.excerpt, tags: article.tags, author: "Elemen", draft: false };
}
export async function allBlogPosts() {
  const local = getAllPosts(), existing = new Set(local.map(post => post.slug));
  const synced = (await publishedArticles()).filter(article => !existing.has(article.slug)).map(toPost);
  return sortPostsByDate([...local, ...synced]);
}
export async function blogPost(slug: string) {
  const local = getPostBySlug(slug);
  if (local) return { ...local, format: "mdx" as const };
  const article = (await publishedArticles()).find(article => article.slug === slug);
  return article ? { frontmatter: toPost(article), content: article.markdown, format: "youmind" as const } : null;
}
