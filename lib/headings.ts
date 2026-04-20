import { slugify } from "@/lib/slugify";

export type HeadingItem = {
  id: string;
  text: string;
  level: 2 | 3;
};

export function extractHeadingsFromMdx(content: string): HeadingItem[] {
  const lines = content.split("\n");
  const headings: HeadingItem[] = [];

  lines.forEach((line) => {
    const match = line.match(/^(#{2,3})\s+(.+)$/);
    if (!match) return;

    const level = match[1].length as 2 | 3;
    const rawText = match[2]
      .replace(/`([^`]+)`/g, "$1")
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/\*([^*]+)\*/g, "$1")
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
      .replace(/<[^>]+>/g, "")
      .trim();

    if (!rawText) return;

    headings.push({
      id: slugify(rawText),
      text: rawText,
      level,
    });
  });

  return headings;
}
