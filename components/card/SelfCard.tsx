import Image from "next/image";
import { PROFILE } from "@/config/profile";

interface SelfCardProps {
  postCount?: number;
  categoryCount?: number;
}

export default function SelfCard({ postCount = 0, categoryCount = 0 }: SelfCardProps) {
  return (
    <div className="w-full">
      <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-2xl p-8 transition-all shadow-lg hover:shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

          {/* 文字信息 */}
          <div className="flex flex-col text-black dark:text-white space-y-4 md:max-w-lg transition-colors">
            <div className="flex items-center gap-2">
              <Image
                src="/icon/sun.png"
                alt="logo"
                width={100}
                height={100}
                className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/50 p-2 rounded-full"
              />
              <span className="text-lg md:text-xl font-bold tracking-tight">Hello, I&apos;m {PROFILE.name}!</span>
            </div>

            <div className="flex gap-2 flex-wrap">
              {PROFILE.tags.map((tag) => (
                <span key={tag.label} className="px-3 py-1 bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 text-xs font-semibold rounded-full transition-colors">
                  {tag.label}
                </span>
              ))}
            </div>

            <ul className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-1 transition-colors">
              <li>Welcome to my blog!</li>
              <li>I am a web developer and a blockchain developer.</li>
              <li>I like to learn new things and share them with others.</li>
            </ul>
          </div>

          {/* 右侧统计 */}
          <div className="flex md:flex-col gap-6 md:gap-4 md:items-end">
            <div className="text-center md:text-right">
              <div className="text-3xl font-bold text-black dark:text-white">{postCount}</div>
              <div className="text-xs text-gray-400 dark:text-gray-500 tracking-widest uppercase mt-1">Articles</div>
            </div>
            <div className="text-center md:text-right">
              <div className="text-3xl font-bold text-black dark:text-white">{categoryCount}</div>
              <div className="text-xs text-gray-400 dark:text-gray-500 tracking-widest uppercase mt-1">Topics</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
