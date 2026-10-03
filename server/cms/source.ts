import "server-only";
import { z } from "zod";
import { cmsStore } from "./database";
import { CmsError } from "./model";
import { listSourceBoard, readDocument } from "../youmind/client";
import { parseBoardLink } from "../youmind/folders";

export async function configuredBoard() {
  // 后台保存的 Board 配置优先；环境变量用于尚未在后台配置时的初始来源。
  const board = z.string().uuid().safeParse(await cmsStore()?.getBoard() ?? process.env.YOUMIND_BOARD_ID);
  if (!board.success) throw new CmsError("请先配置 YOUMIND_BOARD_ID。", 503);
  return board.data;
}
export async function getSourceDocument(id: string) {
  return readDocument(id, await configuredBoard());
}
export async function saveSource(link: string) {
  // 提取 UUID 格式的 Board ID。
  const boardId = parseBoardLink(link);
  const store = cmsStore();
  if (!store) throw new CmsError("请先配置线上内容数据库。", 503);
  const { documents, folders } = await listSourceBoard(boardId);
  // 保存 Board ID 到数据库。
  await store.setBoard(boardId);
  return { boardId, documents: documents.length, folders: folders.length };
}
