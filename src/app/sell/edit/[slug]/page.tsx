import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { content } from '@/lib/content'
import { requireUser } from '@/lib/auth'
import { getMyListingBySlug } from '@/lib/listings'
import SiteHeader from '@/components/sections/SiteHeader'
import SiteFooter from '@/components/sections/SiteFooter'
import SellNewForm from '../../new/SellNewForm'

export const metadata: Metadata = {
  title: 'Edit Listing — Pass The Plate',
  description: 'Edit your listing details on Pass The Plate.',
  robots: { index: false, follow: false },
}

const TIPS: { title: string; body: string }[] = [
  {
    title: 'Changes save immediately',
    body: 'Live listings stay live during edits — buyers see the new copy as soon as you save. No re-review.',
  },
  {
    title: 'Refreshing financials helps',
    body: 'Trailing-12-month revenue and profit reassure buyers that the numbers are current.',
  },
  {
    title: 'Photos earn the click',
    body: 'A clean cover shot of the dining room or storefront sets expectations. Replace stale photos as the space evolves.',
  },
]

type Props = { params: Promise<{ slug: string }> }

export default async function SellEditPage({ params }: Props) {
  const { slug } = await params
  // Auth + redirect handled here AND in middleware. The middleware check is
  // belt-and-suspenders — the page-level requireUser is the source of truth.
  await requireUser(`/sell/edit/${slug}`)

  const listing = await getMyListingBySlug(slug)
  if (!listing) notFound()

  return (
    <main style={{ background: 'var(--color-cream)' }}>
      <SiteHeader />

      <section className="px-4 py-16 md:py-20">
        <div className="mx-auto" style={{ maxWidth: '1100px' }}>
          <div className="text-center mb-10">
            <h1
              className="font-display font-medium tracking-[-0.02em] mb-4"
              style={{ fontSize: '2.75rem', lineHeight: '1.05' }}
            >
              Edit listing
            </h1>
            <p
              className="font-body mx-auto"
              style={{
                fontSize: 'clamp(1rem, 1.6vw, 1.125rem)',
                lineHeight: '1.55',
                color: 'rgba(0,0,0,0.65)',
                maxWidth: '640px',
              }}
            >
              Changes save immediately. Your listing remains live during edits.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-8">
              <SellNewForm mode="edit" initialData={listing} />
            </div>

            <aside className="lg:col-span-4 mt-8 lg:mt-0">
              <div className="rounded-2xl bg-white border border-black/10 p-6 space-y-5 sticky top-6">
                <h2 className="font-display font-medium" style={{ fontSize: '2rem' }}>
                  Editing your listing
                </h2>
                <dl className="font-body space-y-4">
                  {TIPS.map((t) => (
                    <div key={t.title}>
                      <dt
                        className="font-display font-medium mb-1"
                        style={{ fontSize: '1rem' }}
                      >
                        {t.title}
                      </dt>
                      <dd className="text-sm" style={{ color: 'rgba(0,0,0,0.7)', lineHeight: '1.5' }}>
                        {t.body}
                      </dd>
                    </div>
                  ))}
                </dl>
                <div className="pt-4 border-t border-black/10">
                  <p className="font-body text-sm text-black/55">
                    Need help?{' '}
                    <Link href="/contact?intent=sell" className="text-black underline font-medium">
                      Talk to an advisor
                    </Link>
                    .
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <SiteFooter columns={content.footer.columns} />
    </main>
  )
}
