'use client';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

export default function AboutPage() {
  const { t } = useTranslation();
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
              <h1 className="text-3xl font-bold text-black dark:text-white font-zenmaru mb-2">Elemen</h1>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 font-zenmaru">
                <span>📍 {t('about.location')}</span>
                <a href="mailto:3242388085@qq.com" className="hover:text-blue-600 dark:hover:text-blue-400">✉️ 3242388085@qq.com</a>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 flex-wrap text-black dark:text-white">
            <span className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/50 dark:text-blue-300 text-xs font-bold rounded-full shadow-sm">Web Dev</span>
            <span className="px-3 py-1.5 bg-purple-100 dark:bg-purple-900/50 dark:text-purple-300 text-xs font-bold rounded-full shadow-sm">Blockchain Dev</span>
            <span className="px-3 py-1.5 bg-green-100 dark:bg-green-900/50 dark:text-green-300 text-xs font-bold rounded-full shadow-sm">Full Stack</span>
          </div>
          <p className="text-gray-700 dark:text-gray-300 font-zenmaru mt-2">{t('about.intro')}</p>
          <p className="text-gray-700 dark:text-gray-300 font-zenmaru">{t('about.motto')}</p>
        </div>


        {/* 工作经历 */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-black dark:text-white font-zenmaru mb-6 flex items-center gap-2">
            <span>💼</span>
            <span>{t('about.workExperience')}</span>
          </h2>
          <div className="space-y-6">
            {/* 工作经历 1 */}
            <div>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-black dark:text-white font-zenmaru">
                    {t('about.company1')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 font-zenmaru">{t('about.position1')}</p>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400 font-zenmaru">2025.02 - 2025.06</span>
              </div>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 font-zenmaru ml-4">
                <li>{t('about.work1_1')}</li>
                <li>{t('about.work1_2')}</li>
                <li>{t('about.work1_3')}</li>
              </ul>
            </div>

            {/* 工作经历 2 */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-black dark:text-white font-zenmaru">
                    {t('about.company2')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 font-zenmaru">{t('about.position2')}</p>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400 font-zenmaru">2025.07 - 2025.09</span>
              </div>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 font-zenmaru ml-4">
                <li>{t('about.work2_1')}</li>
                <li>{t('about.work2_2')}</li>
                <li>{t('about.work2_3')}</li>
              </ul>
            </div>
          </div>
        </div>


        {/* 职业技能 */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-black dark:text-white font-zenmaru mb-6 flex items-center gap-2">
            <span>🛠️</span>
            <span>{t('about.skills')}</span>
          </h2>
          <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300 font-zenmaru ml-4">
            <li>HTML / CSS / JavaScript / TypeScript / Tailwind CSS</li>
            <li>Next.js / Vite / React</li>
            <li>Solidity / Move</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
