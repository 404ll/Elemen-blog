import { redirect } from "next/navigation";
import { getAllProblems } from "@/lib/practice/loader";

export default function PracticeIndexPage() {
  const problems = getAllProblems();
  if (problems.length === 0) {
    return (
      <p className="text-gray-600 dark:text-gray-400">暂无题目，请检查 practice 子模块。</p>
    );
  }
  redirect(`/practice/${problems[0].id}`);
}
