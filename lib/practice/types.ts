export type PracticeCategory =
  | "array"
  | "function"
  | "async"
  | "react"
  | "oop";

export type PracticeDifficulty = "easy" | "medium" | "hard";

export type PracticeProblemMeta = {
  id: string;
  title: string;
  category: PracticeCategory;
  difficulty: PracticeDifficulty;
  tags?: string[];
  entry: string;
  updatedAt?: string;
};

export type PracticeManifest = {
  problems: PracticeProblemMeta[];
};

export type PracticeProblem = PracticeProblemMeta & {
  code: string;
  prompt?: string;
  lang: "javascript" | "jsx";
};
