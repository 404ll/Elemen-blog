// components/ui/mdx-components.tsx
import { MacCodeBlock } from "@/components/ui/MacCode";
import React from "react";

type BasicProps = { children?: React.ReactNode } & Record<string, unknown>;
type PreProps = BasicProps;
type CodeProps = BasicProps & { className?: string };
type ImgProps = BasicProps & { alt?: string };

export const mdxComponents = {
  h1: (props: BasicProps) => (
    <h1
      className="mt-12 mb-6 scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl text-gray-900 dark:text-gray-100"
      {...props}
    />
  ),

  h2: (props: BasicProps) => (
    <h2
      className="mt-10 mb-4 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100 first:mt-0"
      {...props}
    />
  ),

  h3: (props: BasicProps) => (
    <h3
      className="mt-8 mb-4 scroll-m-20 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100"
      {...props}
    />
  ),

  h4: (props: BasicProps) => (
    <h4
      className="mt-6 mb-3 scroll-m-20 text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-100"
      {...props}
    />
  ),

  h5: (props: BasicProps) => (
    <h5
      className="mt-6 mb-3 scroll-m-20 text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-100"
      {...props}
    />
  ),

  h6: (props: BasicProps) => (
    <h6
      className="mt-6 mb-3 scroll-m-20 text-base font-semibold tracking-tight text-gray-900 dark:text-gray-100"
      {...props}
    />
  ),

  p: (props: BasicProps) => (
    <p
      className="leading-7 [&:not(:first-child)]:mt-6 text-gray-900 dark:text-gray-100"
      {...props}
    />
  ),

  ul: (props: BasicProps) => (
    <ul
      className="my-6 ml-6 list-disc [&>li]:mt-2 text-gray-900 dark:text-gray-100"
      {...props}
    />
  ),

  ol: (props: BasicProps) => (
    <ol
      className="my-6 ml-6 list-decimal [&>li]:mt-2 text-gray-900 dark:text-gray-100"
      {...props}
    />
  ),

  li: (props: BasicProps) => <li className="leading-7" {...props} />,

  a: (props: BasicProps) => (
    <a
      className="font-semibold text-blue-600 underline underline-offset-4 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
      {...props}
    />
  ),

  blockquote: (props: BasicProps) => (
    <blockquote
      className="mt-6 border-l-4 border-gray-400 pl-6 italic text-gray-800 dark:text-gray-200 dark:border-gray-500 [&>*]:text-gray-800 dark:[&>*]:text-gray-200 bg-gray-100 dark:bg-gray-800/50 p-4 rounded-lg"
      {...props}
    />
  ),

  hr: (props: BasicProps) => (
    <hr className="my-8 border-gray-200 dark:border-gray-800" {...props} />
  ),

  table: (props: BasicProps) => (
    <div className="my-6 w-full overflow-y-auto">
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
      className="h-12 px-4 text-left align-middle font-semibold text-gray-900 dark:text-gray-100 [&:has([align=center])]:text-center [&:has([align=right])]:text-right"
      {...props}
    />
  ),

  td: (props: BasicProps) => (
    <td
      className="p-4 align-middle text-gray-900 dark:text-gray-100 [&:has([align=center])]:text-center [&:has([align=right])]:text-right"
      {...props}
    />
  ),

  /**
   * ==============
   * 代码（关键）
   * ==============
   */

  pre: ({ children, ...props }: PreProps) => {
    // 检查是否有语言类名
    const hasLanguage = React.Children.toArray(children).some(
      (child) =>
        React.isValidElement<{ className?: string }>(child) &&
        typeof child.props.className === "string" &&
        child.props.className.startsWith("language-")
    );
    
    return (
      <div className="my-8">
        <MacCodeBlock hasLanguage={hasLanguage}>
          {children}
        </MacCodeBlock>
      </div>
    );
  },

  code: ({ className, children, ...props }: CodeProps) => {
    // 行内代码（没有 className 或不是语言类）
    if (!className || !className.startsWith('language-')) {
      return (
        <code
          className="relative rounded bg-gray-100 dark:bg-gray-800 px-[0.1rem] py-[0.2rem] font-mono text-sm font-semibold text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600"
          {...props}
        >
          {children}
        </code>
      );
    }

    // 块级代码交给 pre
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },

  img: (props: ImgProps) => (
    <figure className="my-8">
      <img
        className="rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm"
        loading="lazy"
        {...props}
      />
      {props.alt && (
        <figcaption className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          {props.alt}
        </figcaption>
      )}
    </figure>
  ),

  // 强调文本
  strong: (props: BasicProps) => (
    <strong className="font-bold text-gray-900 dark:text-gray-100" {...props} />
  ),

  // 斜体文本
  em: (props: BasicProps) => (
    <em className="italic text-gray-900 dark:text-gray-100" {...props} />
  ),

  // 删除线
  del: (props: BasicProps) => (
    <del className="line-through text-gray-600 dark:text-gray-400" {...props} />
  ),
};
