// components/ui/mdx-components.tsx
import { MacCodeBlock } from "@/components/ui/MacCode";
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
        className="mt-12 mb-6 scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl text-gray-900 dark:text-gray-100"
        {...props}
      />
    );
  },

  h2: (props: BasicProps) => {
    const headingId = getHeadingId(props.id, props.children);
    return (
      <h2
        id={headingId}
        className="mt-12 mb-5 scroll-m-24 border-b border-gray-200/80 dark:border-gray-700/80 pb-2 text-[1.8rem] font-semibold tracking-tight text-gray-900 dark:text-gray-100 first:mt-0"
        {...props}
      />
    );
  },

  h3: (props: BasicProps) => {
    const headingId = getHeadingId(props.id, props.children);
    return (
      <h3
        id={headingId}
        className="mt-10 mb-4 scroll-m-24 text-[1.45rem] font-semibold tracking-tight text-gray-900 dark:text-gray-100"
        {...props}
      />
    );
  },

  h4: (props: BasicProps) => (
    <h4
      className="mt-8 mb-3 scroll-m-24 text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-100"
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
      className="leading-[1.9] [&:not(:first-child)]:mt-7 text-gray-900 dark:text-gray-100"
      {...props}
    />
  ),

  ul: (props: BasicProps) => (
    <ul
      className="my-7 ml-6 list-disc [&>li]:mt-2.5 text-gray-900 dark:text-gray-100"
      {...props}
    />
  ),

  ol: (props: BasicProps) => (
    <ol
      className="my-7 ml-6 list-decimal [&>li]:mt-2.5 text-gray-900 dark:text-gray-100"
      {...props}
    />
  ),

  li: (props: BasicProps) => <li className="leading-8" {...props} />,

  a: (props: BasicProps) => (
    <a
      className="font-semibold text-blue-600 underline underline-offset-4 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
      {...props}
    />
  ),

  blockquote: (props: BasicProps) => (
    <blockquote
      className="mt-8 border-l-4 border-gray-400 pl-6 italic text-gray-800 dark:text-gray-200 dark:border-gray-500 [&>*]:text-gray-800 dark:[&>*]:text-gray-200 bg-gray-100 dark:bg-gray-800/50 p-4 rounded-lg"
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

  pre: ({ children }: PreProps) => {
    const hasLanguage = React.Children.toArray(children).some(
      (child) =>
        React.isValidElement<{ className?: string }>(child) &&
        typeof child.props.className === "string" &&
        child.props.className.startsWith("language-")
    );

    return (
      <div className="my-10">
        <MacCodeBlock hasLanguage={hasLanguage}>{children}</MacCodeBlock>
      </div>
    );
  },

  code: ({ className, children, ...props }: CodeProps) => {
    if (!className || !className.startsWith("language-")) {
      return (
        <code
          className="relative rounded bg-gray-100 dark:bg-gray-800 px-[0.15rem] py-[0.2rem] font-mono text-sm font-semibold text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600"
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
    <strong className="font-bold text-gray-900 dark:text-gray-100" {...props} />
  ),

  em: (props: BasicProps) => (
    <em className="italic text-gray-900 dark:text-gray-100" {...props} />
  ),

  del: (props: BasicProps) => (
    <del className="line-through text-gray-600 dark:text-gray-400" {...props} />
  ),

  Callout,
  Figure,
  Steps,
  Step,
};
