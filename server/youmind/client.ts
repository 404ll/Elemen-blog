import "server-only";
import { z } from "zod";
import { CmsError, documentSchema } from "../cms/model";
import { groupSchema, folderPath } from "./folders";

async function call(name: "listFiles" | "getFile", input: Record<string, string>) {
  const key = process.env.YOUMIND_API_KEY;
  if (!key) throw new CmsError("请先配置 YouMind API Key。", 503);
  let response: Response;
  try {
    response = await fetch(`https://youmind.com/openapi/v1/${name}`, {
      method: "POST", headers: { "x-api-key": key, "Content-Type": "application/json", "x-use-camel-case": "true" },
      body: JSON.stringify(input), cache: "no-store", signal: AbortSignal.timeout(25000), redirect: "error",
    });
  } catch { throw new CmsError("暂时无法连接 YouMind，请稍后重试。", 502); }
  if (!response.ok) throw new CmsError(response.status === 401 || response.status === 403 ? "YouMind 授权失效或没有权限，请检查 API Key。" : "YouMind 读取失败，请稍后重试。", 502);
  return response.json() as Promise<unknown>;
}
export async function listSourceBoard(boardId: string) {
  const data = await call("listFiles", { boardId });
  if (!Array.isArray(data)) throw new CmsError("YouMind 返回的文章列表格式不正确。", 502);
  const allGroups = data.flatMap(item => { const parsed = groupSchema.safeParse(item); return parsed.success && parsed.data.boardId === boardId ? [parsed.data] : []; });
  const unavailable = (item: { isHidden?: boolean; trashedAt?: string | null; deletedAt?: string | null }) => !!(item.isHidden || item.trashedAt || item.deletedAt);
  const folders = allGroups.filter(folder => !folderPath(folder.id, allGroups).some(unavailable));
  const documents = data.flatMap(item => {
    const parsed = documentSchema.safeParse(item);
    return parsed.success && parsed.data.boardId === boardId && !unavailable(parsed.data) && !folderPath(parsed.data.parentGroupId, allGroups).some(unavailable) ? [parsed.data] : [];
  });
  return { documents, folders };
}
export async function readDocument(id: string, boardId: string) { z.string().uuid().parse(id);
  const parsed = documentSchema.safeParse(await call("getFile", { id }));
  if (!parsed.success || parsed.data.boardId !== boardId || parsed.data.isHidden || parsed.data.trashedAt || parsed.data.deletedAt) throw new CmsError("文章不在已连接的 Board 中，或已被移除。", 404);
  return parsed.data;
}
