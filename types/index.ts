export interface Post {
    slug: string
    title?: string
    subtitle?: string
    date?: string
    excerpt?: string
    category?: string
    [key: string]: any //索引签名 - 字段可扩展
  }