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
  DEFAULT_PRACTICE_COLLECTION,
  collectionForProblem,
} from "./categories.ts";
import type {
  PracticeCollection,
  PracticeGroup,
  PracticeGroupWithProblems,
  PracticeProblem,
  PracticeProblemMeta,
  PracticeWorkNote,
} from "./types.ts";

/** 博客仓库内 practice git submodule 默认路径 */
const DEFAULT_PRACTICE_ROOT = path.join(process.cwd(), "practice");

export type PracticeLoaderOptions = {
  rootDir?: string;
  collection?: PracticeCollection;
};

type LegacyLoaderInput = string | PracticeLoaderOptions | undefined;

function normalizeOptions(input?: LegacyLoaderInput): Required<PracticeLoaderOptions> {
  if (typeof input === "string") {
    return {
      rootDir: input,
      collection: DEFAULT_PRACTICE_COLLECTION,
    };
  }

  return {
    rootDir: input?.rootDir ?? DEFAULT_PRACTICE_ROOT,
    collection: input?.collection ?? DEFAULT_PRACTICE_COLLECTION,
  };
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

function problemMatchesCollection(
  problem: PracticeProblemMeta,
  collection: PracticeCollection
) {
  return collectionForProblem(problem.collection) === collection;
}

const WORK_NOTE_HEADINGS: Record<"场景" | "代码" | "记一下", keyof Omit<PracticeWorkNote, "optional">> = {
  "场景": "scene",
  "代码": "code",
  "记一下": "note",
};

function parseWorkNote(markdown?: string): PracticeWorkNote | undefined {
  if (!markdown) return undefined;

  const sections: Array<{ title: string; content: string[] }> = [];
  let current: { title: string; content: string[] } | null = null;

  for (const line of markdown.split(/\r?\n/)) {
    const heading = /^##\s+(.+?)\s*$/.exec(line);
    if (heading) {
      current = { title: heading[1], content: [] };
      sections.push(current);
      continue;
    }

    if (current) current.content.push(line);
  }

  const note: PracticeWorkNote = { optional: [] };
  for (const section of sections) {
    const content = section.content.join("\n").trim();
    if (!content) continue;

    const key = WORK_NOTE_HEADINGS[section.title as keyof typeof WORK_NOTE_HEADINGS];
    if (key) {
      note[key] = content;
    } else {
      note.optional.push({ title: section.title, content });
    }
  }

  return note.scene || note.code || note.note || note.optional.length > 0
    ? note
    : undefined;
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
export function loadManifest(input?: LegacyLoaderInput) {
  const { rootDir } = normalizeOptions(input);
  const raw = fs.readFileSync(path.join(rootDir, "manifest.json"), "utf8");
  return PracticeManifestSchema.parse(JSON.parse(raw));
}

/**
 * 返回按 manifest groups 组织的展示分组；无 groups 时回退到旧 category 分组
 */
export function getPracticeGroups(
  input?: LegacyLoaderInput
): PracticeGroupWithProblems[] {
  const options = normalizeOptions(input);
  const manifest = loadManifest(options.rootDir);
  const filteredProblems = manifest.problems.filter((problem) =>
    problemMatchesCollection(problem, options.collection)
  );
  const groups =
    manifest.groups.length > 0
      ? [...manifest.groups].sort(
          (a, b) => (a.order ?? 0) - (b.order ?? 0)
        )
      : fallbackGroups(filteredProblems);

  const problemsByGroup = new Map<string, PracticeProblemMeta[]>();
  for (const problem of filteredProblems) {
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
export function getAllProblems(input?: LegacyLoaderInput): PracticeProblemMeta[] {
  return getPracticeGroups(input).flatMap((group) => group.items);
}

/**
 * 按 id 加载完整题目：manifest 元信息 + entry 源码 + 可选 article.md
 */
export function getProblemById(
  id: string,
  input?: LegacyLoaderInput
): PracticeProblem | null {
  const options = normalizeOptions(input);
  const meta = getAllProblems(options).find((p) => p.id === id);
  if (!meta) return null;

  const codePath = path.join(options.rootDir, meta.entry);
  const code = fs.readFileSync(codePath, "utf8");

  const articleEntry = meta.article ?? path.join("problems", id, "article.md");
  const articlePath = path.join(options.rootDir, articleEntry);
  const note = fs.existsSync(articlePath)
    ? fs.readFileSync(articlePath, "utf8").trim()
    : undefined;

  return {
    ...meta,
    code,
    note,
    workNote:
      collectionForProblem(meta.collection) === "work"
        ? parseWorkNote(note)
        : undefined,
    lang: langFromEntry(meta.entry),
  };
}

/** 在 getAllProblems 排序后的列表中取上一题 / 下一题，供详情页底部导航 */
export function getAdjacentProblems(id: string, input?: LegacyLoaderInput) {
  const list = getAllProblems(input);
  const index = list.findIndex((p) => p.id === id);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: index > 0 ? list[index - 1] : null,
    next: index < list.length - 1 ? list[index + 1] : null,
  };
}
