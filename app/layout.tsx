import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/provider/ThemeProvider";
import Navbar from "@/components/layout/Navbar";
import ObservabilityClient from "@/components/ui/ObservabilityClient";
import localFont from "next/font/local";

// Bitcount Prop Single - 英文像素字体
const bitcountFont = localFont({
  src: './fonts/Bitcount_Prop_Single/BitcountPropSingle-VariableFont_CRSV,ELSH,ELXP,slnt,wght.ttf',
  variable: '--font-bitcount',
  display: 'swap',
  weight: '100 900', 
});

// JetBrains Mono - 本地等宽字体
const monoFont = localFont({
  src: './fonts/JetBrains_Mono/fonts/variable/JetBrainsMono[wght].ttf',
  variable: '--font-jetbrains-mono',
  display: 'swap',
  weight: '100 900',
});
export const metadata: Metadata = {
  title: {
    default: "Elemen / 个人知识库",
    template: "%s | Elemen",
  },
  description: "记录前端、AI、算法与工程实践中的真实问题，让零散的理解彼此连接。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body
        className={`${bitcountFont.variable} ${monoFont.variable} antialiased`}
      >
        <ThemeProvider>
          <ObservabilityClient />
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
