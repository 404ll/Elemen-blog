import "server-only";
import { z } from "zod";
import { cmsStore } from "./database";
import { CmsError } from "./model";
import { listSourceBoard, readDocument } from "../youmind/client";
import { parseBoardLink } from "../youmind/folders";

export async function configuredBoard() {
  const board = z.string().uuid().safeParse(await cmsStore()?.getBoard() ?? process.env.YOUMIND_BOARD_ID);
  if (!board.success) throw new CmsError("请先配置 YOUMIND_BOARD_ID。", 503);
  return board.data;
}
export async function getSourceDocument(id: string) {
  return readDocument(id, await configuredBoard());
}
export async function saveSource(link: string) {
  const boardId = parseBoardLink(link);
  const store = cmsStore();
  if (!store) throw new CmsError("请先配置线上内容数据库。", 503);
  const { documents, folders } = await listSourceBoard(boardId);
  await store.setBoard(boardId);
  return { boardId, documents: documents.length, folders: folders.length };
}
