// lib/posts.ts
import fs from "fs"
import path from "path"
import matter from "gray-matter"

const postsDirectory = path.join(process.cwd(), "content/*")

export function getAllPosts() {
  const files = fs.readdirSync(postsDirectory)

  return files.map((file) => {
    const filePath = path.join(postsDirectory, file)
    const fileContent = fs.readFileSync(filePath, "utf-8")

    const { data } = matter(fileContent)

    return {
      slug: file.replace(".mdx", ""),
      ...data,
    }
  })
}

export function getPostBySlug(slug: string) {
  const filePath = path.join(postsDirectory, `${slug}.mdx`)
  const fileContent = fs.readFileSync(filePath, "utf-8")

  const { data, content } = matter(fileContent)

  return { frontmatter: data, content }
}
