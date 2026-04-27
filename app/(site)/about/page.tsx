'use client';
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import { PROFILE } from '@/config/profile';

// 打字机 hook：时间驱动，固定速度逐字输出，与网络/数据来源无关
// indexRef 用 ref 而不是 state，避免每次 tick 都触发 re-render
function useTypewriter(text: string, speed = 50) {
  const [displayed, setDisplayed] = useState('');
  const indexRef = useRef(-1);

  useEffect(() => {
    // 用 ref 标记"当前轮次"，text 变化时 index 归零由 setInterval 第一次 tick 处理
    indexRef.current = -1;
    const timer = setInterval(() => {
      indexRef.current += 1;
      if (indexRef.current <= text.length) {
        setDisplayed(text.slice(0, indexRef.current));
      } else {
        clearInterval(timer);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  return displayed;
}

export default function AboutPage() {
  const bio = useTypewriter(PROFILE.bio);
  const isDone = bio.length === PROFILE.bio.length;

  return (
    <div className="pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        {/* 个人信息卡片 */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
          <div className="flex items-center gap-4 mb-6">
            <Image
              src="/logo.png"
              alt="Elemen"
              width={80}
              height={80}
              className="w-16 h-16 p-2"
            />
            <div>
              <h1 className="text-3xl font-bold text-black dark:text-white font-zenmaru mb-2">{PROFILE.name}</h1>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 font-zenmaru">
                <span>📍 {PROFILE.location}</span>
                <a href={`mailto:${PROFILE.email}`} className="hover:text-blue-600 dark:hover:text-blue-400">✉️ {PROFILE.email}</a>
              </div>
            </div>
          </div>

          <div className="flex gap-3 flex-wrap text-black dark:text-white">
            {PROFILE.tags.map((tag) => (
              <span key={tag.label} className={`px-3 py-1.5 ${tag.color} text-xs font-bold rounded-full shadow-sm`}>
                {tag.label}
              </span>
            ))}
          </div>
          {/* 打字机自我介绍 */}
          <p className="text-gray-700 dark:text-gray-300 font-zenmaru mt-4 min-h-[3rem]">
            {bio}
            <span
              className={`inline-block w-0.5 h-4 bg-gray-500 ml-0.5 align-middle transition-opacity ${
                isDone ? 'opacity-0' : 'animate-pulse'
              }`}
            />
          </p>
        </div>


        {/* 工作经历 */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-black dark:text-white font-zenmaru mb-6 flex items-center gap-2">
            <span>💼</span>
            <span>实习经历</span>
          </h2>
          <div className="space-y-6">
            {PROFILE.experiences.map((exp, i) => (
              <div key={exp.company} className={i > 0 ? 'border-t border-gray-200 dark:border-gray-700 pt-6' : ''}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-black dark:text-white font-zenmaru">{exp.company}</h3>
                    <p className="text-gray-600 dark:text-gray-400 font-zenmaru">{exp.role}</p>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400 font-zenmaru">{exp.period}</span>
                </div>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 font-zenmaru ml-4">
                  {exp.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>


        {/* 职业技能 */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-black dark:text-white font-zenmaru mb-6 flex items-center gap-2">
            <span>🛠️</span>
            <span>职业技能</span>
           </h2>
          <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300 font-zenmaru ml-4">
            {PROFILE.skills.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
