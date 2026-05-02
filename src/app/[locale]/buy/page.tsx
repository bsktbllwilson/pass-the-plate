import Image from 'next/image'
import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { applyListingLocale, getListings, type ListingsSort } from '@/lib/listings'
import SiteHeader from '@/components/sections/SiteHeader'
import SiteFooter from '@/components/sections/SiteFooter'
import BuySellSplit from '@/components/sections/BuySellSplit'
import FindYourNextBigDeal from '@/components/sections/FindYourNextBigDeal'
import SearchBar from './SearchBar'
import FilterBar from './FilterBar'

type Params = Promise<{ locale: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'buy' })
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  }
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

function Pagination({ page, totalPages, pageHref }: { page: number; totalPages: number; pageHref: (n: number) => string }) {
  const t = useTranslations('common')
  return (
    <nav className="font-body mt-12 flex items-center justify-between">
      {page > 1 ? (
        <Link href={pageHref(page - 1)} className="font-medium hover:opacity-70">← {t('previousPage')}</Link>
      ) : <span className="text-black/30">← {t('previousPage')}</span>}
      <span className="text-black/55">{t('pageOf', { page, total: totalPages })}</span>
      {page < totalPages ? (
        <Link href={pageHref(page + 1)} className="font-medium hover:opacity-70">{t('nextPage')} →</Link>
      ) : <span className="text-black/30">{t('nextPage')} →</span>}
    </nav>
  )
}

function ListingCard({ listing }: { listing: import('@/lib/listings').Listing }) {
  const t = useTranslations('buy.card')
  return (
    <article className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col">
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
        <h2 className="font-display font-medium tracking-[-0.01em] mb-2" style={{ fontSize: '2.1875rem', lineHeight: '1.15' }}>
          <Link href={`/buy/${listing.slug}`} className="hover:opacity-80 transition-opacity">{listing.title}</Link>
        </h2>
        <div className="font-body text-sm text-black/55 mb-4">
          {formatLocation(listing.location)} &nbsp;|&nbsp; {formatCuisine(listing.cuisine)}
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-black/10">
          <div>
            <div className="font-body text-xs uppercase tracking-wide text-black/50 mb-1">{t('askingPrice')}</div>
            <div className="font-display font-medium" style={{ fontSize: '1.25rem' }}>{fmtUSD(listing.asking_price_cents)}</div>
          </div>
          <div>
            <div className="font-body text-xs uppercase tracking-wide text-black/50 mb-1">{t('annualRevenue')}</div>
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
          {t('viewListing')} →
        </Link>
      </div>
    </article>
  )
}

export default async function BuyPage({ params, searchParams }: { params: Params; searchParams: Promise<SP> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const sp = await searchParams
  const t = await getTranslations({ locale, namespace: 'buy' })

  const q = first(sp.q)
  const industry = csv(sp.industry)
  const location = csv(sp.location)
  const assets = csv(sp.assets)
  const priceBand = first(sp.price)
  const revenueBand = first(sp.revenue)
  const page = Math.max(1, Number.parseInt(first(sp.page) ?? '1', 10) || 1)
  const SORT_VALUES = ['newest', 'price_asc', 'revenue_desc'] as const
  const rawSort = first(sp.sort)
  const sort: ListingsSort =
    rawSort && (SORT_VALUES as readonly string[]).includes(rawSort)
      ? (rawSort as ListingsSort)
      : 'trending'

  const priceRange = priceBand ? PRICE_BAND_RANGES[priceBand] ?? {} : {}
  const revenueRange = revenueBand ? REVENUE_BAND_RANGES[revenueBand] ?? {} : {}

  const { rows: rawRows, totalCount, totalPages } = await getListings({
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
    sort,
  })
  // Overlay any cached zh translations for the index. We don't
  // auto-translate at the index level — too many rows to await
  // synchronously. Detail-page visits warm the cache; the index
  // shows English fallback for any listing not yet translated.
  const rows = rawRows.map((r) => applyListingLocale(r, locale))

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

      <section className="px-4 pt-20 md:pt-28 pb-16 md:pb-20">
        <div className="mx-auto text-center" style={{ maxWidth: '1540px' }}>
          <h1 className="font-display font-medium tracking-[-0.01em] mb-6">
            {t('heroH1')}
          </h1>
          <p className="mb-12 mx-auto" style={{ fontSize: '1.25rem', color: 'rgba(0,0,0,0.65)', maxWidth: '600px', fontWeight: 500 }}>
            {t('resultCount', { count: totalCount })}
          </p>
          <SearchBar />
          <div className="mt-10">
            <FilterBar />
          </div>
        </div>
      </section>

      <section className="px-4 pb-20">
        <div className="mx-auto" style={{ maxWidth: '1540px' }}>
          {rows.length === 0 ? (
            <div className="font-body rounded-2xl bg-white border border-black/10 p-12 text-center">
              <p className="text-xl mb-2">{t('noResults')}</p>
              <p className="text-black/60">{t('noResultsHint')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rows.map(listing => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}

          {totalPages > 1 && <Pagination page={page} totalPages={totalPages} pageHref={pageHref} />}
        </div>
      </section>

      <FindYourNextBigDeal />
      <BuySellSplit />
      <SiteFooter />
    </main>
  )
}
