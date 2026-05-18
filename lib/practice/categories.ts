import type { PracticeCategory } from "./types";

export const CATEGORY_LABELS: Record<PracticeCategory, string> = {
  array: "数组",
  function: "函数",
  async: "异步",
  react: "React",
  oop: "OOP",
};

export const CATEGORY_ORDER: PracticeCategory[] = [
  "array",
  "function",
  "oop",
  "async",
  "react",
];

export const DIFFICULTY_LABELS = {
  easy: "简单",
  medium: "中等",
  hard: "困难",
} as const;

/** 练习仓 GitHub 根 URL（子模块公开仓库） */
export const PRACTICE_REPO_URL =
  "https://github.com/404ll/elemen-handwriting-practice";
