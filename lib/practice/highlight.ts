import { createHighlighter, type Highlighter } from "shiki";

let highlighterPromise: Promise<Highlighter> | null = null;

async function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ["one-dark-pro"],
      langs: ["javascript", "jsx"],
    });
  }
  return highlighterPromise;
}

export async function highlightCode(
  code: string,
  lang: "javascript" | "jsx"
): Promise<string> {
  const highlighter = await getHighlighter();
  return highlighter.codeToHtml(code, {
    lang,
    theme: "one-dark-pro",
  });
}
