import Link from "next/link";
import SketchBorder from "@/components/ui/SketchBorder";

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
          className="absolute inset-0 z-0 rounded-none"
        />
      )}

      <SketchBorder className="relative z-10 h-full bg-white/85 dark:bg-gray-900/85 p-5 transition-transform group-hover:-translate-y-1 pointer-events-none">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <span className="font-mono text-xs font-bold tracking-wider border border-black dark:border-white px-2 py-0.5 text-black dark:text-white">
                {source.toUpperCase()}
              </span>
              <h3 className="text-lg font-bold text-black dark:text-white font-zenmaru leading-tight mt-1">
                {name}
              </h3>
            </div>
            {repo && (
              <span className="font-mono text-xs font-bold text-black dark:text-white opacity-50 flex-shrink-0">
                {repo.includes('github.com') ? 'GH' : '↗'}
              </span>
            )}
          </div>

          <p className="font-mono text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{description}</p>

          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-xs text-gray-500 dark:text-gray-400"
              >
                #{tag}
              </span>
            ))}
          </div>

          {article && (
            <Link
              href={article}
              target="_blank"
              rel="noopener noreferrer"
              className="pointer-events-auto inline-flex items-center gap-1 font-mono text-xs font-bold text-black dark:text-white border-b border-black dark:border-white hover:opacity-60 transition-opacity"
            >
              阅读文章 →
            </Link>
          )}
        </div>
      </SketchBorder>
    </div>
  );
}
