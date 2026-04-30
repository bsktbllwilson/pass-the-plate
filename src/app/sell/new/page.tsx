import type { Metadata } from 'next'
import Link from 'next/link'
import { content } from '@/lib/content'
import { requireUser } from '@/lib/auth'
import SiteHeader from '@/components/sections/SiteHeader'
import SiteFooter from '@/components/sections/SiteFooter'
import SellNewForm from './SellNewForm'

export const metadata: Metadata = {
  title: 'List Your Business — Pass The Plate',
  description: 'Create a draft listing for your Asian F&B business. Our team reviews drafts before they go live.',
  robots: { index: false, follow: false },
}

const TIPS: { title: string; body: string }[] = [
  {
    title: 'Be specific',
    body: 'Strong listings name the cuisine, neighborhood, lease terms, and what equipment is included. Buyers skim — make the first paragraph count.',
  },
  {
    title: 'Numbers buyers can verify',
    body: 'Asking price + last 12 months of revenue and (if comfortable) profit. Anything you hide here gets asked anyway during diligence.',
  },
  {
    title: 'Photos earn the click',
    body: 'A clean cover shot of the dining room or storefront sets expectations. Add interior, kitchen, and patio shots in the gallery.',
  },
]

export default async function SellNewPage() {
  await requireUser('/sell/new')

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
              List your business
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
              Save a draft now — our team reviews drafts before they go live. You
              can edit while it&apos;s still a draft.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-8">
              <SellNewForm />
            </div>

            <aside className="lg:col-span-4 mt-8 lg:mt-0">
              <div className="rounded-2xl bg-white border border-black/10 p-6 space-y-5 sticky top-6">
                <h2 className="font-display font-medium" style={{ fontSize: '2rem' }}>
                  Tips for a strong listing
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
