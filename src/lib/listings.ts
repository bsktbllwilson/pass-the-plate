import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/types/database'

export type Listing = Database['public']['Tables']['listings']['Row']

export async function getTrendingListings(limit = 4): Promise<Listing[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .eq('status', 'active')
    .order('view_count', { ascending: false })
    .limit(limit)
  if (error) {
    console.error('getTrendingListings error:', error)
    return []
  }
  return data ?? []
}

export async function getListingBySlug(slug: string): Promise<Listing | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'active')
    .maybeSingle()
  if (error) {
    console.error('getListingBySlug error:', error)
    return null
  }
  return data
}

type GetListingsOpts = {
  q?: string
  industry?: string | string[]
  cuisine?: string | string[]
  location?: string | string[]
  assets?: string | string[]
  minPrice?: number
  maxPrice?: number
  minRevenue?: number
  maxRevenue?: number
  page?: number
  perPage?: number
}

function toArray(v: string | string[] | undefined): string[] {
  if (!v) return []
  return Array.isArray(v) ? v : [v]
}

function escapePgrstValue(v: string): string {
  return v.replace(/[(),"]/g, ' ').trim()
}

function listingAssetsAsStrings(assets: Listing['assets']): string[] {
  if (!Array.isArray(assets)) return []
  return assets.filter((a): a is string => typeof a === 'string')
}

export async function getListings(opts: GetListingsOpts = {}): Promise<{ rows: Listing[]; totalCount: number; totalPages: number }> {
  const { q, industry, cuisine, location, assets, minPrice, maxPrice, minRevenue, maxRevenue, page = 1, perPage = 12 } = opts
  const supabase = await createClient()

  const industries = toArray(industry)
  const cuisines = toArray(cuisine)
  const locations = toArray(location)
  const assetNeedles = toArray(assets).map(s => s.toLowerCase())

  // PostgreSQL substring matching on a jsonb array of strings is awkward
  // through PostgREST. We push every other filter to the database and do the
  // asset substring match in JS post-fetch — the dataset is small and the
  // alternative is a custom RPC just for this filter.
  const hasAssetFilter = assetNeedles.length > 0
  const from = (page - 1) * perPage
  const to = from + perPage - 1

  let query = supabase
    .from('listings')
    .select('*', { count: 'exact' })
    .eq('status', 'active')

  if (q) {
    const needle = escapePgrstValue(q.trim())
    if (needle) {
      query = query.or(`title.ilike.%${needle}%,description.ilike.%${needle}%,location.ilike.%${needle}%`)
    }
  }
  if (industries.length) query = query.in('industry', industries)
  if (cuisines.length) query = query.in('cuisine', cuisines)
  if (locations.length) {
    const orClause = locations
      .map(loc => `location.ilike.%${escapePgrstValue(loc)}%`)
      .join(',')
    query = query.or(orClause)
  }
  if (typeof minPrice === 'number') query = query.gte('asking_price_cents', minPrice)
  if (typeof maxPrice === 'number') query = query.lte('asking_price_cents', maxPrice)
  if (typeof minRevenue === 'number') query = query.gte('annual_revenue_cents', minRevenue)
  if (typeof maxRevenue === 'number') query = query.lte('annual_revenue_cents', maxRevenue)
  query = query.order('view_count', { ascending: false })
  if (!hasAssetFilter) query = query.range(from, to)

  const { data, count, error } = await query
  if (error) {
    console.error('getListings error:', error)
    return { rows: [], totalCount: 0, totalPages: 1 }
  }

  if (!hasAssetFilter) {
    const totalCount = count ?? 0
    return {
      rows: data ?? [],
      totalCount,
      totalPages: Math.max(1, Math.ceil(totalCount / perPage)),
    }
  }

  const filtered = (data ?? []).filter(row => {
    const items = listingAssetsAsStrings(row.assets).map(s => s.toLowerCase())
    return assetNeedles.every(needle => items.some(a => a.includes(needle)))
  })
  const totalCount = filtered.length
  const totalPages = Math.max(1, Math.ceil(totalCount / perPage))
  const paged = filtered.slice(from, from + perPage)
  return { rows: paged, totalCount, totalPages }
}
