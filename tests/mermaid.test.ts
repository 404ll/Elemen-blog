import test from "node:test";
import assert from "node:assert/strict";
import { compile } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import rehypePrettyCode from "rehype-pretty-code";
import remarkMermaid from "../lib/remark-mermaid.ts";

async function render(source: string, format: "md" | "mdx" = "mdx") {
  const result = await compile(source, {
    outputFormat: "function-body",
    format,
    remarkPlugins: [remarkMermaid],
    rehypePlugins: [[rehypePrettyCode, { theme: "github-light" }]],
  });
  const Content = new Function(String(result))(runtime).default;
  return renderToStaticMarkup(createElement(Content, {
    components: {
      MermaidDiagram: ({ chart }: { chart: string }) => createElement("div", { "data-chart": chart }),
    },
  }));
}

test("Mermaid fences preserve newlines, quotes, braces and HTML-like labels", async () => {
  const source = 'flowchart LR\n A["<b>{hello}</b>"] --> B["a & b"]';
  const html = await render("```mermaid\n" + source + "\n```");
  assert.match(html, /data-chart=/);
  assert.match(html, /&lt;b&gt;\{hello\}&lt;\/b&gt;/);
  assert.match(html, /flowchart LR\n A/);
  assert.doesNotMatch(html, /data-rehype-pretty-code/);
});

test("Multiple and nested Mermaid fences coexist with ordinary highlighted code", async () => {
  const html = await render('```mermaid\nflowchart LR\n A-->B\n```\n\n> ```mermaid\n> sequenceDiagram\n> A->>B: hello\n> ```\n\n```js\nconst answer = 42;\n```');
  assert.equal((html.match(/data-chart=/g) ?? []).length, 2);
  assert.match(html, /<blockquote>/);
  assert.match(html, /data-language="js"/);
  assert.match(html, /answer/);
});

test("Invalid Mermaid is passed to the isolated renderer without breaking MDX", async () => {
  const html = await render("```mermaid\nnot a valid diagram\n```\n\nStill readable.");
  assert.match(html, /data-chart="not a valid diagram"/);
  assert.match(html, /Still readable/);
});

test("Markdown-only content renders Mermaid without evaluating source expressions or JSX", async () => {
  const html = await render('```mermaid\nflowchart LR\n A-->B\n```\n\n{1 + 1}\n\n<MermaidDiagram chart="not trusted JSX" />', "md");
  assert.equal((html.match(/data-chart=/g) ?? []).length, 1);
  assert.match(html, /\{1 \+ 1\}/);
  assert.doesNotMatch(html, /data-chart="not trusted JSX"/);
});
