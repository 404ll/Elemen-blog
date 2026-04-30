'use client';
import ProjectCard, { Project } from "@/components/card/ProjectCard";

const projects: Project[] = [
  {
    name: "vibe-writer",
    description: "输入一个主题，AI 自动完成搜索、写作、审稿，生成一篇完整的技术博客。多 Agent 协作，WriterAgent 基于 ReAct loop 自主搜索，SSE 实时推流，LangGraph 管理状态与控制流。",
    repo: "https://github.com/0xelemen/vibe-writer",
    source: "AI Agent - 学习项目",
    tags: ["Python", "LangGraph", "FastAPI", "React", "SSE"],
  },
  {
    name: "DemoDock",
    description: "黑客松项目展示平台，整合 Walrus 分布式存储与 Seal 加密技术，让优秀 Demo 永久保存、安全共享。",
    repo: "https://github.com/404ll/DemoDock",
    source: "Web3 - 黑客松",
    tags: ["TypeScript", "Sui", "Walrus", "Seal", "Next.js"],
  },
  {
    name: "Sui Passport",
    description: "面向 Sui Community 的去中心化身份（DID）基础设施。利用 NFT 的可组合性实现活动凭证的链上验证与流转，构建多维度的用户声誉评价体系。",
    repo: "https://github.com/404ll/suipassport",
    source: "web3 - 实习产出",
    tags: ["TypeScript", "Sui", "Next.js"],
  },
  {
    name: "Celebrity Match-up",
    description: "AI 驱动的社交增长工具，通过分析 Twitter 推文利用Nano Banana生成个性化图片，借力Nano Banana出世热度，助力 YouMind 实现病毒式传播。",
    repo: "https://github.com/404ll/Celebrity-Match-up",
    source: "YouMind - 实习产出",
    tags: ["Next.js", "TypeScript", "React"],
  },
  {
    name: "Nextjs-Sui-Dapp-Template",
    description: "开箱即用的 Sui dApp 开发脚手架，集成最佳前端实践与完整工具链，让开发者 10 分钟启动区块链项目。",
    repo: "https://github.com/404ll/Nextjs-Sui-Dapp-Template",
    source: "开源模板",
    tags: ["Next.js", "TypeScript", "Sui", "Template"],
  },
  {
    name: "Avalon Finance",
    description: "Move 生态借贷项目，已上线运行，为 Sui/Aptos 用户提供稳定可靠的资产管理与收益方案。",
    repo: "https://app-move.avalonfinance.xyz/",
    source: "web3 - 实习产出",
    tags: ["DeFi", "Production", "Move", "Next.js"],
  },
];

export default function ProjectPage() {
  return (
    <div className="pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold font-bitcount tracking-[0.2em] text-gray-800 dark:text-gray-400 font-semibold transition-colors">项目合集</h1>
          <p className="text-gray-600 dark:text-gray-400">
            最近做过的项目与练习，点击卡片可直接前往仓库。
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.name} project={project} />
          ))}
        </div>
      </div>
    </div>
  );
}