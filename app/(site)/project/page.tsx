import ProjectCard, { Project } from "@/components/card/ProjectCard";

const projects: Project[] = [
  {
    name: "Onchain Quest Board",
    description: "一个聚合链上任务的看板，支持 Quest 数据抓取、进度追踪和钱包一键提交。",
    repo: "https://github.com/elemen/mock-onchain-quest",
    source: "ETH 黑客松",
    tags: ["Next.js", "Wagmi", "Solidity", "Tailwind"],
    article: "/blog/onchain-quest-notes",
  },
  {
    name: "AI Resume Builder",
    description: "实习期间为团队内部做的简历生成器，提供模版库、AI 结构化补全和导出 PDF。",
    repo: "https://github.com/elemen/mock-ai-resume",
    source: "实习小工具",
    tags: ["Next.js", "OpenAI", "PDFKit"],
  },
  {
    name: "ZK Proof Playground",
    description: "零知识证明的练习场，前端可视化电路编辑，自动生成 witness 与 proof 演示。",
    repo: "https://github.com/elemen/mock-zk-playground",
    source: "练手项目",
    tags: ["circom", "ZK", "React", "Tailwind"],
  },
  {
    name: "NFT Ticketing DApp",
    description: "活动门票上链的 PoC，支持 ERC-721 门票生成、转让与二维码验票。",
    repo: "https://github.com/elemen/mock-nft-ticketing",
    source: "校园黑客松",
    tags: ["Solidity", "Next.js", "RainbowKit"],
    article: "/blog/nft-ticketing-recap",
  },
  {
    name: "Portfolio Dashboard",
    description: "个人资产仪表盘，整合多链余额、NFT 与收益视图，支持暗色模式。",
    repo: "https://github.com/elemen/mock-portfolio-dash",
    source: "练手项目",
    tags: ["Next.js", "TypeScript", "Chart.js"],
  },
  {
    name: "Content Automation CLI",
    description: "用于 pSEO 的脚本工具，自动拉取关键词、生成草稿并推送到仓库审核。",
    repo: "https://github.com/elemen/mock-pseo-cli",
    source: "实习自动化",
    tags: ["Node.js", "Playwright", "GitHub Actions"],
  },
];

export default function ProjectPage() {
  return (
    <div className="pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-black font-zenmaru">Projects</h1>
          <p className="text-gray-600 font-zenmaru">
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