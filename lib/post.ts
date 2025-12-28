import fs from "fs"
import path from "path"
import type { Post } from "@/types"
const postsDirectory = path.join(process.cwd(), "content")

// 递归获取所有 MDX 文件
function getAllMdxFiles(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir)

  files.forEach((file) => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      getAllMdxFiles(filePath, fileList)
    } else if (file.endsWith(".mdx")) {
      fileList.push(filePath)
    }
  })

  return fileList
}

// 从文件路径提取 slug（例如：content/hello/HelloWorld.mdx -> hello/HelloWorld）
function getSlugFromPath(filePath: string): string {
  const relativePath = path.relative(postsDirectory, filePath)
  return relativePath.replace(/\.mdx$/, "").replace(/\\/g, "/")
}

// 解析 frontmatter（简单的 YAML 解析，不依赖 gray-matter）
function parseFrontmatter(content: string): { frontmatter: Record<string, any>, body: string } {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/
  const match = content.match(frontmatterRegex)

  if (!match) {
    return { frontmatter: {}, body: content }
  }

  const frontmatterText = match[1]
  const body = match[2]

  // 简单的 frontmatter 解析（支持 title, subtitle, date, excerpt）
  const frontmatter: Record<string, any> = {}
  frontmatterText.split("\n").forEach((line) => {
    const colonIndex = line.indexOf(":")
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim()
      let value = line.substring(colonIndex + 1).trim()
      // 移除引号
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1)
      }
      frontmatter[key] = value
    }
  })

  return { frontmatter, body }
}


export function getAllPosts(): Post[] {
  // 仅展示位于子文件夹内的文章，过滤掉 content 根目录下的散落 MDX
  // 相对路径中包含分隔符（/ 或 \）即表示在子目录
  const files = getAllMdxFiles(postsDirectory).filter((filePath) => {
    const relative = path.relative(postsDirectory, filePath)
    return /[\\/]/.test(relative)
  })

  const posts = files.map((filePath) => {
    const fileContent = fs.readFileSync(filePath, "utf-8")
    const { frontmatter } = parseFrontmatter(fileContent)
    const slug = getSlugFromPath(filePath)

    return {
      slug,
      ...frontmatter,
    }
  })

  // 按日期排序（最新的在前）
  return posts.sort((a, b) => {
    const dateA = (a as Post).date ? new Date((a as Post).date!).getTime() : 0
    const dateB = (b as Post).date ? new Date((b as Post).date!).getTime() : 0
    return dateB - dateA
  })
}

export function getPostBySlug(slug: string): { frontmatter: Record<string, any>, content: string } | null {
  const filePath = path.join(postsDirectory, `${slug}.mdx`)
  
  if (!fs.existsSync(filePath)) {
    return null
  }

  const fileContent = fs.readFileSync(filePath, "utf-8")
  const { frontmatter, body } = parseFrontmatter(fileContent)

  return { frontmatter, content: body }
}

// 辅助函数：归一化 tags，支持数组、逗号分隔、JSON 数组字符串
export function normalizeTags(raw: unknown): string[] {
  const clean = (val: string) =>
    val.replace(/^["']|["']$/g, "").trim();

  if (Array.isArray(raw)) {
    return raw.map((t) => clean(String(t))).filter(Boolean);
  }

  if (typeof raw === "string") {
    const trimmed = raw.trim();
    // 尝试解析 JSON 数组字符串
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parsed.map((t) => clean(String(t))).filter(Boolean);
        }
      } catch (_) {
        // fallback 到逗号分隔解析
      }
    }
    return trimmed
      .split(",")
      .map((t) => clean(t))
      .filter(Boolean);
  }

  return [];
}