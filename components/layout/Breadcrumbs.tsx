import Link from "next/link";
import { ChevronRight } from "lucide-react";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="面包屑" className="text-sm text-[#77746d] dark:text-stone-400">
      <ol className="flex min-w-0 items-center gap-1.5">
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1;

          return (
            <li
              key={`${item.href ?? "current"}-${index}`}
              className={`flex items-center gap-1.5 ${isCurrent ? "min-w-0" : "shrink-0"}`}
            >
              {index > 0 && (
                <ChevronRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
              )}
              {item.href && !isCurrent ? (
                <Link
                  href={item.href}
                  className="rounded-sm transition-colors hover:text-[#a45e3f] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c45330] dark:hover:text-stone-100"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isCurrent ? "page" : undefined}
                  className="truncate text-[#45433e] dark:text-stone-300"
                  title={item.label}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
