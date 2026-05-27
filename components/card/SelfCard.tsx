import Link from "next/link";
import { PROFILE } from "@/config/profile";

interface SelfCardProps {
  postCount?: number;
  categoryCount?: number;
}

export default function SelfCard({ postCount = 0, categoryCount = 0 }: SelfCardProps) {
  return (
    <section className="w-full border-b border-black/10 dark:border-white/10 pb-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl text-black dark:text-white">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
            <span>{PROFILE.name}&apos;s notes</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight md:text-4xl">
            前端、Web3、AI 与工程实践记录
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-gray-600 dark:text-gray-400 md:text-base">
            这里更像一间持续整理中的技术工作台：记录问题、方案、复盘，以及一些正在学习中的想法。
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
          <span className="font-mono">{postCount} articles</span>
          <span className="h-1 w-1 rounded-full bg-gray-400 dark:bg-gray-500" />
          <span className="font-mono">{categoryCount} topics</span>
          <Link
            href="/about"
            className="ml-0 inline-flex items-center rounded-full border border-black/20 px-3 py-1.5 text-sm font-semibold text-black transition-colors hover:bg-black hover:text-white dark:border-white/25 dark:text-white dark:hover:bg-white dark:hover:text-black md:ml-2"
          >
            About
          </Link>
        </div>
      </div>
    </section>
  );
}
