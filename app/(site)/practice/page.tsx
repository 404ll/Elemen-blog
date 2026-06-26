/**
 * /practice 索引页：无独立列表 UI，重定向到排序后的第一道题
 */
import { redirect } from "next/navigation";
import { getAllProblems } from "@/lib/practice/loader";

export default function PracticeIndexPage() {
  const problems = getAllProblems({ collection: "handwriting" });
  if (problems.length === 0) {
    return (
      <p className="text-gray-600 dark:text-gray-400">暂无题目，请检查 practice 子模块。</p>
    );
  }
  // getAllProblems 已按 updatedAt / 标题排序，首项即默认入口题
  redirect(`/practice/${problems[0].id}`);
}
