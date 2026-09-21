import { z } from "zod";
import { CmsError } from "../cms/model.ts";
export const groupSchema = z.object({
  $class: z.literal("GroupV3Dto"), id: z.string().uuid(), boardId: z.string().uuid(),
  title: z.string(), parentGroupId: z.string().uuid().nullable().optional(),
  isHidden: z.boolean().optional(), trashedAt: z.string().nullable().optional(), deletedAt: z.string().nullable().optional(),
});
export type SourceFolder = z.infer<typeof groupSchema>;
export function parseBoardLink(value: string) {
  const text = value.trim();
  if (z.string().uuid().safeParse(text).success) return text;
  try {
    const url = new URL(text);
    const id = url.pathname.match(/^\/boards\/([^/]+)\/?$/)?.[1];
    if (url.protocol === "https:" && url.hostname === "youmind.com" && !url.username && !url.password && !url.port && z.string().uuid().safeParse(id).success) return id!;
  } catch { /* Return a readable validation error below. */ }
  throw new CmsError("请粘贴完整的 YouMind Board 链接，或有效的 Board ID。");
}
export function folderPath(id: string | null | undefined, folders: SourceFolder[]) {
  const byId = new Map(folders.map(folder => [folder.id, folder]));
  const seen = new Set<string>(), path: SourceFolder[] = [];
  while (id && !seen.has(id)) {
    seen.add(id); const folder = byId.get(id); if (!folder) break;
    path.unshift(folder); id = folder.parentGroupId;
  }
  return path;
}
export function inFolder(parentId: string | null | undefined, selected: string, folders: SourceFolder[]) {
  if (selected === "all") return true;
  if (selected === "root") return !parentId;
  return folderPath(parentId, folders).some(folder => folder.id === selected);
}
