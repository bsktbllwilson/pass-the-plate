import Image from 'next/image'
import type { Metadata } from 'next'
import SiteHeader from '@/components/sections/SiteHeader'
import SiteFooter from '@/components/sections/SiteFooter'
import BuySellSplit from '@/components/sections/BuySellSplit'
import ValueProps from '@/components/marketing/ValueProps'
import MarketplaceSearchBar from '@/components/marketing/MarketplaceSearchBar'
import ListingsMap from '@/components/marketplace/ListingsMap'
import AnimatedStat from '@/components/marketing/AnimatedStat'
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

const SELL_STATS: { value: string; label: string; from?: number }[] = [
  { value: '$240B+', label: 'Annual revenue of the U.S. Asian F&B sector.' },
  { value: '70%', label: 'Of EB-5 investors and 1st/2nd-gen buyers come from Asian communities. They understand your business.' },
  { value: '30% Lower', label: 'What sellers leave on the table when they sell informally vs. through a structured marketplace.' },
  // Counts down from $2,500 → $0 to dramatize "no upfront fees" vs. typical
  // broker retainers / listing-package costs.
  { value: '$0 Upfront', from: 2500, label: '3–5% success fee only when you close — vs. 10–12% at traditional brokers.' },
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

      {/* Hero photo runs flush to the top of the page; the sticky SiteHeader
          above sits in normal flow, so we pull this section up so the orange
          pill overlays on top of the photo instead of leaving a stripe above
          it. The exact header height drifts with viewport / UserMenu state /
          font loading, so we overshoot by ~24px (-mt-[104px] vs measured
          ~80px) to guarantee no residual gap on any viewport. The hero is
          70vh tall with min-height 600px so the headline still has plenty
          of breathing room after the pull-up. -mt scope is local to /sell. */}
      <section className="relative w-full overflow-hidden -mt-[104px]" style={{ minHeight: '600px', height: '70vh' }}>
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
            <h1 className="font-display text-white font-medium tracking-[-0.01em] mb-6" style={{ fontSize: '2.75rem', lineHeight: '0.95' }}>
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
          <h2 className="font-display font-medium tracking-[-0.01em] mb-4" style={{ fontSize: '2rem' }}>
            Listing Hotspots
          </h2>
          <p className="font-body mb-10" style={{ fontSize: '1.125rem', color: 'rgba(0,0,0,0.65)', maxWidth: '720px' }}>
            Where buyers are searching today. Click a pin to see the listing.
          </p>
          <MarketplaceSearchBar />

          <div className="mt-10">
            <ListingsMap listings={mapListings} />
          </div>
        </div>
      </section>

      <section className="py-16 px-4" style={{ background: 'var(--color-yellow)' }}>
        <div className="mx-auto grid grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-4" style={{ maxWidth: '1400px' }}>
          {SELL_STATS.map((s) => (
            <div key={s.value} className="text-center px-4">
              <div className="font-display font-medium leading-none tracking-[-0.02em]" style={{ fontSize: 'clamp(2.25rem, 5vw, 3.75rem)' }}>
                <AnimatedStat value={s.value} from={s.from} />
              </div>
              <div className="mt-4" style={{ fontSize: 'clamp(0.95rem, 1.4vw, 1.125rem)', lineHeight: '1.5' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 py-24">
        <div className="mx-auto" style={{ maxWidth: '1280px' }}>
          <h2 className="font-display font-medium tracking-[-0.01em] text-center mb-12" style={{ fontSize: '2rem' }}>
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

      <BuySellSplit />
      <SiteFooter columns={content.footer.columns} />
    </main>
  )
}
