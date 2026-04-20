import fs from "fs";
import matter from "gray-matter";
import path from "path";
import { z } from "zod";
import type { Post } from "@/types";

const postsDirectory = path.join(process.cwd(), "content");

export const PostFrontmatterSchema = z.object({
  title: z.string().min(1, "title 不能为空"),
  subtitle: z.string().optional(),
  date: z.string().min(1, "date 不能为空"),
  excerpt: z.string().optional(),
  category: z.string().optional(),
  tags: z.union([z.array(z.string()), z.string()]).optional(),
  cover: z.string().optional(),
  draft: z.boolean().optional().default(false),
  updatedAt: z.string().optional(),
  author: z.string().optional(),
});

type PostFrontmatter = z.infer<typeof PostFrontmatterSchema>;

export function sortPostsByDate(posts: Post[]): Post[] {
  return [...posts].sort((a, b) => {
    const dateA = a.date ? new Date(a.date).getTime() : 0;
    const dateB = b.date ? new Date(b.date).getTime() : 0;
    return dateB - dateA;
  });
}

function getAllMdxFiles(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      getAllMdxFiles(filePath, fileList);
      return;
    }

    if (file.endsWith(".mdx")) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

function getSlugFromPath(filePath: string): string {
  const relativePath = path.relative(postsDirectory, filePath);
  return relativePath.replace(/\.mdx$/, "").replace(/\\/g, "/");
}

function normalizeDraft(raw: unknown): boolean {
  if (typeof raw === "boolean") return raw;
  if (typeof raw === "string") {
    const lowered = raw.trim().toLowerCase();
    if (lowered === "true") return true;
    if (lowered === "false") return false;
  }
  return false;
}

function parseFrontmatter(content: string, filePath: string): { frontmatter: PostFrontmatter; body: string } {
  const parsed = matter(content);
  const safeResult = PostFrontmatterSchema.safeParse({
    ...parsed.data,
    draft: normalizeDraft(parsed.data.draft),
  });

  if (!safeResult.success) {
    const detail = safeResult.error.issues
      .map((issue) => `${issue.path.join(".") || "root"}: ${issue.message}`)
      .join("; ");
    throw new Error(`[content validation] ${filePath} -> ${detail}`);
  }

  return {
    frontmatter: safeResult.data,
    body: parsed.content,
  };
}

function toPost(slug: string, frontmatter: PostFrontmatter): Post {
  return {
    slug,
    title: frontmatter.title,
    subtitle: frontmatter.subtitle,
    date: frontmatter.date,
    excerpt: frontmatter.excerpt,
    category: frontmatter.category,
    tags: normalizeTags(frontmatter.tags),
    cover: frontmatter.cover,
    draft: frontmatter.draft,
    updatedAt: frontmatter.updatedAt,
    author: frontmatter.author,
  };
}

export function getAllPosts(): Post[] {
  const files = getAllMdxFiles(postsDirectory).filter((filePath) => {
    const relative = path.relative(postsDirectory, filePath);
    return /[\\/]/.test(relative);
  });

  const posts = files
    .map((filePath) => {
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { frontmatter } = parseFrontmatter(fileContent, filePath);
      const slug = getSlugFromPath(filePath);
      return toPost(slug, frontmatter);
    })
    .filter((post) => !post.draft);

  return sortPostsByDate(posts);
}

export function getPostBySlug(slug: string): { frontmatter: Post; content: string } | null {
  const filePath = path.join(postsDirectory, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { frontmatter, body } = parseFrontmatter(fileContent, filePath);

  return {
    frontmatter: toPost(slug, frontmatter),
    content: body,
  };
}

export function normalizeTags(raw: unknown): string[] {
  const clean = (val: string) => val.replace(/^['"]|['"]$/g, "").trim();

  if (Array.isArray(raw)) {
    return raw.map((tag) => clean(String(tag))).filter(Boolean);
  }

  if (typeof raw === "string") {
    const trimmed = raw.trim();
    if (!trimmed) return [];

    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      return trimmed
        .slice(1, -1)
        .split(",")
        .map((item) => clean(item))
        .filter(Boolean);
    }

    if (trimmed.includes(",")) {
      return trimmed
        .split(",")
        .map((tag) => clean(tag))
        .filter(Boolean);
    }

    return [clean(trimmed)].filter(Boolean);
  }

  return [];
}
