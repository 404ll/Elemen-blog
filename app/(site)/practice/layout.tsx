/**
 * /practice 路由布局
 * 服务端读取 manifest 题目列表，左侧 PracticeSidebar + 右侧子路由（索引重定向或详情页）
 */
import "./practice.css";
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
    <div className="practice-workspace">
      <a href="#practice-content" className="practice-skip-link">跳到正文</a>
      <div className="practice-shell">
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
          <main id="practice-content" tabIndex={-1} className="practice-content">{children}</main>
      </div>
    </div>
  );
}
