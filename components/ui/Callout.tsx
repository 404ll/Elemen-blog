import type { ReactNode } from "react";
import { AlertCircle, CheckCircle2, Lightbulb, TriangleAlert } from "lucide-react";

type CalloutVariant = "info" | "success" | "warn" | "tip";

type CalloutProps = {
  children: ReactNode;
  title?: string;
  type?: CalloutVariant;
};

const variantStyles: Record<CalloutVariant, { wrapper: string; icon: ReactNode; defaultTitle: string }> = {
  info: {
    wrapper:
      "border-blue-200/80 bg-blue-50/70 text-blue-950 dark:border-blue-800/70 dark:bg-blue-950/40 dark:text-blue-100",
    icon: <AlertCircle size={18} className="mt-0.5 shrink-0" />,
    defaultTitle: "Info",
  },
  success: {
    wrapper:
      "border-emerald-200/80 bg-emerald-50/70 text-emerald-950 dark:border-emerald-800/70 dark:bg-emerald-950/40 dark:text-emerald-100",
    icon: <CheckCircle2 size={18} className="mt-0.5 shrink-0" />,
    defaultTitle: "Done",
  },
  warn: {
    wrapper:
      "border-amber-200/80 bg-amber-50/80 text-amber-950 dark:border-amber-800/70 dark:bg-amber-950/40 dark:text-amber-100",
    icon: <TriangleAlert size={18} className="mt-0.5 shrink-0" />,
    defaultTitle: "Warning",
  },
  tip: {
    wrapper:
      "border-violet-200/80 bg-violet-50/80 text-violet-950 dark:border-violet-800/70 dark:bg-violet-950/40 dark:text-violet-100",
    icon: <Lightbulb size={18} className="mt-0.5 shrink-0" />,
    defaultTitle: "Tip",
  },
};

export default function Callout({ children, title, type = "info" }: CalloutProps) {
  const style = variantStyles[type];

  return (
    <aside className={`my-8 rounded-xl border px-4 py-4 ${style.wrapper}`}>
      <div className="flex items-start gap-3">
        {style.icon}
        <div className="min-w-0">
          <p className="mb-1 text-sm font-semibold tracking-wide">{title ?? style.defaultTitle}</p>
          <div className="text-[0.97rem] leading-7 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">{children}</div>
        </div>
      </div>
    </aside>
  );
}
