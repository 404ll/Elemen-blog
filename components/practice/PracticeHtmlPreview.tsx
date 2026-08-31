type PracticeHtmlPreviewProps = {
  html: string;
  title: string;
};

/**
 * 在独立的 sandbox iframe 中运行完整 HTML 练习。
 * 仅开放脚本执行，不开放同源权限、弹窗、表单或顶层导航。
 */
export default function PracticeHtmlPreview({
  html,
  title,
}: PracticeHtmlPreviewProps) {
  return (
    <div className="overflow-hidden rounded-sm border border-gray-200 bg-white dark:border-gray-700">
      <iframe
        title={`${title}运行预览`}
        srcDoc={html}
        sandbox="allow-scripts"
        referrerPolicy="no-referrer"
        className="block h-[360px] w-full bg-white"
      />
    </div>
  );
}
