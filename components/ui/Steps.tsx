import type { ReactNode } from "react";

type StepsProps = {
  children: ReactNode;
};

type StepProps = {
  title: string;
  children: ReactNode;
};

export function Steps({ children }: StepsProps) {
  return <div className="my-9 space-y-4">{children}</div>;
}

export function Step({ title, children }: StepProps) {
  return (
    <section className="relative rounded-xl border border-gray-200 bg-gray-50/80 px-4 py-4 dark:border-gray-700 dark:bg-gray-800/40">
      <p className="mb-2 text-sm font-semibold uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400">{title}</p>
      <div className="text-[0.98rem] leading-7 text-gray-900 dark:text-gray-100 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
        {children}
      </div>
    </section>
  );
}
