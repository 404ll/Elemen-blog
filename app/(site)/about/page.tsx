import Link from 'next/link';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        {/* 个人信息卡片 */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
          <div className="flex items-center gap-4 mb-6">
            <Image
              src="/logo.png"
              alt="Elemen"
              width={80}
              height={80}
              className="w-16 h-16 p-2"
            />
            <div>
              <h1 className="text-3xl font-bold text-black font-zenmaru mb-2">Elemen</h1>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 font-zenmaru">
                <span>📍 成都</span>
                <a href="mailto:3242388085@qq.com" className="hover:text-blue-600">✉️ 3242388085@qq.com</a>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 flex-wrap text-black">
            <span className="px-3 py-1.5 bg-blue-100 text-xs font-bold rounded-full shadow-sm">Web Dev</span>
            <span className="px-3 py-1.5 bg-purple-100 text-xs font-bold rounded-full shadow-sm">Blockchain Dev</span>
            <span className="px-3 py-1.5 bg-green-100 text-xs font-bold rounded-full shadow-sm">Full Stack</span>
          </div>
          <p className="text-gray-700 font-zenmaru mt-2">大家好，我是 Elemen，非常乐意学习新的东西，目前主要方向是区块链合约开发与前端开发。</p>
          <p className="text-gray-700 font-zenmaru">笨鸟先飞，希望可以学到更多的东西</p>
        </div>


        {/* 工作经历 */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-black font-zenmaru mb-6 flex items-center gap-2">
            <span>💼</span>
            <span>实习经历</span>
          </h2>
          <div className="space-y-6">
            {/* 工作经历 1 */}
            <div>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-black font-zenmaru">
                    厦门万狩文化科技有限公司
                  </h3>
                  <p className="text-gray-600 font-zenmaru">WEB3全栈开发实习生</p>
                </div>
                <span className="text-sm text-gray-500 font-zenmaru">2025.02 - 2025.06</span>
              </div>
              <ul className="list-disc list-inside space-y-2 text-gray-700 font-zenmaru ml-4">
                <li>依据产品文档，完善产品需求，编写区块链智能合约并对其进行测试</li>
                <li>把握产品需求，按照UI设计图实现前端页面，对接智能合约</li>
                <li>担任组织负责人，分发项目工作，管理项目开发文档，协助规划项目进度</li>
              </ul>
            </div>

            {/* 工作经历 2 */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-black font-zenmaru">
                    杭州思维星空科技有限公司
                  </h3>
                  <p className="text-gray-600 font-zenmaru">YouMind增长实习生</p>
                </div>
                <span className="text-sm text-gray-500 font-zenmaru">2025.07 - 2025.09</span>
              </div>
              <ul className="list-disc list-inside space-y-2 text-gray-700 font-zenmaru ml-4">
                <li>参与 YouMind 增长体系建设，学习并实践 SEO 与 pSEO 策略，开发部分自动化内容生成脚本，提升页面收录效率与产品自然流量</li>
                <li>为增强产品曝光，独立构思并开发基于 AI 大模型 + Twitter API 的营销网页，通过用户推文生成个性化性格分析报告</li>
                <li>负责营销页面的设计还原、Prompt 优化、大模型 SDK 对接，实现从数据获取到分析生成的完整流程</li>
              </ul>
            </div>
          </div>
        </div>


        {/* 职业技能 */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-black font-zenmaru mb-6 flex items-center gap-2">
            <span>🛠️</span>
            <span>职业技能</span>
          </h2>
          <ul className="list-disc list-inside space-y-3 text-gray-700 font-zenmaru ml-4">
            <li>HTML / CSS / JavaScript / TypeScript / Tailwind CSS</li>
            <li>Next.js / Vite / React</li>
            <li>Solidity / Move</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
