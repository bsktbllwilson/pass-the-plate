import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { content } from '@/lib/content'
import { requireUser } from '@/lib/auth'
import { getMyInquiries, type InquiryWithListing } from '@/lib/inquiries'
import { getMyListings, type Listing } from '@/lib/listings'
import SiteHeader from '@/components/sections/SiteHeader'
import SiteFooter from '@/components/sections/SiteFooter'
import SignOutButton from '@/components/auth/SignOutButton'
import { LinkButton } from '@/components/ui'

export const metadata: Metadata = {
  title: 'Account — Pass The Plate',
  description: 'Your Pass The Plate account dashboard.',
  robots: { index: false, follow: false },
}

const dateFmt = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
})

const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
const fmtUSD = (cents: number) => usd.format(Math.round(cents / 100))

function formatLocation(location: string | null): string {
  if (!location) return ''
  return location.replace(/,\s*NY\s*$/i, '')
}

function formatCuisine(cuisine: string | null): string {
  if (!cuisine) return ''
  if (cuisine === 'pan_asian') return 'Pan-Asian'
  return cuisine.charAt(0).toUpperCase() + cuisine.slice(1)
}

function InquiryStatusPill({ status }: { status: string | null }) {
  const s = status ?? 'pending'
  const styles: Record<string, { bg: string; fg: string; label: string }> = {
    pending: { bg: 'bg-[var(--color-cream-input)]', fg: 'text-black/70', label: 'Pending' },
    accepted: { bg: 'bg-green-100', fg: 'text-green-800', label: 'Accepted' },
    rejected: { bg: 'bg-red-50', fg: 'text-red-700', label: 'Closed' },
  }
  const style = styles[s] ?? styles.pending!
  return (
    <span
      className={`font-body inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${style.bg} ${style.fg}`}
    >
      {style.label}
    </span>
  )
}

function ListingStatusPill({ status }: { status: string }) {
  const styles: Record<string, { bg: string; fg: string; label: string }> = {
    draft: { bg: 'bg-[var(--color-cream-input)]', fg: 'text-black/70', label: 'Draft' },
    active: { bg: 'bg-green-100', fg: 'text-green-800', label: 'Live' },
    archived: { bg: 'bg-black/5', fg: 'text-black/55', label: 'Archived' },
    sold: { bg: 'bg-[var(--color-yellow)]', fg: 'text-black/85', label: 'Sold' },
  }
  const style = styles[status] ?? styles.draft!
  return (
    <span
      className={`font-body inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${style.bg} ${style.fg}`}
    >
      {style.label}
    </span>
  )
}

function InquiryCard({ inquiry }: { inquiry: InquiryWithListing }) {
  const sent = inquiry.created_at ? dateFmt.format(new Date(inquiry.created_at)) : ''
  const listing = inquiry.listing
  return (
    <article className="rounded-2xl bg-white border border-black/10 p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row gap-5">
        {listing?.cover_image_url && (
          <Link href={`/buy/${listing.slug}`} className="flex-shrink-0 block">
            <div className="relative w-full sm:w-32 h-32 rounded-xl overflow-hidden bg-black/5">
              <Image
                src={listing.cover_image_url}
                alt={listing.title}
                fill
                sizes="(max-width: 640px) 100vw, 128px"
                className="object-cover transition-transform hover:scale-105"
              />
            </div>
          </Link>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="min-w-0">
              {listing ? (
                <Link
                  href={`/buy/${listing.slug}`}
                  className="font-display font-medium text-lg hover:underline block"
                  style={{ lineHeight: '1.25' }}
                >
                  {listing.title}
                </Link>
              ) : (
                <span className="font-display font-medium text-lg text-black/55" style={{ lineHeight: '1.25' }}>
                  Listing no longer available
                </span>
              )}
              {listing && (
                <div className="font-body mt-1 text-sm text-black/55">
                  {formatLocation(listing.location)}
                  {listing.cuisine ? ` · ${formatCuisine(listing.cuisine)}` : ''}
                </div>
              )}
            </div>
            <InquiryStatusPill status={inquiry.status} />
          </div>

          <p
            className="font-body text-sm text-black/70 mb-3 whitespace-pre-line"
            style={{ lineHeight: '1.6' }}
          >
            {inquiry.message ?? ''}
          </p>

          <div className="font-body text-xs text-black/45">
            Sent {sent}
            {inquiry.buyer_name ? ` · as ${inquiry.buyer_name}` : ''}
          </div>
        </div>
      </div>
    </article>
  )
}

function MyListingCard({ listing, justCreated }: { listing: Listing; justCreated: boolean }) {
  const updated = listing.updated_at ? dateFmt.format(new Date(listing.updated_at)) : ''
  return (
    <article className={`rounded-2xl bg-white border ${justCreated ? 'border-[var(--color-brand)]' : 'border-black/10'} p-5 sm:p-6`}>
      <div className="flex flex-col sm:flex-row gap-5">
        {listing.cover_image_url ? (
          <div className="flex-shrink-0 block">
            <div className="relative w-full sm:w-32 h-32 rounded-xl overflow-hidden bg-black/5">
              <Image
                src={listing.cover_image_url}
                alt={listing.title}
                fill
                sizes="(max-width: 640px) 100vw, 128px"
                className="object-cover"
              />
            </div>
          </div>
        ) : (
          <div className="flex-shrink-0 w-full sm:w-32 h-32 rounded-xl border border-dashed border-black/15 bg-[var(--color-cream-input)] flex items-center justify-center">
            <span className="font-body text-xs uppercase tracking-wider text-black/45">No cover</span>
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-1">
            <div className="min-w-0">
              <div className="font-display font-medium text-lg" style={{ lineHeight: '1.25' }}>
                {listing.title}
              </div>
              <div className="font-body mt-1 text-sm text-black/55">
                {formatLocation(listing.location)}
                {listing.cuisine ? ` · ${formatCuisine(listing.cuisine)}` : ''}
              </div>
            </div>
            <ListingStatusPill status={listing.status} />
          </div>

          <div className="font-body text-sm text-black/70 mt-3">
            Asking <span className="font-medium text-black">{fmtUSD(listing.asking_price_cents)}</span>
            {' · '}
            Annual revenue <span className="font-medium text-black">{fmtUSD(listing.annual_revenue_cents)}</span>
          </div>

          <div className="font-body mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            <Link
              href={`/sell/edit/${listing.slug}`}
              className="underline font-medium"
              style={{ color: 'var(--color-brand)' }}
            >
              Edit →
            </Link>
            {listing.status === 'active' && (
              <Link href={`/buy/${listing.slug}`} className="text-black underline font-medium">
                View public page →
              </Link>
            )}
            {listing.status === 'draft' && (
              <span className="text-black/55">
                In review — we&apos;ll publish once an advisor approves.
              </span>
            )}
            <span className="text-xs text-black/45 ml-auto">Updated {updated}</span>
          </div>
        </div>
      </div>
    </article>
  )
}

type SearchParams = Promise<Record<string, string | string[] | undefined>>

export default async function AccountPage({ searchParams }: { searchParams: SearchParams }) {
  const user = await requireUser('/account')
  const [inquiries, listings, params] = await Promise.all([
    getMyInquiries(),
    getMyListings(),
    searchParams,
  ])
  const createdSlug = typeof params.created === 'string' ? params.created : null
  const updatedSlug = typeof params.updated === 'string' ? params.updated : null

  return (
    <main style={{ background: 'var(--color-cream)', minHeight: '100vh' }}>
      <SiteHeader />

      <section className="px-4 py-12 md:py-16">
        <div className="mx-auto w-full max-w-3xl space-y-8">
          {/* Greeting */}
          <div className="font-body bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] px-6 sm:px-8 py-8">
            <h1
              className="font-display font-medium tracking-[-0.01em] mb-2"
              style={{ fontSize: 'clamp(1.875rem, 4vw, 2.5rem)', lineHeight: '1.1' }}
            >
              Welcome back
            </h1>
            <p className="text-black/55 text-sm mb-6">
              Signed in as <span className="text-black font-medium">{user.email}</span>.
            </p>
            <div className="flex flex-wrap gap-3 items-center">
              <SignOutButton />
              <Link href="/" className="text-sm text-black/55 hover:text-black underline">
                Back to home
              </Link>
            </div>
          </div>

          {createdSlug && (
            <div
              className="font-body rounded-2xl px-5 py-4 border"
              style={{
                background: 'var(--color-cream-input)',
                borderColor: 'var(--color-brand)',
                color: 'rgba(0,0,0,0.78)',
              }}
            >
              Draft saved. Our team reviews drafts before they go live —
              you&apos;ll see the status update here.
            </div>
          )}

          {updatedSlug && !createdSlug && (
            <div
              className="font-body rounded-2xl px-5 py-4 border"
              style={{
                background: 'var(--color-cream-input)',
                borderColor: 'var(--color-brand)',
                color: 'rgba(0,0,0,0.78)',
              }}
            >
              Changes saved. Your listing is up to date.
            </div>
          )}

          {/* My listings */}
          <section>
            <div className="flex items-baseline justify-between mb-4 px-2">
              <h2
                className="font-display font-medium tracking-[-0.01em]"
                style={{ fontSize: '1.5rem', lineHeight: '1.2' }}
              >
                My listings
              </h2>
              {listings.length > 0 && (
                <LinkButton href="/sell/new" size="sm">
                  + New listing
                </LinkButton>
              )}
            </div>

            {listings.length === 0 ? (
              <div className="font-body bg-white rounded-2xl border border-dashed border-black/15 px-6 sm:px-8 py-10 text-center">
                <p className="text-black/70 mb-5">
                  You haven&apos;t listed a business yet.
                </p>
                <LinkButton href="/sell/new" size="md">
                  List a business →
                </LinkButton>
              </div>
            ) : (
              <div className="space-y-4">
                {listings.map((l) => (
                  <MyListingCard
                    key={l.id}
                    listing={l}
                    justCreated={createdSlug === l.slug || updatedSlug === l.slug}
                  />
                ))}
              </div>
            )}
          </section>

          {/* My inquiries */}
          <section>
            <div className="flex items-baseline justify-between mb-4 px-2">
              <h2
                className="font-display font-medium tracking-[-0.01em]"
                style={{ fontSize: '1.5rem', lineHeight: '1.2' }}
              >
                My inquiries
              </h2>
              {inquiries.length > 0 && (
                <span className="font-body text-sm text-black/55">
                  {inquiries.length} {inquiries.length === 1 ? 'inquiry' : 'inquiries'}
                </span>
              )}
            </div>

            {inquiries.length === 0 ? (
              <div className="font-body bg-white rounded-2xl border border-dashed border-black/15 px-6 sm:px-8 py-10 text-center">
                <p className="text-black/70 mb-5">
                  You haven&apos;t sent any inquiries yet.
                </p>
                <LinkButton href="/buy" size="md">
                  Browse listings →
                </LinkButton>
              </div>
            ) : (
              <div className="space-y-4">
                {inquiries.map((i) => (
                  <InquiryCard key={i.id} inquiry={i} />
                ))}
              </div>
            )}
          </section>
        </div>
      </section>

      <SiteFooter columns={content.footer.columns} />
    </main>
  )
}
