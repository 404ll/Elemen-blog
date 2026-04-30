import Link from "next/link";

export type Project = {
  name: string;
  description: string;
  repo?: string;
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
      {repo && (
        <Link
          href={repo}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${name} 的${repo.includes('github.com') ? '仓库' : '链接'}`}
          className="absolute inset-0 z-0"
        />
      )}

      <div className="relative z-10 h-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-5 shadow-lg transition-all group-hover:shadow-xl group-hover:-translate-y-1 pointer-events-none">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                {source}
              </span>
              <h3 className="text-base font-bold text-black dark:text-white leading-tight mt-1">
                {name}
              </h3>
            </div>
            {repo && (
              <span className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0">
                {repo.includes('github.com') ? 'GH' : '↗'}
              </span>
            )}
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{description}</p>

          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
              >
                {tag}
              </span>
            ))}
          </div>

          {article && (
            <Link
              href={article}
              target="_blank"
              rel="noopener noreferrer"
              className="pointer-events-auto inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline transition-colors"
            >
              阅读文章 →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
