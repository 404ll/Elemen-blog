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
// Zen Maru Gothic - 日文中文字体（支持中文显示）
const zenMaruGothicFont = localFont({
  src: [
    {
      path: './fonts/Zen_Maru_Gothic/ZenMaruGothic-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: './fonts/Zen_Maru_Gothic/ZenMaruGothic-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/Zen_Maru_Gothic/ZenMaruGothic-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: './fonts/Zen_Maru_Gothic/ZenMaruGothic-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: './fonts/Zen_Maru_Gothic/ZenMaruGothic-Black.ttf',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-zenmaru',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: "Elemen / 个人知识库",
    template: "%s | Elemen",
  },
  description: "记录前端、AI、算法与工程实践中的真实问题，让零散的理解彼此连接。",
  icons: {
    icon: [
      { url: '/logo.JPG', type: 'image/jpg' },
    ],
    shortcut: '/logo.JPG',
    apple: '/logo.JPG',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body
        className={`${bitcountFont.variable} ${zenMaruGothicFont.variable} ${monoFont.variable} antialiased`}
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
