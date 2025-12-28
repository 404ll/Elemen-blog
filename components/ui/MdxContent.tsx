// components/ui/mdx-components.tsx
import { MacCodeBlock } from "@/components/ui/MacCode";
import React from "react";

export const mdxComponents = {
  h1: (props: any) => (
    <h1
      className="mt-12 mb-6 scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl text-gray-900 dark:text-gray-100"
      {...props}
    />
  ),

  h2: (props: any) => (
    <h2
      className="mt-10 mb-4 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100 first:mt-0"
      {...props}
    />
  ),

  h3: (props: any) => (
    <h3
      className="mt-8 mb-4 scroll-m-20 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100"
      {...props}
    />
  ),

  h4: (props: any) => (
    <h4
      className="mt-6 mb-3 scroll-m-20 text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-100"
      {...props}
    />
  ),

  h5: (props: any) => (
    <h5
      className="mt-6 mb-3 scroll-m-20 text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-100"
      {...props}
    />
  ),

  h6: (props: any) => (
    <h6
      className="mt-6 mb-3 scroll-m-20 text-base font-semibold tracking-tight text-gray-900 dark:text-gray-100"
      {...props}
    />
  ),

  p: (props: any) => (
    <p
      className="leading-7 [&:not(:first-child)]:mt-6 text-gray-900 dark:text-gray-100"
      {...props}
    />
  ),

  ul: (props: any) => (
    <ul
      className="my-6 ml-6 list-disc [&>li]:mt-2 text-gray-900 dark:text-gray-100"
      {...props}
    />
  ),

  ol: (props: any) => (
    <ol
      className="my-6 ml-6 list-decimal [&>li]:mt-2 text-gray-900 dark:text-gray-100"
      {...props}
    />
  ),

  li: (props: any) => <li className="leading-7" {...props} />,

  a: (props: any) => (
    <a
      className="font-semibold text-blue-600 underline underline-offset-4 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
      {...props}
    />
  ),

  blockquote: (props: any) => (
    <blockquote
      className="mt-6 border-l-4 border-gray-400 pl-6 italic text-gray-800 dark:text-gray-200 dark:border-gray-500 [&>*]:text-gray-800 dark:[&>*]:text-gray-200"
      {...props}
    />
  ),

  hr: (props: any) => (
    <hr className="my-8 border-gray-200 dark:border-gray-800" {...props} />
  ),

  table: (props: any) => (
    <div className="my-6 w-full overflow-y-auto">
      <table className="w-full border-collapse" {...props} />
    </div>
  ),

  thead: (props: any) => (
    <thead className="border-b bg-gray-50 dark:bg-gray-800/50" {...props} />
  ),

  tbody: (props: any) => (
    <tbody className="[&>tr:last-child]:border-0" {...props} />
  ),

  tr: (props: any) => (
    <tr className="border-b transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-800/50 dark:border-gray-800" {...props} />
  ),

  th: (props: any) => (
    <th
      className="h-12 px-4 text-left align-middle font-semibold text-gray-900 dark:text-gray-100 [&:has([align=center])]:text-center [&:has([align=right])]:text-right"
      {...props}
    />
  ),

  td: (props: any) => (
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

  pre: ({ children, ...props }: any) => {
    // 检查是否有语言类名
    const hasLanguage = React.Children.toArray(children).some(
      (child: any) => child?.props?.className?.startsWith('language-')
    );
    
    return (
      <div className="my-8">
        <MacCodeBlock hasLanguage={hasLanguage}>{children}</MacCodeBlock>
      </div>
    );
  },

  code: ({ className, children, ...props }: any) => {
    // 行内代码（没有 className 或不是语言类）
    if (!className || !className.startsWith('language-')) {
      return (
        <code
          className="relative rounded bg-gray-100 dark:bg-gray-800 px-[0.4rem] py-[0.2rem] font-mono text-sm font-semibold text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600"
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

  img: (props: any) => (
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
  strong: (props: any) => (
    <strong className="font-bold text-gray-900 dark:text-gray-100" {...props} />
  ),

  // 斜体文本
  em: (props: any) => (
    <em className="italic text-gray-900 dark:text-gray-100" {...props} />
  ),

  // 删除线
  del: (props: any) => (
    <del className="line-through text-gray-600 dark:text-gray-400" {...props} />
  ),
};
