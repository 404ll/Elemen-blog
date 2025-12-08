import type { NextConfig } from "next";
import mdx from '@next/mdx'
const nextConfig: NextConfig = {
  /* config options here */
    pageExtensions: ['ts', 'tsx', 'md', 'mdx'],

  // 启用 MDX
  experimental: {
    mdxRs: true, // Next.js 内置 Rust compiler 处理 MDX（更快）
  },
};

export default mdx()(nextConfig)
