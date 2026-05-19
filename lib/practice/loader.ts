/**
 * Practice 数据加载层
 * 从 practice 子模块目录读取 manifest 与源码，供 SSG 与布局使用
 * rootDir 可选，测试时指向 fixtures 目录
 */
import fs from "fs";
import path from "path";
import { PracticeManifestSchema } from "./schema.ts";
import type { PracticeProblem, PracticeProblemMeta } from "./types.ts";

/** 博客仓库内 practice git submodule 默认路径 */
const DEFAULT_PRACTICE_ROOT = path.join(process.cwd(), "practice");

function resolvePracticeRoot(rootDir?: string) {
  return rootDir ?? DEFAULT_PRACTICE_ROOT;
}

/** 根据 entry 扩展名决定 Shiki 语言 id */
function langFromEntry(entry: string): "javascript" | "jsx" {
  return entry.endsWith(".jsx") ? "jsx" : "javascript";
}

/** 读取并校验 manifest.json */
export function loadManifest(rootDir?: string) {
  const root = resolvePracticeRoot(rootDir);
  const raw = fs.readFileSync(path.join(root, "manifest.json"), "utf8");
  return PracticeManifestSchema.parse(JSON.parse(raw));
}

/**
 * 返回全部题目元信息（已排序）
 * 排序：updatedAt 降序 → 同日期按中文标题 localeCompare
 */
export function getAllProblems(rootDir?: string): PracticeProblemMeta[] {
  const { problems } = loadManifest(rootDir);
  return [...problems].sort((a, b) => {
    const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
    const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
    if (dateA !== dateB) return dateB - dateA;
    return a.title.localeCompare(b.title, "zh-CN");
  });
}

/**
 * 按 id 加载完整题目：manifest 元信息 + entry 源码 + 可选 prompt.md
 */
export function getProblemById(
  id: string,
  rootDir?: string
): PracticeProblem | null {
  const meta = getAllProblems(rootDir).find((p) => p.id === id);
  if (!meta) return null;

  const root = resolvePracticeRoot(rootDir);
  const codePath = path.join(root, meta.entry);
  const code = fs.readFileSync(codePath, "utf8");

  // 题面与源码分文件存放，无 prompt.md 时不展示题面区块
  const promptPath = path.join(root, "problems", id, "prompt.md");
  const prompt = fs.existsSync(promptPath)
    ? fs.readFileSync(promptPath, "utf8").trim()
    : undefined;

  return {
    ...meta,
    code,
    prompt,
    lang: langFromEntry(meta.entry),
  };
}

/** 在 getAllProblems 排序后的列表中取上一题 / 下一题，供详情页底部导航 */
export function getAdjacentProblems(id: string, rootDir?: string) {
  const list = getAllProblems(rootDir);
  const index = list.findIndex((p) => p.id === id);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: index > 0 ? list[index - 1] : null,
    next: index < list.length - 1 ? list[index + 1] : null,
  };
}
