export const PROFILE = {
  name: 'Elemen',
  location: '成都',
  email: '3242388085@qq.com',
  bio: '大家好，我是 Elemen，主要方向是前端开发与区块链合约开发。目前也正在学习 AI 相关，欢迎一起交流～笨鸟先飞，希望可以学到更多的东西。',

  // about 页和首页 SelfCard 共用的身份标签
  tags: [
    { label: 'Web Dev',               color: 'bg-blue-100   dark:bg-blue-900/50   dark:text-blue-300'   },
    { label: 'Blockchain Dev',        color: 'bg-purple-100 dark:bg-purple-900/50 dark:text-purple-300' },
    { label: 'Full Stack（learning）', color: 'bg-green-100  dark:bg-green-900/50  dark:text-green-300'  },
  ],

  experiences: [
    {
      company: '厦门万狩文化科技有限公司',
      role: 'WEB3全栈开发实习生',
      period: '2025.02 - 2025.06',
      bullets: [
        '依据产品文档，完善产品需求，编写区块链智能合约并对其进行测试',
        '把握产品需求，按照UI设计图实现前端页面，对接智能合约',
        '担任组织负责人，分发项目工作，管理项目开发文档，协助规划项目进度',
      ],
    },
    {
      company: 'YouMind',
      role: 'YouMind前端与增长实习生',
      period: '2025.07 - 2025.09',
      bullets: [
        '参与 YouMind 增长体系建设以及运营管理系统核心模块开发，学习并实践 SEO 与 pSEO 策略，开发部分自动化内容生成脚本，提升页面收录效率与产品自然流量',
        '为增强产品曝光，独立构思并开发基于 AI 大模型 + Twitter API 的营销网页，通过用户推文生成个性化性格分析报告',
        '负责营销页面的设计还原、Prompt 优化、大模型 SDK 对接，实现从数据获取到分析生成的完整流程',
      ],
    },
  ],

  skills: [
    'HTML / CSS / JavaScript / TypeScript / Tailwind CSS',
    'Next.js / Vite / React',
    'Solidity / Move',
  ],
} as const;
