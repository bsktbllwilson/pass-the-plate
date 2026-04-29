import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { content } from '@/lib/content'
import { getListings } from '@/lib/listings'
import SiteHeader from '@/components/sections/SiteHeader'
import SiteFooter from '@/components/sections/SiteFooter'
import BuySellSplit from '@/components/sections/BuySellSplit'
import FindYourNextBigDeal from '@/components/sections/FindYourNextBigDeal'
import SearchBar from './SearchBar'
import FilterBar from './FilterBar'

export const metadata: Metadata = {
  title: 'Buy A Business — Pass The Plate',
  description: 'Browse vetted Asian F&B businesses for sale. Filter by industry, location, and financials.',
}

function formatCuisine(cuisine: string): string {
  if (cuisine === 'pan_asian') return 'Pan-Asian'
  return cuisine.charAt(0).toUpperCase() + cuisine.slice(1)
}

function formatLocation(location: string): string {
  return location.replace(/,\s*NY\s*$/i, '')
}

const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
const fmtUSD = (cents: number) => usd.format(Math.round(cents / 100))

const PRICE_BAND_RANGES: Record<string, { minPrice?: number; maxPrice?: number }> = {
  under_500k: { maxPrice: 500_000_00 },
  '500k_1m': { minPrice: 500_000_00, maxPrice: 1_000_000_00 },
  '1m_2m': { minPrice: 1_000_000_00, maxPrice: 2_000_000_00 },
  '2m_plus': { minPrice: 2_000_000_00 },
}
const REVENUE_BAND_RANGES: Record<string, { minRevenue?: number; maxRevenue?: number }> = {
  under_500k: { maxRevenue: 500_000_00 },
  '500k_1m': { minRevenue: 500_000_00, maxRevenue: 1_000_000_00 },
  '1m_2m': { minRevenue: 1_000_000_00, maxRevenue: 2_000_000_00 },
  '2m_plus': { minRevenue: 2_000_000_00 },
}

function csv(v: string | string[] | undefined): string[] {
  if (!v) return []
  const raw = Array.isArray(v) ? v : [v]
  return raw.flatMap(s => s.split(',')).map(s => s.trim()).filter(Boolean)
}

function first(v: string | string[] | undefined): string | undefined {
  if (!v) return undefined
  return Array.isArray(v) ? v[0] : v
}

type SP = { [key: string]: string | string[] | undefined }

export default async function BuyPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams

  const q = first(sp.q)
  const industry = csv(sp.industry)
  const location = csv(sp.location)
  const assets = csv(sp.assets)
  const priceBand = first(sp.price)
  const revenueBand = first(sp.revenue)
  const page = Math.max(1, Number.parseInt(first(sp.page) ?? '1', 10) || 1)

  const priceRange = priceBand ? PRICE_BAND_RANGES[priceBand] ?? {} : {}
  const revenueRange = revenueBand ? REVENUE_BAND_RANGES[revenueBand] ?? {} : {}

  const { rows, totalCount, totalPages } = await getListings({
    q,
    industry: industry.length ? industry : undefined,
    location: location.length ? location : undefined,
    assets: assets.length ? assets : undefined,
    minPrice: priceRange.minPrice,
    maxPrice: priceRange.maxPrice,
    minRevenue: revenueRange.minRevenue,
    maxRevenue: revenueRange.maxRevenue,
    page,
    perPage: 12,
  })

  const baseQS = new URLSearchParams()
  for (const [k, v] of Object.entries(sp)) {
    if (k === 'page') continue
    if (Array.isArray(v)) baseQS.set(k, v.join(','))
    else if (v) baseQS.set(k, v)
  }
  const pageHref = (n: number) => {
    const next = new URLSearchParams(baseQS.toString())
    if (n > 1) next.set('page', String(n))
    return `/buy${next.toString() ? '?' + next.toString() : ''}`
  }

  return (
    <main style={{ background: 'var(--color-cream)' }}>
      <SiteHeader />

      <section className="px-4 pt-12 pb-6">
        <div className="mx-auto" style={{ maxWidth: '1540px' }}>
          <h1 className="font-display font-medium tracking-[-0.01em] text-center mb-2" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: '1.05' }}>
            Find Your Next <em style={{ fontStyle: 'italic' }}>Business</em>
          </h1>
          <p className="text-center mb-10 mx-auto" style={{ fontSize: '1.125rem', color: 'rgba(0,0,0,0.65)', maxWidth: '600px' }}>
            {totalCount} {totalCount === 1 ? 'listing' : 'listings'} matching your search
          </p>
          <SearchBar />
          <div className="mt-6">
            <FilterBar />
          </div>
        </div>
      </section>

      <section className="px-4 pb-16">
        <div className="mx-auto" style={{ maxWidth: '1540px' }}>
          {rows.length === 0 ? (
            <div className="font-body rounded-2xl bg-white border border-black/10 p-12 text-center">
              <p className="text-xl mb-2">No listings match those filters.</p>
              <p className="text-black/60">Try removing a filter or searching with broader keywords.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rows.map(listing => (
                <article key={listing.id} className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col">
                  <Link href={`/buy/${listing.slug}`} className="block relative aspect-[16/10] bg-black/5">
                    {listing.cover_image_url && (
                      <Image
                        src={listing.cover_image_url}
                        alt={listing.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover"
                      />
                    )}
                  </Link>
                  <div className="p-6 flex flex-col flex-1">
                    <h2 className="font-display font-medium tracking-[-0.01em] mb-2" style={{ fontSize: '1.5rem', lineHeight: '1.15' }}>
                      <Link href={`/buy/${listing.slug}`} className="hover:opacity-80 transition-opacity">{listing.title}</Link>
                    </h2>
                    <div className="font-body text-sm text-black/55 mb-4">
                      {formatLocation(listing.location)} &nbsp;|&nbsp; {formatCuisine(listing.cuisine)}
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-black/10">
                      <div>
                        <div className="font-body text-xs uppercase tracking-wide text-black/50 mb-1">Asking Price</div>
                        <div className="font-display font-medium" style={{ fontSize: '1.25rem' }}>{fmtUSD(listing.asking_price_cents)}</div>
                      </div>
                      <div>
                        <div className="font-body text-xs uppercase tracking-wide text-black/50 mb-1">Annual Revenue</div>
                        <div className="font-display font-medium" style={{ fontSize: '1.25rem' }}>{fmtUSD(listing.annual_revenue_cents)}</div>
                      </div>
                    </div>
                    <p className="text-black/70 mb-6 flex-1" style={{ fontSize: '0.95rem', lineHeight: '1.55', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {listing.description.replace(/\n+/g, ' ')}
                    </p>
                    <Link
                      href={`/buy/${listing.slug}`}
                      className="block text-center w-full py-3 rounded-full text-white font-medium hover:opacity-90 transition-opacity"
                      style={{ background: 'var(--color-brand)', fontSize: '1rem' }}
                    >
                      View Listing →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <nav className="font-body mt-12 flex items-center justify-between">
              {page > 1 ? (
                <Link href={pageHref(page - 1)} className="font-medium hover:opacity-70">← Previous Page</Link>
              ) : <span className="text-black/30">← Previous Page</span>}
              <span className="text-black/55">Page {page} of {totalPages}</span>
              {page < totalPages ? (
                <Link href={pageHref(page + 1)} className="font-medium hover:opacity-70">Next Page →</Link>
              ) : <span className="text-black/30">Next Page →</span>}
            </nav>
          )}
        </div>
      </section>

      <FindYourNextBigDeal />
      <BuySellSplit />
      <SiteFooter columns={content.footer.columns} />
    </main>
  )
}
