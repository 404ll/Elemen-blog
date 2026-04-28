import Image from "next/image";
import SunCard from "./SunCard";
import { PROFILE } from "@/config/profile";

export default function SelfCard() {
  return (
    <div className="w-full">
      <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-2xl p-8 transition-all shadow-lg hover:shadow-xl">

        {/* 桌面端：左右排列 / 移动端：垂直排列（文字在上，SunCard 在下） */}
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
              <span className="text-2xl font-bold tracking-tight">Hello, I&#39;m {PROFILE.name} !</span>
            </div>

            <div className="flex gap-3 flex-wrap">
              {PROFILE.tags.map((tag) => (
                <span key={tag.label} className={`px-3 py-1.5 ${tag.color} text-xs font-bold rounded-full shadow-sm transition-colors`}>
                  {tag.label}
                </span>
              ))}
            </div>

            <ul className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-2 transition-colors">
              <li>Welcome to my blog!</li>
              <li>I am a web developer and a blockchain developer.</li>
              <li>I like to learn new things and share them with others.</li>
            </ul>
          </div>

          {/* SunCard：桌面端右侧，移动端底部 */}
          <div className="w-full md:min-w-[200px] md:max-w-[600px]">
            <SunCard />
          </div>

        </div>
      </div>
    </div>
  );
}
