/**
 * /practice 路由布局
 * 服务端读取 manifest 题目列表，左侧 PracticeSidebar + 右侧子路由（索引重定向或详情页）
 */
import PracticeSidebar from "@/components/practice/PracticeSidebar";
import { getAllProblems, getPracticeGroups } from "@/lib/practice/loader";

export default function PracticeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const handwritingProblems = getAllProblems({ collection: "handwriting" });
  const workProblems = getAllProblems({ collection: "work" });
  const handwritingGroups = getPracticeGroups({ collection: "handwriting" });
  const workGroups = getPracticeGroups({ collection: "work" });

  return (
    <div className="pt-20 pb-16 min-h-screen">
      <div className="max-w-6xl mx-auto px-4">
        <header className="mb-6 space-y-1">
          <h1 className="text-3xl font-bold font-bitcount tracking-[0.15em] text-gray-800 dark:text-gray-200">
            代码练习
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            手写题与工作中收集的代码片段，统一放在这里做轻量归档。
          </p>
        </header>

        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          <PracticeSidebar
            groupsByCollection={{
              handwriting: handwritingGroups,
              work: workGroups,
            }}
            problemCountByCollection={{
              handwriting: handwritingProblems.length,
              work: workProblems.length,
            }}
          />
          <div className="flex-1 min-w-0">{children}</div>
        </div>
      </div>
    </div>
  );
}
