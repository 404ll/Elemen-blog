/**
 * Practice 展示层常量：分类文案、侧栏顺序、难度与外链
 */
import type { PracticeCategory } from "./types";

/** 分类 → 侧栏与详情页展示的中文标签 */
export const CATEGORY_LABELS: Record<PracticeCategory, string> = {
  array: "数组",
  function: "函数",
  async: "异步",
  react: "React",
  oop: "OOP",
};

/** 侧栏分组顺序（与 manifest 内题目顺序无关） */
export const CATEGORY_ORDER: PracticeCategory[] = [
  "array",
  "function",
  "oop",
  "async",
  "react",
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
