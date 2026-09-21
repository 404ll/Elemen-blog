import "server-only";
import { getPostBySlug } from "@/lib/post";
import { CmsError, type PublishInput } from "./model";
import { cmsStore } from "./database";
import { getSourceDocument } from "./source";
import { compileYouMindContent } from "./render";

export async function publishArticle(input: PublishInput) {
  if (getPostBySlug(`${input.category}/${input.slug}`)) throw new CmsError("这个网址已经属于一篇仓库文章，请换一个。", 409);
  const store = cmsStore(); if (!store) throw new CmsError("线上内容存储尚未配置，无法发布。", 503);
  const document = await getSourceDocument(input.id);
  await compileYouMindContent(document.content);
  const article = await store.publish(document, input);
  return article;
}
