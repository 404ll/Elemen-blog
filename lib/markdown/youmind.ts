export type CmsImage = { alt: string; caption?: string; width?: number; height?: number };
type Node = { type: string; value?: string; url?: string; children?: Node[] };

export function safeImageUrl(value: string): string | undefined {
  try {
    const url = new URL(value);
    // Imported images must be publicly addressable; never embed local/private URLs.
    if (url.protocol !== "https:" || url.username || url.password || url.port) return;
    if (url.hostname !== "cdn.gooo.ai") return;
    return url.href;
  } catch { return; }
}

export function normalizeYouMindMarkdown(content: string) {
  const images: Record<string, CmsImage> = Object.create(null);
  const warnings: string[] = [];
  let fence: { char: string; length: number } | null = null;
  const markdown = content.split("\n").map(line => {
    const marker = line.match(/^\s{0,3}(`{3,}|~{3,})(.*)$/);
    if (marker) {
      if (!fence) fence = { char: marker[1][0], length: marker[1].length };
      else if (marker[1][0] === fence.char && marker[1].length >= fence.length && !marker[2].trim()) fence = null;
      return line;
    }
    if (fence) return line;
    const match = line.match(/^(\s*)!\[(\{.*\})\]\(([^\s]+)\)\s*$/);
    if (!match) return line;
    try {
      const value = JSON.parse(match[2]);
      if (!value || typeof value !== "object" || Array.isArray(value)) return line;
      const url = safeImageUrl(match[3]);
      if (!url) { warnings.push("发现尚未支持的图片地址，请在预览中检查。"); return line; }
      const size = (n: unknown) => typeof n === "number" && Number.isFinite(n) && n > 0 && n <= 20000 ? n : undefined;
      images[url] = { alt: typeof value.alt === "string" ? value.alt : "", caption: typeof value.caption === "string" ? value.caption : undefined, width: size(value.width), height: size(value.height) };
      const alt = images[url].alt.replace(/[\\\[\]]/g, "\\$&").replace(/\r?\n/g, " ");
      return `${match[1]}![${alt}](${url})`;
    } catch { warnings.push("一张图片的说明格式无法解析，请检查预览。"); return line; }
  }).join("\n");
  return { markdown, images, warnings: [...new Set(warnings)] };
}

// Work on Markdown nodes, never on code contents or inline-code examples.
export function cleanYouMindNodes() {
  return (tree: Node) => {
    const citations = (children: Node[]) => {
      const result: Node[] = [];
      for (let i = 0; i < children.length; i++) {
        const node = children[i];
        if (node.type !== "text" || !node.value?.includes("[[citation:")) { result.push(node); continue; }
        let value = node.value;
        let end = i;
        while (!value.includes("}]]") && end + 1 < children.length) {
          const next = children[end + 1];
          if (next.type === "text") value += next.value ?? "";
          else if (next.type === "link" && next.children?.length === 1 && next.children[0].value === next.url) value += next.url;
          else break;
          end++;
        }
        const match = value.match(/\[\[citation:(\{"links":\[[\s\S]*?\]\})\]\]/);
        if (!match) { result.push(node); continue; }
        try {
          const data = JSON.parse(match[1]);
          if (!Array.isArray(data.links) || !data.links.length || !data.links.every((url: unknown) => typeof url === "string" && /^https?:\/\//i.test(url))) throw new Error("Unsupported citation");
          const start = match.index!;
          if (start) result.push({ type: "text", value: value.slice(0, start) });
          data.links.forEach((url: string, index: number) => {
            result.push({ type: "text", value: " " }, { type: "link", url, children: [{ type: "text", value: data.links.length > 1 ? `来源 ${index + 1}` : "来源" }] });
          });
          const tail = value.slice(start + match[0].length);
          if (tail.includes("[[citation:")) {
            children[end] = { type: "text", value: tail }; i = end - 1;
          } else {
            if (tail) result.push({ type: "text", value: tail });
            i = end;
          }
        } catch { result.push(node); }
      }
      return result;
    };
    const walk = (parent: Node) => {
      if (!parent.children || parent.type === "code" || parent.type === "inlineCode") return;
      parent.children = citations(parent.children).flatMap(node => {
        if (node.type === "paragraph" && node.children?.length === 1 && node.children[0].type === "text" && node.children[0].value?.trim() === "<EMPTY_PARAGRAPH>") return [];
        if (node.type !== "text" || !node.value) { walk(node); return [node]; }
        const parts: Node[] = []; let offset = 0;
        for (const match of node.value.matchAll(/\*\*([\p{P}\p{S}]+)\*\*/gu)) {
          if (match.index > offset) parts.push({ type: "text", value: node.value.slice(offset, match.index) });
          parts.push({ type: "strong", children: [{ type: "text", value: match[1] }] });
          offset = match.index + match[0].length;
        }
        if (!parts.length) return [node];
        if (offset < node.value.length) parts.push({ type: "text", value: node.value.slice(offset) });
        return parts;
      });
    };
    walk(tree);
  };
}
