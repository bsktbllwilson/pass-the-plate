import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { content } from '@/lib/content'
import { requireUser } from '@/lib/auth'
import { getMyInquiries, type InquiryWithListing } from '@/lib/inquiries'
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

function formatLocation(location: string | null): string {
  if (!location) return ''
  return location.replace(/,\s*NY\s*$/i, '')
}

function formatCuisine(cuisine: string | null): string {
  if (!cuisine) return ''
  if (cuisine === 'pan_asian') return 'Pan-Asian'
  return cuisine.charAt(0).toUpperCase() + cuisine.slice(1)
}

function StatusPill({ status }: { status: string | null }) {
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
            <StatusPill status={inquiry.status} />
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

export default async function AccountPage() {
  const user = await requireUser('/account')
  const inquiries = await getMyInquiries()

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
