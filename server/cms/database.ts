import "server-only";
import { createClient } from "@libsql/client";
import { mkdirSync } from "node:fs";
import { createArticleStore } from "./store";
import { CmsError } from "./model";

let store: ReturnType<typeof createArticleStore> | undefined;
export function cmsStore() {
  if (store) return store;
  let url = process.env.CMS_DATABASE_URL;
  // 本地用 SQLite 文件方便开发；线上必须连接持久化的远程数据库。
  if (!url) {
    if (process.env.NODE_ENV === "production") return null;
    mkdirSync(".data", { recursive: true }); url = "file:.data/cms.db";
  }
  if (process.env.NODE_ENV === "production" && url.startsWith("file:")) throw new CmsError("线上环境需要远程内容数据库。", 503);
  store = createArticleStore(createClient({ url, authToken: process.env.CMS_DATABASE_TOKEN }));
  return store;
}
