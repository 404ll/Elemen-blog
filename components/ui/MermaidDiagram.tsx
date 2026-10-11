"use client";

import { useCallback, useId, useState } from "react";

let renderer: Promise<typeof import("mermaid")["default"]> | undefined;
let renderCount = 0;

function loadRenderer() {
  renderer ??= import("mermaid").then(({ default: mermaid }) => {
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: "strict",
      suppressErrorRendering: true,
      theme: "neutral",
      fontFamily: "Arial, PingFang SC, sans-serif",
    });
    return mermaid;
  }).catch((error: unknown) => {
    renderer = undefined;
    throw error;
  });
  return renderer;
}

function Diagram({ chart }: { chart: string }) {
  const id = useId();
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [expanded, setExpanded] = useState(false);

  // 将第三方 DOM 渲染绑定到节点生命周期；卸载后忽略异步结果。
  const mountDiagram = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;
    let cancelled = false;
    const host = document.createElement("div");
    node.appendChild(host);
    const renderId = `mermaid-${id.replace(/[^a-zA-Z0-9-]/g, "")}-${++renderCount}`;

    void loadRenderer().then(async (mermaid) => {
      if (cancelled) return;
      const { svg } = await mermaid.render(renderId, chart, host);
      if (cancelled) return;
      // Mermaid strict 模式负责清理 SVG，并禁用图中的交互回调。
      host.innerHTML = svg;
      const diagram = host.querySelector("svg");
      if (diagram) {
        const width = diagram.viewBox.baseVal.width;
        if (width > 0) diagram.style.width = `${width}px`;
        diagram.style.removeProperty("max-width");
        diagram.style.height = "auto";
      }
      setStatus("ready");
    }).catch(() => {
      if (cancelled) return;
      host.replaceChildren();
      setStatus("error");
    });

    return () => {
      cancelled = true;
      host.remove();
    };
  }, [chart, id]);

  return (
    <figure className="not-prose my-8 min-w-0 overflow-hidden rounded-xl border border-stone-200 dark:border-stone-700" data-mermaid-status={status}>
      <div className="flex items-center justify-between gap-3 border-b border-stone-200 bg-stone-50 px-4 py-2 text-xs dark:border-stone-700 dark:bg-stone-900">
        <span className="font-mono text-stone-500 dark:text-stone-400">Mermaid</span>
        <button type="button" onClick={() => setExpanded((value) => !value)} disabled={status !== "ready"} aria-pressed={expanded} className="rounded px-2 py-1 font-medium text-stone-700 hover:bg-stone-200 focus-visible:outline-2 disabled:opacity-40 dark:text-stone-200 dark:hover:bg-stone-800">
          {expanded ? "Fit width" : "Actual size"}
        </button>
      </div>
      <div className="overflow-x-auto bg-white p-4" role="region" aria-label="Mermaid diagram" tabIndex={0} aria-busy={status === "loading"}>
        {status !== "ready" && (
          <p role="status" className="m-0 text-sm text-stone-600">
            {status === "loading" ? "Rendering diagram…" : "Unable to render diagram. View the source below."}
          </p>
        )}
        <div ref={mountDiagram} className={status !== "ready" ? "invisible h-0 overflow-hidden" : expanded ? "w-max min-w-full [&_svg]:max-w-none" : "w-full [&_svg]:max-w-full"} />
      </div>
      <details className="border-t border-stone-200 bg-stone-50 px-4 py-3 text-sm dark:border-stone-700 dark:bg-stone-900">
        <summary className="cursor-pointer font-medium text-stone-700 dark:text-stone-200">Mermaid source</summary>
        <pre className="mt-3 overflow-x-auto whitespace-pre text-xs leading-6 text-stone-700 dark:text-stone-200"><code>{chart}</code></pre>
      </details>
    </figure>
  );
}

export default function MermaidDiagram({ chart }: { chart: string }) {
  return <Diagram key={chart} chart={chart} />;
}
