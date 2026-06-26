/**
 * /practice/work 索引页：重定向到第一条工作收集记录；暂无内容时展示空状态
 */
import { redirect } from "next/navigation";
import { getAllProblems } from "@/lib/practice/loader";

export default function PracticeWorkIndexPage() {
  const problems = getAllProblems({ collection: "work" });
  if (problems.length === 0) {
    return (
      <div className="rounded-sm border border-dashed border-gray-300 p-6 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-400">
        <h2 className="text-lg font-bold text-black dark:text-white">
          暂无工作收集
        </h2>
        <p className="mt-2">
          这里会用来放工作中遇到的代码片段、伪代码、函数写法和实现思路。
        </p>
      </div>
    );
  }

  redirect(`/practice/work/${problems[0].id}`);
}
