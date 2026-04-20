import type { NextConfig } from "next";
import mdx from '@next/mdx'
const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],

  experimental: {
    mdxRs: true,
  },

  images: {
    formats: ["image/avif", "image/webp"],
  },

  poweredByHeader: false,
};

export default mdx()(nextConfig)
