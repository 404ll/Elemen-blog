// components/ui/mdx-components.tsx
import React from "react";
import Image from "next/image";
import { slugify } from "@/lib/slugify";
import Callout from "@/components/ui/Callout";
import Figure from "@/components/ui/Figure";
import { Step, Steps } from "@/components/ui/Steps";

type BasicProps = { children?: React.ReactNode; id?: string } & Record<string, unknown>;
type PreProps = BasicProps;
type CodeProps = BasicProps & { className?: string };
type ImgProps = BasicProps & { alt?: string };

function extractText(children: React.ReactNode): string {
  if (typeof children === "string" || typeof children === "number") {
    return String(children);
  }

  if (Array.isArray(children)) {
    return children.map(extractText).join(" ").trim();
  }

  if (React.isValidElement<{ children?: React.ReactNode }>(children)) {
    return extractText(children.props.children);
  }

  return "";
}

function getHeadingId(id: string | undefined, children: React.ReactNode): string | undefined {
  if (id) return id;
  const text = extractText(children);
  if (!text) return undefined;
  return slugify(text);
}

export const mdxComponents = {
  h1: (props: BasicProps) => {
    const headingId = getHeadingId(props.id, props.children);
    return (
      <h1
        id={headingId}
        className="mb-6 mt-12 scroll-m-20 text-balance text-[1.75rem] font-semibold leading-[1.25] tracking-[-0.025em] text-[#191916] dark:text-stone-100 md:text-[2rem]"
        {...props}
      />
    );
  },

  h2: (props: BasicProps) => {
    const headingId = getHeadingId(props.id, props.children);
    return (
      <h2
        id={headingId}
        className="mb-5 mt-12 scroll-m-24 border-b border-[#dedbd3] pb-3 text-balance text-2xl font-semibold leading-8 tracking-[-0.02em] text-[#191916] first:mt-0 dark:border-white/15 dark:text-stone-100"
        {...props}
      />
    );
  },

  h3: (props: BasicProps) => {
    const headingId = getHeadingId(props.id, props.children);
    return (
      <h3
        id={headingId}
        className="mb-3 mt-9 scroll-m-24 text-balance text-xl font-semibold leading-[1.5] tracking-[-0.015em] text-[#252521] dark:text-stone-100"
        {...props}
      />
    );
  },

  h4: (props: BasicProps) => (
    <h4
      className="mb-2 mt-7 scroll-m-24 text-lg font-semibold leading-7 text-[#252521] dark:text-stone-100"
      {...props}
    />
  ),

  h5: (props: BasicProps) => (
    <h5
      className="mt-4 mb-1 scroll-m-20 text-sm font-semibold leading-snug tracking-tight text-gray-900 dark:text-gray-100"
      {...props}
    />
  ),

  h6: (props: BasicProps) => (
    <h6
      className="mt-4 mb-1 scroll-m-20 text-sm font-medium leading-snug tracking-tight text-gray-500 dark:text-gray-400"
      {...props}
    />
  ),

  p: (props: BasicProps) => (
    <p
      className="text-pretty text-[1.0625rem] leading-8 text-[#45433e] [&:not(:first-child)]:mt-5 dark:text-stone-300"
      {...props}
    />
  ),

  ul: (props: BasicProps) => (
    <ul
      className="my-6 ml-6 list-disc text-[#45433e] marker:text-[#f05a28] [&>li]:mt-2 dark:text-stone-300"
      {...props}
    />
  ),

  ol: (props: BasicProps) => (
    <ol
      className="my-6 ml-6 list-decimal text-[#45433e] marker:font-mono marker:text-[#f05a28] [&>li]:mt-2 dark:text-stone-300"
      {...props}
    />
  ),

  li: (props: BasicProps) => <li className="pl-1 text-[1.0625rem] leading-8" {...props} />,

  a: (props: BasicProps) => (
    <a
      className="font-semibold text-[#d94e20] underline decoration-[#f05a28]/35 decoration-1 underline-offset-4 transition-colors hover:text-[#a93612] hover:decoration-[#f05a28] dark:text-orange-300 dark:hover:text-orange-200"
      {...props}
    />
  ),

  blockquote: (props: BasicProps) => (
    <blockquote
      className="my-8 border-l-2 border-[#f05a28] bg-[#faf3ed] px-5 py-4 text-[#45433e] [&>*]:text-[#45433e] [&>p:first-child]:mt-0 dark:bg-orange-950/20 dark:text-stone-300 dark:[&>*]:text-stone-300"
      {...props}
    />
  ),

  hr: (props: BasicProps) => (
    <hr className="my-10 border-gray-200 dark:border-gray-800" {...props} />
  ),

  table: (props: BasicProps) => (
    <div className="my-8 w-full overflow-y-auto">
      <table className="w-full border-collapse" {...props} />
    </div>
  ),

  thead: (props: BasicProps) => (
    <thead className="border-b bg-gray-100 dark:bg-gray-800" {...props} />
  ),

  tbody: (props: BasicProps) => (
    <tbody className="[&>tr:last-child]:border-0" {...props} />
  ),

  tr: (props: BasicProps) => (
    <tr className="border-b transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-800/50 dark:border-gray-800" {...props} />
  ),

  th: (props: BasicProps) => (
    <th
      className="h-12 px-4 text-left align-middle font-mono text-sm font-semibold text-[#252521] dark:text-stone-100 [&:has([align=center])]:text-center [&:has([align=right])]:text-right"
      {...props}
    />
  ),

  td: (props: BasicProps) => (
    <td
      className="p-4 align-middle text-[0.95rem] leading-7 text-[#45433e] dark:text-stone-300 [&:has([align=center])]:text-center [&:has([align=right])]:text-right"
      {...props}
    />
  ),

  figure: ({ children, ...props }: BasicProps) => {
    const isCodeBlock = (props as Record<string, unknown>)["data-rehype-pretty-code-figure"] !== undefined;
    if (isCodeBlock) {
      return (
        <figure className="not-prose" {...props}>
          {children}
        </figure>
      );
    }
    return <figure {...props}>{children}</figure>;
  },

  pre: ({ children, ...props }: PreProps) => (
    <pre {...props}>{children}</pre>
  ),

  code: ({ className, children, ...props }: CodeProps) => {
    if (!className || !className.startsWith("language-")) {
      return (
        <code
          className="rounded border border-orange-200/80 bg-orange-50 px-1.5 py-0.5 font-mono text-[0.88em] font-medium text-orange-800 dark:border-orange-800/60 dark:bg-orange-950/40 dark:text-orange-300"
          {...props}
        >
          {children}
        </code>
      );
    }

    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },

  img: (props: ImgProps) => (
    <figure className="my-10">
      <Image
        className="rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm"
        loading="lazy"
        alt={props.alt || ""}
        src={props.src as string}
        {...props}
      />
      {props.alt && (
        <figcaption className="mt-3 text-center text-sm text-gray-600 dark:text-gray-400">
          {props.alt}
        </figcaption>
      )}
    </figure>
  ),

  strong: (props: BasicProps) => (
    <strong className="font-semibold text-[#191916] dark:text-stone-100" {...props} />
  ),

  em: (props: BasicProps) => (
    <em className="italic text-[#34342f] dark:text-stone-200" {...props} />
  ),

  del: (props: BasicProps) => (
    <del className="line-through text-gray-600 dark:text-gray-400" {...props} />
  ),

  Callout,
  Figure,
  Steps,
  Step,
};
