import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import "./admin.css";

export const metadata: Metadata = {
  title: "YouMind 同步",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="cms-admin">
      <header className="cms-appbar">
        <Link href="/admin" className="cms-brand">
          <Image src="/brand/flame-mark.png" alt="" width={30} height={30} className="cms-brand-mark" />
          <strong>Elemen</strong>
          <span className="cms-brand-divider">/</span>
          <span>写作工作台</span>
        </Link>
        <Link className="cms-visit" href="/blog" target="_blank">
          查看博客 <ArrowUpRight size={15} aria-hidden="true" />
        </Link>
      </header>
      {children}
    </div>
  );
}
