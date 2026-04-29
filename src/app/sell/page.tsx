import Image from 'next/image'
import type { Metadata } from 'next'
import SiteHeader from '@/components/sections/SiteHeader'
import SiteFooter from '@/components/sections/SiteFooter'
import BuySellSplit from '@/components/sections/BuySellSplit'
import FindYourNextBigDeal from '@/components/sections/FindYourNextBigDeal'
import ValueProps from '@/components/marketing/ValueProps'
import HeroSearch from '@/components/marketing/HeroSearch'
import ListingsMap from '@/components/marketplace/ListingsMap'
import { LinkButton } from '@/components/ui'
import { content } from '@/lib/content'
import { getListingsForMap } from '@/lib/listings'
import { TESTIMONIALS } from '@/data/testimonials'

export const metadata: Metadata = {
  title: 'Sell A Business — Pass The Plate',
  description: 'List your Asian F&B business on Pass The Plate. Bilingual support, vetted buyers, and zero upfront fees.',
}

// ISR: re-render at most every 5 minutes. The map's listing pins only
// need to be fresh-ish; this keeps /sell on the static path while still
// picking up new listings as they get approved.
export const revalidate = 300

const SELL_STATS: { value: string; label: string }[] = [
  { value: '$0 Upfront', label: 'We charge zero to list. 3–5% success fee only when you close.' },
  { value: '10 Minutes', label: 'List from your phone in Chinese, Korean, Japanese, or Vietnamese.' },
  { value: '120+ Partners', label: 'SBA lenders, bilingual brokers, and immigration attorneys.' },
  { value: 'Verified Buyers', label: 'Every buyer must show proof of funds before seeing your contact.' },
]

export default async function SellPage() {
  // Deterministic pick — Math.random() in a server component bakes a single
  // pair into the static cache, so the "rotation" never actually rotated.
  // Reorder TESTIMONIALS to change which two surface on this page.
  const featured = TESTIMONIALS.slice(0, 2)
  const mapListings = await getListingsForMap()

  return (
    <main style={{ background: 'var(--color-cream)' }}>
      <SiteHeader />

      <section className="relative w-full overflow-hidden" style={{ minHeight: '600px', height: '70vh' }}>
        <Image
          src="/images/brand/chef.JPG"
          alt="Chef at work"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.45) 30%, rgba(0,0,0,0) 50%)' }} />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-2xl pl-12 lg:pl-24 pr-6">
            <h1 className="font-display text-white font-medium tracking-[-0.01em] mb-6" style={{ fontSize: 'clamp(3rem, 7vw, 5rem)', lineHeight: '0.95' }}>
              Pass the Plate to<br />The Right Hands
            </h1>
            <p className="text-white/90 mb-10" style={{ fontSize: '1.125rem', lineHeight: '1.55', maxWidth: '500px' }}>
              List your Asian F&amp;B Business in 10 Minutes. We charge $0 upfront, we only win when you win.
            </p>
            <div className="flex flex-wrap gap-4">
              <LinkButton href="/sell/new" size="lg">
                List My Business →
              </LinkButton>
              <LinkButton
                href="/contact?intent=valuation"
                size="lg"
                className="border-2 border-white hover:bg-white hover:text-black transition-colors hover:opacity-100"
                style={{ background: 'transparent', color: '#fff' }}
              >
                Get Free Valuation →
              </LinkButton>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-24">
        <ValueProps heading="How It Works" plates={content.platesAreFull} />
      </section>

      <section className="px-4 py-24" style={{ background: 'var(--color-yellow)' }}>
        <div className="mx-auto" style={{ maxWidth: '1540px' }}>
          <h2 className="font-display font-medium tracking-[-0.01em] mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3.375rem)' }}>
            Listing Hotspots
          </h2>
          <p className="font-body mb-10" style={{ fontSize: '1.125rem', color: 'rgba(0,0,0,0.65)', maxWidth: '720px' }}>
            Where buyers are searching today. Click a pin to see the listing.
          </p>
          <HeroSearch />

          <div className="mt-10">
            <ListingsMap listings={mapListings} />
          </div>
        </div>
      </section>

      <section className="py-16 px-4" style={{ background: 'var(--color-yellow)' }}>
        <div className="mx-auto grid grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-4" style={{ maxWidth: '1400px' }}>
          {SELL_STATS.map((s) => (
            <div key={s.value} className="text-center px-4">
              <div className="font-display font-medium leading-none tracking-[-0.02em]" style={{ fontSize: 'clamp(2.25rem, 5vw, 3.75rem)' }}>{s.value}</div>
              <div className="mt-4" style={{ fontSize: 'clamp(0.95rem, 1.4vw, 1.125rem)', lineHeight: '1.5' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 py-24">
        <div className="mx-auto" style={{ maxWidth: '1280px' }}>
          <h2 className="font-display font-medium tracking-[-0.01em] text-center mb-12" style={{ fontSize: 'clamp(2rem, 4vw, 3.375rem)' }}>
            Trusted by 100+ Sellers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featured.map((t) => (
              <article key={t.id} className="rounded-2xl bg-white border border-black/10 p-8 flex flex-col">
                <p className="font-display font-medium mb-6 flex-1" style={{ fontStyle: 'italic', fontSize: '1.5rem', lineHeight: '1.35' }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div>
                  <div className="font-display font-medium" style={{ fontSize: '1.25rem' }}>{t.name}</div>
                  <div className="text-black/55 mt-1" style={{ fontSize: '0.875rem' }}>{t.role} · {t.city}</div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <FindYourNextBigDeal />
      <BuySellSplit />
      <SiteFooter columns={content.footer.columns} />
    </main>
  )
}
