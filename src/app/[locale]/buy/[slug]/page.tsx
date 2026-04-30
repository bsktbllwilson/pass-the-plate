import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { content } from '@/lib/content'
import { getListingBySlug, type Listing } from '@/lib/listings'
import SiteHeader from '@/components/sections/SiteHeader'
import SiteFooter from '@/components/sections/SiteFooter'
import BuySellSplit from '@/components/sections/BuySellSplit'
import FindYourNextBigDeal from '@/components/sections/FindYourNextBigDeal'
import Gallery from './Gallery'
import InquiryForm from './InquiryForm'

function formatCuisine(cuisine: string): string {
  if (cuisine === 'pan_asian') return 'Pan-Asian'
  return cuisine.charAt(0).toUpperCase() + cuisine.slice(1)
}

function formatIndustry(industry: string): string {
  return industry.charAt(0).toUpperCase() + industry.slice(1)
}

function formatLocation(location: string): string {
  return location.replace(/,\s*NY\s*$/i, '')
}

function listingAssets(assets: Listing['assets']): string[] {
  if (!Array.isArray(assets)) return []
  return assets.filter((a): a is string => typeof a === 'string')
}

const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
const fmtUSD = (cents: number) => usd.format(Math.round(cents / 100))

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const listing = await getListingBySlug(slug)
  if (!listing) {
    return {
      title: 'Listing Not Found — Pass The Plate',
      robots: { index: false, follow: false },
    }
  }
  const description = listing.description.split('\n')[0]
  const url = `/buy/${listing.slug}`
  const images = listing.cover_image_url ? [{ url: listing.cover_image_url, alt: listing.title }] : undefined
  return {
    title: `${listing.title} — Pass The Plate`,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title: listing.title,
      description,
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title: listing.title,
      description,
      images: listing.cover_image_url ? [listing.cover_image_url] : undefined,
    },
  }
}

export default async function ListingDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const listing = await getListingBySlug(slug)
  if (!listing) notFound()

  const [firstPara, ...restParas] = listing.description.split(/\n\n+/)
  const aboutBody = restParas.join('\n\n')
  const assets = listingAssets(listing.assets)

  return (
    <main style={{ background: 'var(--color-cream)' }}>
      <SiteHeader />

      <section className="px-4 pt-10 pb-12">
        <div className="mx-auto" style={{ maxWidth: '1280px' }}>
          <Gallery cover={listing.cover_image_url ?? ''} gallery={listing.gallery_urls} alt={listing.title} />
        </div>
      </section>

      <section className="px-4 pb-20">
        <div className="mx-auto grid grid-cols-1 lg:grid-cols-12 lg:gap-12" style={{ maxWidth: '1280px' }}>
          <div className="lg:col-span-8">
            <h1 className="font-display font-medium tracking-[-0.01em] mb-4" style={{ fontSize: '3.875rem', lineHeight: '1.05' }}>
              {listing.title}
            </h1>
            <div className="font-body inline-block px-4 py-2 rounded-full bg-white border border-black/10 text-sm mb-8">
              {formatLocation(listing.location)} &nbsp;|&nbsp; {formatCuisine(listing.cuisine)}
            </div>

            <p className="mb-10 whitespace-pre-line" style={{ fontSize: '1.0625rem', lineHeight: '1.7', color: 'rgba(0,0,0,0.78)' }}>
              {firstPara}
            </p>

            {aboutBody && (
              <section className="mb-12">
                <h2 className="font-display font-medium mb-4" style={{ fontSize: '2.1875rem', lineHeight: '1.2' }}>
                  About this business
                </h2>
                <p className="whitespace-pre-line" style={{ fontSize: '1.0625rem', lineHeight: '1.7', color: 'rgba(0,0,0,0.78)' }}>
                  {aboutBody}
                </p>
              </section>
            )}

            {assets.length > 0 && (
              <section className="mb-12">
                <h2 className="font-display font-medium mb-4" style={{ fontSize: '2.1875rem', lineHeight: '1.2' }}>
                  What&apos;s included
                </h2>
                <ul className="space-y-2">
                  {assets.map(a => (
                    <li key={a} className="flex items-start gap-3" style={{ fontSize: '1rem' }}>
                      <span className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--color-brand)' }} />
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section>
              <h2 className="font-display font-medium mb-4" style={{ fontSize: '2.1875rem', lineHeight: '1.2' }}>
                Quick stats
              </h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-2xl bg-white border border-black/10 p-5">
                  <div className="font-body text-xs uppercase tracking-wide text-black/55 mb-1">Year Established</div>
                  <div className="font-display font-medium" style={{ fontSize: '1.5rem' }}>{listing.year_established ?? '—'}</div>
                </div>
                <div className="rounded-2xl bg-white border border-black/10 p-5">
                  <div className="font-body text-xs uppercase tracking-wide text-black/55 mb-1">Staff</div>
                  <div className="font-display font-medium" style={{ fontSize: '1.5rem' }}>{listing.staff_count ?? '—'}</div>
                </div>
                <div className="rounded-2xl bg-white border border-black/10 p-5">
                  <div className="font-body text-xs uppercase tracking-wide text-black/55 mb-1">Square Footage</div>
                  <div className="font-display font-medium" style={{ fontSize: '1.5rem' }}>{listing.square_footage != null ? listing.square_footage.toLocaleString('en-US') : '—'}</div>
                </div>
              </div>
            </section>
          </div>

          <aside className="lg:col-span-4 mt-10 lg:mt-0">
            <div className="lg:sticky lg:top-24 space-y-4">
              <div className="rounded-2xl bg-white border border-black/10 p-6">
                <div className="mb-4">
                  <div className="font-body text-xs uppercase tracking-wide text-black/55 mb-1">Asking Price</div>
                  <div className="font-display font-medium" style={{ fontSize: '2.25rem', lineHeight: '1.1' }}>{fmtUSD(listing.asking_price_cents)}</div>
                </div>
                <div className="mb-4 pb-4 border-b border-black/10">
                  <div className="font-body text-xs uppercase tracking-wide text-black/55 mb-1">Annual Revenue</div>
                  <div className="font-display font-medium" style={{ fontSize: '1.5rem' }}>{fmtUSD(listing.annual_revenue_cents)}</div>
                </div>
                {listing.annual_profit_cents != null && (
                  <div className="mb-5">
                    <div className="font-body text-xs uppercase tracking-wide text-black/55 mb-1">Annual Profit</div>
                    <div className="font-display font-medium" style={{ fontSize: '1.5rem' }}>{fmtUSD(listing.annual_profit_cents)}</div>
                  </div>
                )}
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="px-3 py-1 rounded-full text-sm" style={{ background: 'var(--color-yellow)' }}>{formatCuisine(listing.cuisine)}</span>
                  <span className="font-body px-3 py-1 rounded-full text-sm border border-black/10">{formatIndustry(listing.industry)}</span>
                </div>
              </div>

              <InquiryForm listingId={listing.id} listingTitle={listing.title} />

              {listing.updated_at && (
                <p className="font-body text-xs text-black/45 px-2">
                  Last updated {new Date(listing.updated_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              )}
            </div>
          </aside>
        </div>
      </section>

      <FindYourNextBigDeal />
      <BuySellSplit />
      <SiteFooter />
    </main>
  )
}
