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
  | "oop"
  | "css";

/** Shiki 代码高亮语言 */
export type PracticeCodeLanguage = "javascript" | "jsx" | "css" | "html";

/** 顶层练习集合；缺省题目默认归入 handwriting */
export type PracticeCollection = "handwriting" | "work";

/** manifest 中的展示分组 */
export type PracticeGroup = {
  id: string;
  title: string;
  description?: string;
  order?: number;
};

/** 难度档位 */
export type PracticeDifficulty = "easy" | "medium" | "hard";

/** manifest 中单道题的元信息（不含源码） */
export type PracticeProblemMeta = {
  id: string;
  title: string;
  collection?: PracticeCollection;
  category: PracticeCategory;
  /** 展示分组；缺省时回退到 category */
  groupId?: string;
  difficulty: PracticeDifficulty;
  tags?: string[];
  /** 相对 practice 根目录的源码路径，如 problems/array-fill/code.js */
  entry: string;
  /** 相对 practice 根目录的笔记路径，如 problems/debounce/article.md */
  article?: string;
  /** ISO 日期字符串，用于列表排序（新题靠前） */
  updatedAt?: string;
};

/** 工作收集记录中按二级标题解析出的可选段落 */
export type PracticeWorkNoteSection = {
  title: string;
  content: string;
};

/** 工作收集轻量记录卡，基础三块够用，其他标题进入 optional */
export type PracticeWorkNote = {
  scene?: string;
  code?: string;
  note?: string;
  optional: PracticeWorkNoteSection[];
};

/** practice/manifest.json 根结构 */
export type PracticeManifest = {
  groups: PracticeGroup[];
  problems: PracticeProblemMeta[];
};

/** 带题目列表的展示分组 */
export type PracticeGroupWithProblems = PracticeGroup & {
  items: PracticeProblemMeta[];
};

/** 页面展示用的完整题目：元信息 + 源码与可选笔记 */
export type PracticeProblem = PracticeProblemMeta & {
  code: string;
  /** article.md 内容，存在则展示为笔记记录 */
  note?: string;
  /** 工作收集条目的结构化轻量记录 */
  workNote?: PracticeWorkNote;
  /** 由 entry 扩展名推断，供 Shiki 高亮 */
  lang: PracticeCodeLanguage;
};
