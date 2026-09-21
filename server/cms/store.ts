import { type Client } from "@libsql/client";
import { randomUUID } from "node:crypto";
import { CmsError, type PublishedArticle, type PublishInput, type SourceDocument, sourceHash } from "./model.ts";

export function createArticleStore(db: Client) {
  let ready: Promise<unknown> | undefined;
  const init = () => ready ??= db.batch([`CREATE TABLE IF NOT EXISTS cms_articles (
    source_id TEXT PRIMARY KEY, slug TEXT NOT NULL UNIQUE, data TEXT NOT NULL
  )`, `CREATE TABLE IF NOT EXISTS cms_settings (key TEXT PRIMARY KEY, value TEXT NOT NULL)`], "write").catch(error => { ready = undefined; throw error; });
  const list = async (): Promise<PublishedArticle[]> => {
    await init(); const result = await db.execute("SELECT data FROM cms_articles");
    return result.rows.map(row => JSON.parse(String(row.data)) as PublishedArticle);
  };
  return {
    list,
    async getBoard(): Promise<string | null> {
      await init();
      const result = await db.execute("SELECT value FROM cms_settings WHERE key = 'board'");
      return result.rows[0] ? String(result.rows[0].value) : null;
    },
    async setBoard(boardId: string) {
      await init();
      await db.execute({ sql: "INSERT INTO cms_settings (key, value) VALUES ('board', ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value", args: [boardId] });
    },
    async publish(document: SourceDocument, input: PublishInput): Promise<PublishedArticle> {
      await init();
      const hash = sourceHash(document);
      if (hash !== input.sourceHash) throw new CmsError("YouMind 原文已改变，请重新预览后同步。", 409);
      const tx = await db.transaction("write");
      try {
        const settings = await tx.execute("SELECT value FROM cms_settings WHERE key = 'board'");
        if (settings.rows[0] && settings.rows[0].value !== document.boardId) throw new CmsError("内容来源已切换，请返回文章库重新选择。", 409);
        const result = await tx.execute({ sql: "SELECT data FROM cms_articles WHERE source_id = ?", args: [document.id] });
        const previous: PublishedArticle | undefined = result.rows[0] ? JSON.parse(String(result.rows[0].data)) : undefined;
        if ((previous?.revision ?? null) !== input.expectedRevision) throw new CmsError("这篇文章刚刚被更新，请刷新后再试。", 409);
        const slug = `${input.category}/${input.slug}`;
        if (previous && previous.slug !== slug) throw new CmsError("已发布文章的网址和分类保持不变，以免旧链接失效。");
        const collision = await tx.execute({ sql: "SELECT source_id FROM cms_articles WHERE slug = ? AND source_id != ?", args: [slug, document.id] });
        if (collision.rows.length) throw new CmsError("这个文章网址已被使用，请换一个。", 409);
        const now = new Date().toISOString();
        const article: PublishedArticle = {
          sourceId: document.id, boardId: document.boardId, sourceHash: hash, sourceUpdatedAt: document.updatedAt,
          revision: randomUUID(), slug, title: document.title, markdown: document.content,
          category: input.category, excerpt: input.excerpt, tags: [...new Set(input.tags)],
          publishedAt: previous?.publishedAt ?? now, syncedAt: now,
        };
        await tx.execute({ sql: "INSERT INTO cms_articles (source_id, slug, data) VALUES (?, ?, ?) ON CONFLICT(source_id) DO UPDATE SET data = excluded.data", args: [document.id, slug, JSON.stringify(article)] });
        await tx.commit();
        return article;
      } finally { tx.close(); }
    },
  };
}
