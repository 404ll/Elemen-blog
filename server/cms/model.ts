import { createHash } from "node:crypto";
import { z } from "zod";

// YouMind getFile/listFiles 返回的文档形状。先校验外部数据，再让后台预览或同步流程使用。
// $class 区分文档和同一列表中的文件夹；隐藏或删除状态由读取来源的逻辑继续筛选。
export const documentSchema = z.object({
  $class: z.literal("DocumentV3Dto"),
  id: z.string().uuid(),
  boardId: z.string().uuid(),
  title: z.string().min(1).max(500),
  content: z.string().max(1_000_000),
  parentGroupId: z.string().uuid().nullable().optional(),
  updatedAt: z.string(),
  isHidden: z.boolean().optional(),
  trashedAt: z.string().nullable().optional(),
  deletedAt: z.string().nullable().optional(),
});

export type SourceDocument = z.infer<typeof documentSchema>;

// 浏览器点击「同步到博客」时提交的字段。标题和正文不从浏览器接收，发布时会重新读取 YouMind。
export const publishSchema = z.object({
  // sourceHash 对应预览时的标题与正文；expectedRevision 对应预览时的博客发布版本。
  // 首次发布没有旧版本，所以 expectedRevision 为 null。
  id: z.string().uuid(),
  sourceHash: z.string().regex(/^[a-f0-9]{64}$/),
  expectedRevision: z.string().uuid().nullable(),

  // 博客自己管理网址、分类、摘要和标签；这些字段不取自 YouMind 文件夹。
  slug: z.string().min(1).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  category: z.enum(["ai", "frontend", "backend", "web3", "note", "algorithm"]),
  excerpt: z.string().max(300),
  tags: z.array(z.string().trim().min(1).max(40)).max(12),
});

export type PublishInput = z.infer<typeof publishSchema>;

// 一次同步后保存在 cms_articles.data 中的博客快照。
// 来源字段用于追踪 YouMind 原文；发布字段由博客保存，公开页面直接读取这份快照。
export interface PublishedArticle {
  // sourceHash 用于判断原文是否更新；revision 用于阻止旧标签页覆盖较新的同步结果。
  sourceId: string;
  boardId: string;
  sourceHash: string;
  sourceUpdatedAt: string;
  revision: string;
  slug: string;
  title: string;
  markdown: string;
  cover?: string;
  category: string;
  excerpt: string;
  tags: string[];
  publishedAt: string;
  syncedAt: string;
}

// 只对标题和正文计算摘要：预览后这两项改变，发布时就必须重新预览。
// 它是内容一致性标记，不是登录凭证或加密后的文章内容。
export function sourceHash(document: Pick<SourceDocument, "title" | "content">) {
  return createHash("sha256")
    .update(JSON.stringify([document.title, document.content]))
    .digest("hex");
}

// 让业务层带着 HTTP 状态码抛错，由 API 路由转换为对应的错误响应。
export class CmsError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}
