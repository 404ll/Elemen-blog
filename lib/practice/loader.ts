import fs from "fs";
import path from "path";
import { PracticeManifestSchema } from "./schema.ts";
import type { PracticeProblem, PracticeProblemMeta } from "./types.ts";

const DEFAULT_PRACTICE_ROOT = path.join(process.cwd(), "practice");

function resolvePracticeRoot(rootDir?: string) {
  return rootDir ?? DEFAULT_PRACTICE_ROOT;
}

function langFromEntry(entry: string): "javascript" | "jsx" {
  return entry.endsWith(".jsx") ? "jsx" : "javascript";
}

export function loadManifest(rootDir?: string) {
  const root = resolvePracticeRoot(rootDir);
  const raw = fs.readFileSync(path.join(root, "manifest.json"), "utf8");
  return PracticeManifestSchema.parse(JSON.parse(raw));
}

export function getAllProblems(rootDir?: string): PracticeProblemMeta[] {
  const { problems } = loadManifest(rootDir);
  return [...problems].sort((a, b) => {
    const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
    const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
    if (dateA !== dateB) return dateB - dateA;
    return a.title.localeCompare(b.title, "zh-CN");
  });
}

export function getProblemById(
  id: string,
  rootDir?: string
): PracticeProblem | null {
  const meta = getAllProblems(rootDir).find((p) => p.id === id);
  if (!meta) return null;

  const root = resolvePracticeRoot(rootDir);
  const codePath = path.join(root, meta.entry);
  const code = fs.readFileSync(codePath, "utf8");

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

export function getAdjacentProblems(id: string, rootDir?: string) {
  const list = getAllProblems(rootDir);
  const index = list.findIndex((p) => p.id === id);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: index > 0 ? list[index - 1] : null,
    next: index < list.length - 1 ? list[index + 1] : null,
  };
}
