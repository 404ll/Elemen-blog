import Image from "next/image";
import SketchBorder from "@/components/ui/SketchBorder";
import { PROFILE } from "@/config/profile";

interface SelfCardProps {
  postCount?: number;
  categoryCount?: number;
}

export default function SelfCard({ postCount = 0, categoryCount = 0 }: SelfCardProps) {
  return (
    <SketchBorder className="bg-white/85 dark:bg-gray-900/85 p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">

        {/* 左侧：文字信息 */}
        <div className="flex flex-col text-black dark:text-white space-y-4 md:max-w-lg">
          <div className="flex items-center gap-3">
            <Image
              src="/icon/sun.png"
              alt="logo"
              width={40}
              height={40}
              className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/50 p-2 rounded-full"
            />
            <span className="text-xl md:text-2xl font-bold tracking-tight font-zenmaru">
              Hello, I&apos;m {PROFILE.name}!
            </span>
          </div>

          <div className="flex gap-2 flex-wrap">
            {PROFILE.tags.map((tag) => (
              <span
                key={tag.label}
                className="px-2 py-1 border border-black dark:border-white font-mono text-xs font-bold tracking-wider"
              >
                {tag.label.toUpperCase()}
              </span>
            ))}
          </div>

          <div className="border-l-2 border-black dark:border-white pl-3 text-gray-700 dark:text-gray-300 font-zenmaru text-sm leading-relaxed space-y-1">
            <p>Web developer & blockchain developer.</p>
            <p>Learning in public, building things.</p>
          </div>
        </div>

        {/* 右侧：简洁统计 */}
        <div className="flex md:flex-col gap-6 md:gap-4 md:items-end">
          <div className="text-center md:text-right">
            <div className="font-mono text-4xl font-black text-black dark:text-white">{postCount}</div>
            <div className="font-mono text-xs text-gray-400 dark:text-gray-500 tracking-widest uppercase mt-1">Articles</div>
          </div>
          <div className="text-center md:text-right">
            <div className="font-mono text-4xl font-black text-black dark:text-white">{categoryCount}</div>
            <div className="font-mono text-xs text-gray-400 dark:text-gray-500 tracking-widest uppercase mt-1">Topics</div>
          </div>
        </div>

      </div>
    </SketchBorder>
  );
}
