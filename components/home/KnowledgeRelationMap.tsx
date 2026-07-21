import Link from "next/link";

const articleHref = "/blog/frontend/selection-api-highlight-reader";

const mobileNodes = [
  { label: "Range", href: `${articleHref}#range一段确定的-dom-范围` },
  { label: "XPath", href: `${articleHref}#xpath-方案的边界` },
  { label: "Text Node", href: `${articleHref}#第四步取消高亮后为什么还要-normalize` },
  { label: "normalize()", href: `${articleHref}#第四步取消高亮后为什么还要-normalize`, nested: true },
];

const nodeClass = "absolute z-10 border border-[#aaa69d] bg-[#f2f1ed] px-2.5 py-1.5 font-mono text-[10px] text-[#34342f] transition-colors hover:border-[#f05a28] hover:text-[#f05a28] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f05a28] dark:border-white/25 dark:bg-[#121210] dark:text-stone-200";

export default function KnowledgeRelationMap() {
  return (
    <figure aria-labelledby="relation-map-title">
      <figcaption>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#f05a28]">Local relation</p>
        <h2 id="relation-map-title" className="mt-2 text-lg font-semibold text-[#191916] dark:text-stone-50">一篇文章里的知识关系</h2>
        <p className="mt-2 text-sm leading-6 text-[#77746d] dark:text-stone-400">节点来自最新的 Selection API 笔记，可以直接回到对应段落。</p>
      </figcaption>

      <div className="relative mt-7 hidden h-[270px] overflow-hidden border-y border-[#cac7bf] dark:border-white/15 md:block">
        <div aria-hidden="true" className="absolute inset-0 opacity-40 [background-image:linear-gradient(to_right,#d8d5ce_1px,transparent_1px),linear-gradient(to_bottom,#d8d5ce_1px,transparent_1px)] [background-size:32px_32px] dark:opacity-10" />
        <svg aria-hidden="true" className="absolute inset-0 h-full w-full" viewBox="0 0 480 270" preserveAspectRatio="none">
          <path d="M105 135 H190 M190 42 V218 M190 42 H238 M190 135 H238 M190 218 H238 M329 218 H385" fill="none" stroke="#aaa69d" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          <path d="M105 135 H190 V42 H238" fill="none" stroke="#f05a28" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
          <circle cx="190" cy="135" r="3" fill="#f05a28" />
          <circle cx="190" cy="42" r="2.5" fill="#f05a28" />
          <circle cx="190" cy="218" r="2.5" fill="#aaa69d" />
        </svg>

        <Link href={articleHref} className={`${nodeClass} left-[2%] top-[43%] border-[#f05a28] text-[#f05a28]`}>Selection API</Link>
        <Link href={`${articleHref}#range一段确定的-dom-范围`} className={`${nodeClass} left-[50%] top-[8%]`}>Range</Link>
        <Link href={`${articleHref}#xpath-方案的边界`} className={`${nodeClass} left-[50%] top-[43%]`}>XPath</Link>
        <Link href={`${articleHref}#第四步取消高亮后为什么还要-normalize`} className={`${nodeClass} left-[50%] top-[75%]`}>Text Node</Link>
        <Link href={`${articleHref}#第四步取消高亮后为什么还要-normalize`} className={`${nodeClass} right-[1%] top-[75%]`}>normalize()</Link>
      </div>

      <div className="mt-6 border-y border-[#cac7bf] py-4 dark:border-white/15 md:hidden">
        <Link href={articleHref} className="inline-flex border-l-2 border-[#f05a28] pl-3 font-mono text-xs text-[#f05a28] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f05a28]">
          Selection API
        </Link>
        <ul className="mt-3 space-y-2 border-l border-[#aaa69d] pl-5">
          {mobileNodes.map((node) => (
            <li key={node.label} className={node.nested ? "ml-5" : ""}>
              <Link href={node.href} className="font-mono text-xs text-[#4c4a45] underline-offset-4 hover:text-[#f05a28] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f05a28] dark:text-stone-300">
                {node.nested ? "↳ " : "— "}{node.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </figure>
  );
}
