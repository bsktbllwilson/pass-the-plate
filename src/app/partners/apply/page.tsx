import type { Metadata } from 'next'
import { content } from '@/lib/content'
import SiteHeader from '@/components/sections/SiteHeader'
import SiteFooter from '@/components/sections/SiteFooter'
import BuySellSplit from '@/components/sections/BuySellSplit'
import FindYourNextBigDeal from '@/components/sections/FindYourNextBigDeal'
import PartnerApplyForm from './PartnerApplyForm'

export const metadata: Metadata = {
  title: 'Apply to be a Partner — Pass The Plate',
  description:
    'Apply to join the Pass The Plate partner directory. SBA lenders, immigration attorneys, bilingual brokers, CPAs, and business advisors who serve the Asian F&B community.',
  alternates: { canonical: '/partners/apply' },
  openGraph: {
    type: 'website',
    url: '/partners/apply',
    title: 'Apply to be a Partner — Pass The Plate',
    description:
      'Apply to join the Pass The Plate partner directory. SBA lenders, immigration attorneys, bilingual brokers, CPAs, and business advisors who serve the Asian F&B community.',
  },
}

const PERKS: { title: string; body: string }[] = [
  {
    title: 'Vetted lead flow',
    body:
      'Buyers must verify proof of funds before contacting partners — no tire-kickers in your inbox.',
  },
  {
    title: 'Bilingual visibility',
    body:
      'Profile fields capture which languages you operate in (Mandarin, Korean, Vietnamese, Cantonese). Buyers filter on language first.',
  },
  {
    title: 'No upfront fee',
    body:
      'Partners pay nothing to be listed. We earn when a deal closes — same alignment as our seller side.',
  },
]

export default function PartnersApplyPage() {
  return (
    <main style={{ background: 'var(--color-cream)' }}>
      <SiteHeader />

      <section className="px-4 py-20 md:py-24 text-center">
        <div className="mx-auto" style={{ maxWidth: '900px' }}>
          <h1
            className="font-display font-medium tracking-[-0.02em] mb-6"
            style={{ fontSize: 'clamp(2.5rem, 7vw, 5rem)', lineHeight: '1' }}
          >
            Become a Partner
          </h1>
          <p
            className="font-body mx-auto"
            style={{
              fontSize: 'clamp(1.0625rem, 2vw, 1.25rem)',
              lineHeight: '1.55',
              color: 'rgba(0,0,0,0.65)',
              maxWidth: '640px',
            }}
          >
            Join the directory of advisors who help immigrant restaurant owners
            buy, sell, and finance their businesses. We&apos;ll review your
            application and follow up within five business days.
          </p>
        </div>
      </section>

      <section className="px-4 pb-12">
        <div
          className="mx-auto grid grid-cols-1 lg:grid-cols-12 lg:gap-10"
          style={{ maxWidth: '1280px' }}
        >
          <div className="lg:col-span-7">
            <PartnerApplyForm />
          </div>

          <aside className="lg:col-span-5 mt-8 lg:mt-0">
            <div className="rounded-2xl bg-white border border-black/10 p-8">
              <h2 className="font-display font-medium mb-6" style={{ fontSize: '1.5rem' }}>
                Why apply
              </h2>
              <dl className="font-body space-y-5">
                {PERKS.map((p) => (
                  <div key={p.title}>
                    <dt
                      className="font-display font-medium mb-1"
                      style={{ fontSize: '1.125rem' }}
                    >
                      {p.title}
                    </dt>
                    <dd style={{ color: 'rgba(0,0,0,0.7)', lineHeight: '1.55' }}>
                      {p.body}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </aside>
        </div>
      </section>

      <FindYourNextBigDeal />
      <BuySellSplit />
      <SiteFooter columns={content.footer.columns} />
    </main>
  )
}
