import { LISTINGS, type Listing } from '@/data/listings'

export type { Listing }

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

export async function getListings(opts: GetListingsOpts = {}): Promise<{ rows: Listing[]; totalCount: number; totalPages: number }> {
  const { q, industry, cuisine, location, assets, minPrice, maxPrice, minRevenue, maxRevenue, page = 1, perPage = 12 } = opts

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

  const industries = toArray(industry)
  if (industries.length) rows = rows.filter(l => industries.includes(l.industry))

  const cuisines = toArray(cuisine)
  if (cuisines.length) rows = rows.filter(l => cuisines.includes(l.cuisine))

  const locations = toArray(location).map(s => s.toLowerCase())
  if (locations.length) {
    rows = rows.filter(l => {
      const hay = `${l.city} ${l.state} ${l.neighborhood}`.toLowerCase()
      return locations.some(loc => hay.includes(loc))
    })
  }

  const assetNeedles = toArray(assets).map(s => s.toLowerCase())
  if (assetNeedles.length) {
    rows = rows.filter(l =>
      assetNeedles.every(needle => l.assets.some(a => a.toLowerCase().includes(needle))),
    )
  }

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
