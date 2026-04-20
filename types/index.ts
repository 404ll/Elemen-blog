export interface Post {
    slug: string
    title: string
    subtitle?: string
    date: string
    excerpt?: string
    category?: string
    tags?: string[]
    cover?: string
    draft?: boolean
    updatedAt?: string
    author?: string
    [key: string]: unknown
  }