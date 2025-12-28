import Image from "next/image";
import SunCard from "./SunCard";

export default function SelfCard() {
    return (
      <div className="w-full">
        {/* 外层容器 */}
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-2xl p-8 transition-all shadow-lg hover:shadow-xl">
  
          {/* 💡 横向排列 flex-row → 左信息 / 右 SunCard */}
          <div className="flex items-center justify-between gap-8">
  
            {/* 左侧自我介绍 */}
            <div className="flex flex-col text-black dark:text-white space-y-4 max-w-lg transition-colors">
  
              <div className="flex items-center gap-2">
                <Image
                  src="/icon/sun.png"
                  alt="logo"
                  width={100}
                  height={100}
                  className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/50 p-2 rounded-full"
                />
                <span className="text-2xl font-bold tracking-tight">Hello, I&#39;m Elemen !</span>
              </div>
  
              <div className="flex gap-3 flex-wrap">
                <span className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/50 dark:text-blue-300 text-xs font-bold rounded-full shadow-sm transition-colors">Web Dev</span>
                <span className="px-3 py-1.5 bg-purple-100 dark:bg-purple-900/50 dark:text-purple-300 text-xs font-bold rounded-full shadow-sm transition-colors">Blockchain Dev</span>
              </div>
  
              <ul className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-2 transition-colors">
                <li>Welcome to my blog!</li>
                <li>I am a web developer and a blockchain developer.</li>
                <li>I like to learn new things and share them with others.</li>
              </ul>
  
            </div>
  
            {/* ⭐ 右侧 SunCard */}
            <div className="min-w-[200px] max-w-[600px]">
              <SunCard />
            </div>
  
          </div>
        </div>
      </div>
    );
  }
  