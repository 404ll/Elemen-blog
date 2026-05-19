/**
 * Practice 模块类型定义
 * 题目元数据来自 practice/manifest.json，运行时由 loader 拼装源码与题面
 */

/** 题目分类，与 manifest 中 category 字段一一对应 */
export type PracticeCategory =
  | "array"
  | "function"
  | "async"
  | "react"
  | "oop";

/** 难度档位 */
export type PracticeDifficulty = "easy" | "medium" | "hard";

/** manifest 中单道题的元信息（不含源码） */
export type PracticeProblemMeta = {
  id: string;
  title: string;
  category: PracticeCategory;
  difficulty: PracticeDifficulty;
  tags?: string[];
  /** 相对 practice 根目录的源码路径，如 problems/array-fill/code.js */
  entry: string;
  /** ISO 日期字符串，用于列表排序（新题靠前） */
  updatedAt?: string;
};

/** practice/manifest.json 根结构 */
export type PracticeManifest = {
  problems: PracticeProblemMeta[];
};

/** 页面展示用的完整题目：元信息 + 磁盘读取的源码与可选题面 */
export type PracticeProblem = PracticeProblemMeta & {
  code: string;
  /** problems/{id}/prompt.md，存在则展示在代码块上方 */
  prompt?: string;
  /** 由 entry 扩展名推断，供 Shiki 高亮 */
  lang: "javascript" | "jsx";
};
