import Link from "next/link";
import LanguageSwitcher from "../i18n/LanguageSwitcher";
import Image from "next/image";
export default function Navbar() {
  return (
    <nav className="w-full flex items-center justify-between p-4 text-black fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-white/10"> {/* 毛玻璃效果 */}
      {/* 左侧：Logo + 标题 */}
      <div className="flex items-center gap-2">
        <Image src="/logo.jpg" alt="logo" className="w-8 h-8 rounded-full" width={100} height={100} />
        <div className="font-bitcount text-3xl font-semibold">Elemen's Blog</div>
      </div>
      
      {/* 中间：导航链接 */}
      <div className="flex items-center gap-6">
        <Link href="/about" className="hover:opacity-70 transition-opacity text-xl font-semibold">About</Link>
        <Link href="/blog" className="hover:opacity-70 transition-opacity text-xl font-semibold">Blog</Link>
        <Link href="/projects" className="hover:opacity-70 transition-opacity text-xl font-semibold">Projects</Link>
        <Link href="/contact" className="hover:opacity-70 transition-opacity text-xl font-semibold">Contact</Link>
      </div>
      
      {/* 右侧：语言切换 + 主题切换 */}
      <div className="flex items-center gap-2">
        <LanguageSwitcher />
        <div>主题切换</div>
      </div>
    </nav>
  );
}