/**
 * Practice 展示层常量：分类文案、侧栏顺序、难度与外链
 */
import type { PracticeCategory, PracticeCollection } from "./types";

/** 分类 → 侧栏与详情页展示的中文标签 */
export const CATEGORY_LABELS: Record<PracticeCategory, string> = {
  array: "数组",
  function: "函数",
  async: "异步",
  react: "React",
  oop: "OOP",
  css: "CSS",
};

/** 侧栏分组顺序（与 manifest 内题目顺序无关） */
export const CATEGORY_ORDER: PracticeCategory[] = [
  "array",
  "function",
  "oop",
  "async",
  "react",
  "css",
];

/** 难度 → 详情页徽章文案 */
export const DIFFICULTY_LABELS = {
  easy: "简单",
  medium: "中等",
  hard: "困难",
} as const;

/** 练习仓 GitHub 根 URL，用于「在 GitHub 查看源码」链接 */
export const PRACTICE_REPO_URL =
  "https://github.com/404ll/elemen-handwriting-practice";

/** 顶层集合 → 侧栏选择器与页面展示文案 */
export const PRACTICE_COLLECTIONS: Record<
  PracticeCollection,
  {
    id: PracticeCollection;
    title: string;
    description: string;
    href: string;
  }
> = {
  handwriting: {
    id: "handwriting",
    title: "手写练习",
    description: "前端基础手写题，按知识点归档。",
    href: "/practice",
  },
  work: {
    id: "work",
    title: "工作收集",
    description: "工作中遇到的代码片段、伪代码、函数写法和实现思路。",
    href: "/practice/work",
  },
};

export const DEFAULT_PRACTICE_COLLECTION: PracticeCollection = "handwriting";

export function collectionForProblem(collection?: PracticeCollection) {
  return collection ?? DEFAULT_PRACTICE_COLLECTION;
}

export function practiceProblemHref(problem: {
  id: string;
  collection?: PracticeCollection;
}) {
  return collectionForProblem(problem.collection) === "work"
    ? `/practice/work/${problem.id}`
    : `/practice/${problem.id}`;
}
