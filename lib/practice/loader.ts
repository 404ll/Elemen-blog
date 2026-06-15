/**
 * Practice 数据加载层
 * 从 practice 子模块目录读取 manifest 与源码，供 SSG 与布局使用
 * rootDir 可选，测试时指向 fixtures 目录
 */
import fs from "fs";
import path from "path";
import { PracticeManifestSchema } from "./schema.ts";
import {
  CATEGORY_LABELS,
  CATEGORY_ORDER,
} from "./categories.ts";
import type {
  PracticeGroup,
  PracticeGroupWithProblems,
  PracticeProblem,
  PracticeProblemMeta,
} from "./types.ts";

/** 博客仓库内 practice git submodule 默认路径 */
const DEFAULT_PRACTICE_ROOT = path.join(process.cwd(), "practice");

function resolvePracticeRoot(rootDir?: string) {
  return rootDir ?? DEFAULT_PRACTICE_ROOT;
}

/** 根据 entry 扩展名决定 Shiki 语言 id */
function langFromEntry(entry: string): "javascript" | "jsx" {
  return entry.endsWith(".jsx") ? "jsx" : "javascript";
}

function groupIdForProblem(problem: PracticeProblemMeta) {
  return problem.groupId ?? problem.category;
}

function dateValue(problem: PracticeProblemMeta) {
  return problem.updatedAt ? new Date(problem.updatedAt).getTime() : 0;
}

function sortProblemsWithinGroup(
  a: PracticeProblemMeta,
  b: PracticeProblemMeta
) {
  const dateA = dateValue(a);
  const dateB = dateValue(b);
  if (dateA !== dateB) return dateB - dateA;
  return a.title.localeCompare(b.title, "zh-CN");
}

function fallbackGroups(problems: PracticeProblemMeta[]): PracticeGroup[] {
  const categorySet = new Set(problems.map((problem) => problem.category));
  return CATEGORY_ORDER.filter((category) => categorySet.has(category)).map(
    (category, index) => ({
      id: category,
      title: CATEGORY_LABELS[category],
      order: index * 10,
    })
  );
}

/** 读取并校验 manifest.json */
export function loadManifest(rootDir?: string) {
  const root = resolvePracticeRoot(rootDir);
  const raw = fs.readFileSync(path.join(root, "manifest.json"), "utf8");
  return PracticeManifestSchema.parse(JSON.parse(raw));
}

/**
 * 返回按 manifest groups 组织的展示分组；无 groups 时回退到旧 category 分组
 */
export function getPracticeGroups(
  rootDir?: string
): PracticeGroupWithProblems[] {
  const manifest = loadManifest(rootDir);
  const groups =
    manifest.groups.length > 0
      ? [...manifest.groups].sort(
          (a, b) => (a.order ?? 0) - (b.order ?? 0)
        )
      : fallbackGroups(manifest.problems);

  const problemsByGroup = new Map<string, PracticeProblemMeta[]>();
  for (const problem of manifest.problems) {
    const groupId = groupIdForProblem(problem);
    const items = problemsByGroup.get(groupId) ?? [];
    items.push(problem);
    problemsByGroup.set(groupId, items);
  }

  return groups
    .map((group) => ({
      ...group,
      items: (problemsByGroup.get(group.id) ?? []).sort(sortProblemsWithinGroup),
    }))
    .filter((group) => group.items.length > 0);
}

/**
 * 返回全部题目元信息（已按展示分组排序）
 * 排序：group.order → 组内 updatedAt 降序 → 标题
 */
export function getAllProblems(rootDir?: string): PracticeProblemMeta[] {
  return getPracticeGroups(rootDir).flatMap((group) => group.items);
}

/**
 * 按 id 加载完整题目：manifest 元信息 + entry 源码 + 可选 article.md
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

  const articleEntry = meta.article ?? path.join("problems", id, "article.md");
  const articlePath = path.join(root, articleEntry);
  const note = fs.existsSync(articlePath)
    ? fs.readFileSync(articlePath, "utf8").trim()
    : undefined;

  return {
    ...meta,
    code,
    note,
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
