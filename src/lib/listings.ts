import { createClient } from '@/lib/supabase/server'
import { getAnonClient } from '@/lib/supabase/anon'
import type { Database } from '@/types/database'

export type Listing = Database['public']['Tables']['listings']['Row']

/**
 * Returns the listings the current authenticated user owns (any status:
 * draft / active / archived / sold). RLS scopes the read to the caller
 * via the SSR client; callers MUST be inside a route gated by
 * requireUser().
 */
export async function getMyListings(): Promise<Listing[]> {
  const supabase = await createClient()
  const { data: userResult } = await supabase.auth.getUser()
  if (!userResult.user) return []
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .eq('seller_id', userResult.user.id)
    .order('updated_at', { ascending: false })
  if (error) {
    console.error('getMyListings error:', error)
    return []
  }
  return data ?? []
}

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

export type ListingForMap = {
  id: string
  slug: string
  title: string
  location: string
  cuisine: string | null
  cover_image_url: string | null
  asking_price_cents: number | null
}

/**
 * Returns the lean listing fields the /sell map needs, for active
 * listings only. Uses the cookieless anon client so /sell stays on
 * the static + ISR path. Degrades to [] on missing env vars (the
 * page renders a fallback in that case).
 */
export async function getListingsForMap(): Promise<ListingForMap[]> {
  let supabase: ReturnType<typeof getAnonClient>
  try {
    supabase = getAnonClient()
  } catch (err) {
    console.warn('getListingsForMap skipped: anon client unavailable', err)
    return []
  }
  const { data, error } = await supabase
    .from('listings')
    .select('id, slug, title, location, cuisine, cover_image_url, asking_price_cents')
    .eq('status', 'active')
  if (error) {
    console.error('getListingsForMap error:', error)
    return []
  }
  return (data ?? []) as ListingForMap[]
}

export type MarketCount = {
  /** Display name (city portion of `location`, with `, NY` suffix stripped). */
  market: string
  count: number
}

/**
 * Active listings grouped by city for the /sell "Listing Hotspots" section.
 * Pulls the location field, strips the `, STATE` suffix, and returns the
 * top markets by listing count. Cheap aggregate — fine for ISR.
 */
export async function getMarketCounts(limit = 6): Promise<MarketCount[]> {
  // Use the cookieless anon client so this read doesn't force the calling
  // page into dynamic rendering. The data is publicly visible (status='active'
  // matches the anon RLS), so cookies aren't needed.
  //
  // Wrapped in try so a missing-env-vars build (e.g. a Vercel project that
  // hasn't been configured yet) renders the empty state instead of crashing
  // the prerender. /sell is prerendered with ISR so this runs at build time.
  let supabase: ReturnType<typeof getAnonClient>
  try {
    supabase = getAnonClient()
  } catch (err) {
    console.warn('getMarketCounts skipped: anon client unavailable', err)
    return []
  }
  const { data, error } = await supabase
    .from('listings')
    .select('location')
    .eq('status', 'active')
  if (error) {
    console.error('getMarketCounts error:', error)
    return []
  }

  const counts = new Map<string, number>()
  for (const row of data ?? []) {
    if (!row.location) continue
    const city = row.location.split(',')[0]?.trim()
    if (!city) continue
    counts.set(city, (counts.get(city) ?? 0) + 1)
  }

  return Array.from(counts.entries())
    .map(([market, count]) => ({ market, count }))
    .sort((a, b) => b.count - a.count || a.market.localeCompare(b.market))
    .slice(0, limit)
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

export type ListingsSort = 'trending' | 'newest' | 'price_asc' | 'revenue_desc'

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
  sort?: ListingsSort
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
  const { q, industry, cuisine, location, assets, minPrice, maxPrice, minRevenue, maxRevenue, page = 1, perPage = 12, sort = 'trending' } = opts
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
  // Sort: defaults to "trending" (most-viewed first) to preserve existing
  // behavior; the /buy page surfaces the others as a Sort dropdown. We
  // tack on a stable id tiebreaker so equal values produce a deterministic
  // order across pages (otherwise pagination can show duplicates).
  if (sort === 'newest') query = query.order('created_at', { ascending: false }).order('id', { ascending: false })
  else if (sort === 'price_asc') query = query.order('asking_price_cents', { ascending: true }).order('id', { ascending: true })
  else if (sort === 'revenue_desc') query = query.order('annual_revenue_cents', { ascending: false }).order('id', { ascending: false })
  else query = query.order('view_count', { ascending: false }).order('id', { ascending: false })
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
