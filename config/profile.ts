export const PROFILE = {
  name: 'Elemen',
  location: '成都',
  email: '3242388085@qq.com',
  bio: '大家好，我是 Elemen，主要方向是前端开发与区块链合约开发。目前也正在学习AI和全栈相关，欢迎一起交流～笨鸟先飞，希望可以学到更多的东西。',

  // about 页和首页 SelfCard 共用的身份标签
  tags: [
    { label: 'Web Dev',               color: 'bg-blue-100   dark:bg-blue-900/50   dark:text-blue-300'   },
    { label: 'Blockchain Dev',        color: 'bg-purple-100 dark:bg-purple-900/50 dark:text-purple-300' },
    { label: 'Full Stack（learning）', color: 'bg-green-100  dark:bg-green-900/50  dark:text-green-300'  },
  ],

  experiences: [
    {
      company: '美团',
      role: '前端实习生',
      period: '2026.01 - 2026.05',
      bullets: [
        '参与费控系统前端重构工作，负责组件库迁移、页面逻辑重构，通过组件抽象与结构优化提升系统可维护性与复用性',
        '在新业务需求迭代中，与后端协调接口设计，推动 API 数据契约的规范化落地，减少联调返工',
        '针对多实体业务场景下类型与状态的组合复杂度，引入 OOP 架构对业务实体建模，降低条件分支耦合，提升可维护性和系统的可拓展性，并总结沉淀了相关的最佳实践 Skill',
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
    {
      company: '厦门万狩文化科技有限公司',
      role: 'WEB3全栈开发实习生',
      period: '2025.02 - 2025.06',
      bullets: [
        '负责 Web3 产品的全栈研发，高保真还原 UI 设计图，主导前端页面与智能合约的对接联调，打通端到端业务链路',
        '深度参与业务需求分析与完善，独立完成底层智能合约的编写与测试，保障链上业务逻辑的安全与稳健闭环',
        '担任实习开发团队负责人，统筹项目任务的拆解与分发、规范项目文档体系，并协助把控整体产品的迭代规划与进度',
      ],
    },
  ],

  skills: [
    'HTML / CSS / JavaScript / TypeScript / Tailwind CSS',
    'Next.js / Vite / React',
    'Solidity / Move',
  ],
} as const;
