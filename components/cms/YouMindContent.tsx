import { mdxComponents } from "@/components/ui/MdxContent";
import { safeImageUrl } from "@/lib/markdown/youmind";
import { compileYouMindContent } from "@/server/cms/render";
import "./youmind-reading.css";

export default async function YouMindContent({ content }: { content: string }) {
  const { Content, images } = await compileYouMindContent(content);
  return <div className="cms-copy"><Content components={{
    ...mdxComponents,
    a: ({ href, children }) => {
      const safe = typeof href === "string" && /^(https?:\/\/|mailto:|\/[^/]|#)/i.test(href);
      return safe ? <a href={href} rel="noopener noreferrer">{children}</a> : <span>{children}</span>;
    },
    img: ({ src, alt }) => {
      const url = typeof src === "string" ? safeImageUrl(src) : undefined;
      if (!url) return <span className="cms-image-unavailable">[图片未显示：{alt || "暂不支持的图片地址"}]</span>;
      const meta = images[url];
      const displayUrl = url.startsWith("https://cdn.gooo.ai/gen-images/") && url.endsWith(".png") ? `${url}@large` : url;
      return <span className="cms-image">
        {/* The source CDN supplies optimized variants; native images also support old documents without dimensions. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={displayUrl} alt={meta?.alt || alt || ""} width={meta?.width} height={meta?.height} loading="lazy" decoding="async" />
        {meta?.caption && <span className="cms-caption">{meta.caption}</span>}
      </span>;
    },
  }} /></div>;
}
