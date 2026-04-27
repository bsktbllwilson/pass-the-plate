import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/types/database'

export type PlaybookPost = Database['public']['Tables']['playbook_posts']['Row']

type GetPostsOpts = {
  category?: string
  page?: number
  perPage?: number
}

export async function getPosts(opts: GetPostsOpts = {}): Promise<{ rows: PlaybookPost[]; totalCount: number; totalPages: number }> {
  const { category, page = 1, perPage = 12 } = opts
  const supabase = await createClient()
  const from = (page - 1) * perPage
  const to = from + perPage - 1

  let query = supabase
    .from('playbook_posts')
    .select('*', { count: 'exact' })
    .eq('published', true)
    .order('published_at', { ascending: false, nullsFirst: false })
    .range(from, to)

  if (category) query = query.eq('category', category)

  const { data, count, error } = await query
  if (error) {
    console.error('getPosts error:', error)
    return { rows: [], totalCount: 0, totalPages: 1 }
  }
  const totalCount = count ?? 0
  return {
    rows: data ?? [],
    totalCount,
    totalPages: Math.max(1, Math.ceil(totalCount / perPage)),
  }
}

export async function getPostBySlug(slug: string): Promise<PlaybookPost | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('playbook_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle()
  if (error) {
    console.error('getPostBySlug error:', error)
    return null
  }
  return data
}

export async function getRelatedPosts(slug: string, limit = 3): Promise<PlaybookPost[]> {
  const current = await getPostBySlug(slug)
  if (!current) return []
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('playbook_posts')
    .select('*')
    .eq('published', true)
    .eq('category', current.category)
    .neq('slug', slug)
    .order('published_at', { ascending: false, nullsFirst: false })
    .limit(limit)
  if (error) {
    console.error('getRelatedPosts error:', error)
    return []
  }
  return data ?? []
}
