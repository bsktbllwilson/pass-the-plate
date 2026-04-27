import { POSTS, type PlaybookPost } from '@/data/playbook'

export type { PlaybookPost }

type GetPostsOpts = {
  category?: string
  page?: number
  perPage?: number
}

export async function getPosts(opts: GetPostsOpts = {}): Promise<{ rows: PlaybookPost[]; totalCount: number; totalPages: number }> {
  const { category, page = 1, perPage = 12 } = opts

  let rows = POSTS.slice().sort((a, b) => b.published_at.localeCompare(a.published_at))
  if (category) rows = rows.filter(p => p.category === category)

  const totalCount = rows.length
  const totalPages = Math.max(1, Math.ceil(totalCount / perPage))
  const start = (page - 1) * perPage
  const paged = rows.slice(start, start + perPage)

  return { rows: paged, totalCount, totalPages }
}

export async function getPostBySlug(slug: string): Promise<PlaybookPost | null> {
  return POSTS.find(p => p.slug === slug) ?? null
}

export async function getRelatedPosts(slug: string, limit: number): Promise<PlaybookPost[]> {
  const current = POSTS.find(p => p.slug === slug)
  if (!current) return []
  return POSTS
    .filter(p => p.slug !== slug && p.category === current.category)
    .sort((a, b) => b.published_at.localeCompare(a.published_at))
    .slice(0, limit)
}
