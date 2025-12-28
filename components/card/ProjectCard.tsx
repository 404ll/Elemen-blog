import Link from "next/link";

export type Project = {
  name: string;
  description: string;
  repo: string;
  source: string;
  article?: string;
  tags?: string[];
};

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const { name, description, repo, source, article, tags = [] } = project;

  return (
    <div className="relative h-full group">
      {/* 整卡点击跳转仓库 */}
      <Link
        href={repo}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${name} 的仓库`}
        className="absolute inset-0 z-0 rounded-2xl"
      />

      <div className="relative z-10 h-full overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-700 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg transition-all group-hover:-translate-y-1 group-hover:shadow-xl pointer-events-none">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500/60 via-purple-500/60 to-pink-500/60" />
        <div className="p-5 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <span className="px-2.5 py-1 text-[11px] font-semibold text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/50 rounded-full">
                {source}
              </span>
              <h3 className="text-xl font-bold text-black dark:text-white font-zenmaru leading-tight">
                {name}
              </h3>
            </div>
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1">
              仓库
              <span aria-hidden>↗</span>
            </span>
          </div>

          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{description}</p>

          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-[11px] font-semibold text-gray-700 dark:text-gray-300 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {article ? (
              <Link
                href={article}
                target="_blank"
                rel="noopener noreferrer"
                className="pointer-events-auto inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/50 rounded-full hover:bg-purple-200 dark:hover:bg-purple-800/50 transition-colors"
              >
                阅读文章
                <span aria-hidden>↗</span>
              </Link>
            ) : (
              <span className="px-2.5 py-1 bg-gray-50 dark:bg-gray-800 text-[11px] font-semibold text-gray-500 dark:text-gray-400 rounded-full">
                文章待写
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

