import { LISTINGS, type Listing } from '@/data/listings'

export type { Listing }

type GetListingsOpts = {
  q?: string
  industry?: string
  cuisine?: string
  minPrice?: number
  maxPrice?: number
  minRevenue?: number
  maxRevenue?: number
  page?: number
  perPage?: number
}

export async function getListings(opts: GetListingsOpts = {}): Promise<{ rows: Listing[]; totalCount: number; totalPages: number }> {
  const { q, industry, cuisine, minPrice, maxPrice, minRevenue, maxRevenue, page = 1, perPage = 12 } = opts

  let rows = LISTINGS.slice()

  if (q) {
    const needle = q.trim().toLowerCase()
    rows = rows.filter(l =>
      l.title.toLowerCase().includes(needle) ||
      l.city.toLowerCase().includes(needle) ||
      l.neighborhood.toLowerCase().includes(needle) ||
      l.description.toLowerCase().includes(needle),
    )
  }
  if (industry) rows = rows.filter(l => l.industry === industry)
  if (cuisine) rows = rows.filter(l => l.cuisine === cuisine)
  if (typeof minPrice === 'number') rows = rows.filter(l => l.asking_price_cents >= minPrice)
  if (typeof maxPrice === 'number') rows = rows.filter(l => l.asking_price_cents <= maxPrice)
  if (typeof minRevenue === 'number') rows = rows.filter(l => l.annual_revenue_cents >= minRevenue)
  if (typeof maxRevenue === 'number') rows = rows.filter(l => l.annual_revenue_cents <= maxRevenue)

  const totalCount = rows.length
  const totalPages = Math.max(1, Math.ceil(totalCount / perPage))
  const start = (page - 1) * perPage
  const paged = rows.slice(start, start + perPage)

  return { rows: paged, totalCount, totalPages }
}

export async function getListingById(id: string): Promise<Listing | null> {
  return LISTINGS.find(l => l.id === id) ?? null
}

export async function getTrendingListings(limit: number): Promise<Listing[]> {
  return LISTINGS.slice().sort((a, b) => b.view_count - a.view_count).slice(0, limit)
}
