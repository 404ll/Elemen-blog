import Link from "next/link";

const articleHref = "/blog/frontend/selection-api-highlight-reader";
const nodeClass = "inline-flex rounded-md border border-[#e4e1db] bg-[#fffefa] px-3 py-1.5 text-[11px] text-[#68655f] transition-colors hover:border-[#bc7256] hover:text-[#c45330] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c45330] dark:border-[#45453d] dark:bg-[#252521] dark:text-stone-300";

export default function KnowledgeRelationMap() {
  return (
    <figure aria-labelledby="relation-map-title">
      <figcaption>
        <h2 id="relation-map-title" className="text-sm font-medium text-[#4d4a43] dark:text-stone-200">一篇文章里的知识关系</h2>
        <p className="mt-2 text-xs leading-6 text-[#77746d] dark:text-stone-400">Selection API 笔记中的几个概念，点击回到对应段落。</p>
      </figcaption>
      <div className="mt-5">
        <Link href={articleHref} className={`${nodeClass} border-[#dfc8bb] text-[#a45e3f] dark:border-[#7a5544] dark:text-[#d7a68e]`}>Selection API</Link>
        <ul className="ml-4 mt-2 space-y-2 border-l border-[#dedbd4] py-1 pl-5 dark:border-[#45453d]">
          <li><Link href={`${articleHref}#range一段确定的-dom-范围`} className={nodeClass}>Range</Link></li>
          <li><Link href={`${articleHref}#xpath-方案的边界`} className={nodeClass}>XPath</Link></li>
          <li>
            <Link href={`${articleHref}#第四步取消高亮后为什么还要-normalize`} className={nodeClass}>Text Node</Link>
            <ul className="ml-4 mt-2 border-l border-[#dedbd4] pl-5 dark:border-[#45453d]">
              <li><Link href={`${articleHref}#第四步取消高亮后为什么还要-normalize`} className={nodeClass}>normalize()</Link></li>
            </ul>
          </li>
        </ul>
      </div>
    </figure>
  );
}
