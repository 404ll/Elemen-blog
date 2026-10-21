import "server-only";
import { z } from "zod";
import { cmsStore } from "./database";
import { CmsError } from "./model";
import { listSourceBoard, readDocument } from "../youmind/client";
import { parseBoardLink } from "../youmind/folders";

export async function configuredBoard() {
  return (await configuredBoards())[0];
}

export async function configuredBoards() {
  // 兼容原有的单 Board 配置；尚未保存来源时使用环境变量。
  const saved = (await cmsStore()?.getBoards()) ?? [];
  const boards = z
    .array(z.string().uuid())
    .nonempty()
    .safeParse(saved.length ? saved : [process.env.YOUMIND_BOARD_ID]);
  if (!boards.success) throw new CmsError("请先配置 YOUMIND_BOARD_ID。", 503);
  return boards.data;
}

export async function getSourceDocument(id: string) {
  return readDocument(id, await configuredBoards());
}

export async function saveSource(link: string) {
  // 提取 UUID 格式的 Board ID。
  const boardId = parseBoardLink(link);
  const store = cmsStore();
  if (!store) throw new CmsError("请先配置线上内容数据库。", 503);
  const { documents, folders } = await listSourceBoard(boardId);
  // 连接新来源时保留之前已连接的 Board。
  const initialBoard = z
    .string()
    .uuid()
    .safeParse(process.env.YOUMIND_BOARD_ID);
  await store.addBoard(
    boardId,
    initialBoard.success ? initialBoard.data : undefined,
  );
  return { boardId, documents: documents.length, folders: folders.length };
}
