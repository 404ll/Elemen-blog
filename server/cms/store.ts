import { type Client } from "@libsql/client";
import { randomUUID } from "node:crypto";
import { extractYouMindCover } from "../../lib/markdown/cover.ts";
import {
  CmsError,
  type PublishedArticle,
  type PublishInput,
  type SourceDocument,
  sourceHash,
} from "./model.ts";

export function createArticleStore(db: Client) {
  let ready: Promise<unknown> | undefined;
  // 用源文档 ID 定位快照，用唯一 slug 保证博客网址不冲突；data 保存完整文章 JSON。
  const init = () =>
    (ready ??= db
      .batch(
        [
          `CREATE TABLE IF NOT EXISTS cms_articles (
    source_id TEXT PRIMARY KEY, slug TEXT NOT NULL UNIQUE, data TEXT NOT NULL
  )`,
          `CREATE TABLE IF NOT EXISTS cms_settings (key TEXT PRIMARY KEY, value TEXT NOT NULL)`,
          `CREATE TABLE IF NOT EXISTS cms_boards (board_id TEXT PRIMARY KEY)`,
        ],
        "write",
      )
      .catch((error) => {
        ready = undefined;
        throw error;
      }));
  const list = async (): Promise<PublishedArticle[]> => {
    await init();
    const result = await db.execute("SELECT data FROM cms_articles");
    return result.rows.map(
      (row) => JSON.parse(String(row.data)) as PublishedArticle,
    );
  };

  return {
    list,
    async getBoard(): Promise<string | null> {
      await init();
      const result = await db.execute(
        "SELECT value FROM cms_settings WHERE key = 'board'",
      );
      return result.rows[0] ? String(result.rows[0].value) : null;
    },
    async getBoards(): Promise<string[]> {
      await init();
      const [settings, boards] = await db.batch(
        [
          "SELECT value AS board_id FROM cms_settings WHERE key = 'board'",
          "SELECT board_id FROM cms_boards ORDER BY board_id",
        ],
        "read",
      );
      return [
        ...new Set(
          [...settings.rows, ...boards.rows].map((row) => String(row.board_id)),
        ),
      ];
    },
    // 新来源设为默认，同时保留旧配置和首次使用时的环境变量来源。
    async addBoard(boardId: string, initialBoardId?: string) {
      await init();
      await db.batch(
        [
          "INSERT OR IGNORE INTO cms_boards (board_id) SELECT value FROM cms_settings WHERE key = 'board'",
          ...(initialBoardId
            ? [
                {
                  sql: "INSERT OR IGNORE INTO cms_boards (board_id) SELECT ? WHERE NOT EXISTS (SELECT 1 FROM cms_settings WHERE key = 'board')",
                  args: [initialBoardId],
                },
              ]
            : []),
          {
            sql: "INSERT OR IGNORE INTO cms_boards (board_id) VALUES (?)",
            args: [boardId],
          },
          {
            sql: "INSERT INTO cms_settings (key, value) VALUES ('board', ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value",
            args: [boardId],
          },
        ],
        "write",
      );
    },
    async publish(
      document: SourceDocument,
      input: PublishInput,
    ): Promise<PublishedArticle> {
      await init();
      // 预览时的标题和正文必须与本次读取一致，否则要求管理员重新预览。
      const hash = sourceHash(document);
      if (hash !== input.sourceHash)
        throw new CmsError("YouMind 原文已改变，请重新预览后同步。", 409);
      const tx = await db.transaction("write");
      try {
        // 同一事务中检查来源、版本和网址，防止旧标签页或并发操作覆盖新快照。
        const settings = await tx.execute(
          `SELECT value AS board_id FROM cms_settings WHERE key = 'board'
           UNION SELECT board_id FROM cms_boards`,
        );
        if (
          settings.rows.length &&
          !settings.rows.some((row) => row.board_id === document.boardId)
        )
          throw new CmsError("内容来源已切换，请返回文章库重新选择。", 409);
        const result = await tx.execute({
          sql: "SELECT data FROM cms_articles WHERE source_id = ?",
          args: [document.id],
        });
        const previous: PublishedArticle | undefined = result.rows[0]
          ? JSON.parse(String(result.rows[0].data))
          : undefined;
        if ((previous?.revision ?? null) !== input.expectedRevision)
          throw new CmsError("这篇文章刚刚被更新，请刷新后再试。", 409);
        const slug = `${input.category}/${input.slug}`;
        if (previous && previous.slug !== slug)
          throw new CmsError(
            "已发布文章的网址和分类保持不变，以免旧链接失效。",
          );
        const collision = await tx.execute({
          sql: "SELECT source_id FROM cms_articles WHERE slug = ? AND source_id != ?",
          args: [slug, document.id],
        });
        if (collision.rows.length)
          throw new CmsError("这个文章网址已被使用，请换一个。", 409);
        const now = new Date().toISOString();
        const article: PublishedArticle = {
          // 正文保留 YouMind 原始 Markdown；博客自行保存分类、网址和发布时间等发布信息。
          sourceId: document.id,
          boardId: document.boardId,
          sourceHash: hash,
          sourceUpdatedAt: document.updatedAt,
          revision: randomUUID(),
          slug,
          title: document.title,
          markdown: document.content,
          cover: extractYouMindCover(document.content),
          category: input.category,
          excerpt: input.excerpt,
          tags: [...new Set(input.tags)],
          publishedAt: previous?.publishedAt ?? now,
          syncedAt: now,
        };
        await tx.execute({
          sql: "INSERT INTO cms_articles (source_id, slug, data) VALUES (?, ?, ?) ON CONFLICT(source_id) DO UPDATE SET data = excluded.data",
          args: [document.id, slug, JSON.stringify(article)],
        });
        await tx.commit();
        return article;
      } finally {
        tx.close();
      }
    },
  };
}
