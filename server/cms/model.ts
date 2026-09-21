import { createHash } from "node:crypto";
import { z } from "zod";

export const documentSchema = z.object({
  $class: z.literal("DocumentV3Dto"), id: z.string().uuid(), boardId: z.string().uuid(),
  title: z.string().min(1).max(500), content: z.string().max(1_000_000),
  parentGroupId: z.string().uuid().nullable().optional(),
  updatedAt: z.string(), isHidden: z.boolean().optional(),
  trashedAt: z.string().nullable().optional(), deletedAt: z.string().nullable().optional(),
});
export type SourceDocument = z.infer<typeof documentSchema>;
export const publishSchema = z.object({
  id: z.string().uuid(), sourceHash: z.string().regex(/^[a-f0-9]{64}$/),
  expectedRevision: z.string().uuid().nullable(),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  category: z.enum(["ai", "frontend", "backend", "web3", "note", "algorithm"]),
  excerpt: z.string().max(300), tags: z.array(z.string().trim().min(1).max(40)).max(12),
});
export type PublishInput = z.infer<typeof publishSchema>;
export interface PublishedArticle {
  sourceId: string; boardId: string; sourceHash: string; sourceUpdatedAt: string;
  revision: string; slug: string; title: string; markdown: string;
  category: string; excerpt: string; tags: string[]; publishedAt: string; syncedAt: string;
}
export function sourceHash(document: Pick<SourceDocument, "title" | "content">) {
  return createHash("sha256").update(JSON.stringify([document.title, document.content])).digest("hex");
}
export class CmsError extends Error {
  status: number;
  constructor(message: string, status = 400) { super(message); this.status = status; }
}
