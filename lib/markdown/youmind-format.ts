type MarkdownNode = {
  type: string;
  value?: string;
  children?: MarkdownNode[];
  data?: { hName: string; hProperties: { className: string[] } };
};

const calloutColors = new Set([
  "blue",
  "orange",
  "green",
  "purple",
  "red",
  "yellow",
  "gray",
]);

// 只读取编辑器已知的颜色和 emoji，不把来源中的 CSS、HTML 或属性带到页面。
export function normalizeYouMindCallouts(markdown: string) {
  const lines = markdown.split("\n");
  const openings = new Map<number, { color: string; icon: string }>();
  const closings = new Set<number>();
  const stack: number[] = [];
  let fence: { char: string; length: number } | null = null;

  lines.forEach((line, index) => {
    const marker = line.match(/^\s{0,3}(`{3,}|~{3,})(.*)$/);
    if (marker) {
      if (!fence) {
        fence = { char: marker[1][0], length: marker[1].length };
      } else if (
        marker[1][0] === fence.char &&
        marker[1].length >= fence.length &&
        !marker[2].trim()
      ) {
        fence = null;
      }
      return;
    }
    if (fence) return;

    const opening = line.match(/^\s{0,3}:::callout(\{.*\})\s*$/);
    if (opening) {
      try {
        const metadata = JSON.parse(opening[1]);
        const color =
          typeof metadata?.backgroundColor === "string"
            ? metadata.backgroundColor.match(
                /^var\(--callout-([a-z]+)-bg\)$/,
              )?.[1]
            : undefined;
        const icon =
          metadata?.icon?.type === "emoji" &&
          typeof metadata.icon.emoji === "string"
            ? metadata.icon.emoji.replace(/[\r\n]/g, "").slice(0, 16)
            : "";
        openings.set(index, {
          color: color && calloutColors.has(color) ? color : "gray",
          icon,
        });
        stack.push(index);
      } catch {
        // 无法识别的标记保留原样，避免丢失原文。
      }
    } else if (/^\s{0,3}:::\s*$/.test(line) && stack.length) {
      stack.pop();
      closings.add(index);
    }
  });

  // 未闭合的提示框保留原样，不能把后续整篇文章都吞进框内。
  stack.forEach((index) => openings.delete(index));
  let depth = 0;
  return lines
    .map((line, index) => {
      const opening = openings.get(index);
      if (opening) {
        depth++;
        const prefix = "> ".repeat(depth);
        const icon = opening.icon.replace(/([\\`*_[\]<>])/g, "\\$1");
        return `\n${prefix}[!YOUMIND-CALLOUT-${opening.color}] ${icon}\n${prefix}`;
      }
      if (closings.has(index)) {
        depth--;
        return `${"> ".repeat(depth)}\n`;
      }
      return `${"> ".repeat(depth)}${line}`;
    })
    .join("\n");
}

export function cleanYouMindFormatting(parent: MarkdownNode) {
  if (!parent.children) return;

  if (parent.type === "blockquote") {
    const first = parent.children[0];
    const label = first?.children?.[0];
    const marker =
      label?.type === "text"
        ? label.value?.match(/^\[!YOUMIND-CALLOUT-([a-z]+)\]\s*(.*)$/)
        : null;
    if (marker && calloutColors.has(marker[1])) {
      parent.data = {
        hName: "aside",
        hProperties: { className: ["cms-callout", `cms-callout-${marker[1]}`] },
      };
      const body: MarkdownNode = {
        type: "calloutBody",
        data: {
          hName: "div",
          hProperties: { className: ["cms-callout-body"] },
        },
        children: parent.children.slice(1),
      };
      parent.children = marker[2]
        ? [
            {
              type: "calloutIcon",
              data: {
                hName: "span",
                hProperties: { className: ["cms-callout-icon"] },
              },
              children: [{ type: "text", value: marker[2] }],
            },
            body,
          ]
        : [body];
    }
  }

  // 仅兼容没有属性的 strong 标签；其他原始 HTML 仍由 Markdown 渲染器忽略。
  const children: MarkdownNode[] = [];
  for (let index = 0; index < parent.children.length; index++) {
    const node = parent.children[index];
    if (node.type === "html" && node.value === "<strong>") {
      let depth = 1;
      let end = index + 1;
      for (; end < parent.children.length; end++) {
        const candidate = parent.children[end];
        if (candidate.type !== "html") continue;
        if (candidate.value === "<strong>") depth++;
        if (candidate.value === "</strong>") depth--;
        if (!depth) break;
      }
      if (!depth) {
        children.push({
          type: "strong",
          children: parent.children.slice(index + 1, end),
        });
        index = end;
        continue;
      }
    }
    children.push(node);
  }
  parent.children = children;
}
