import Image from 'next/image'
import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { useTranslations, useMessages } from 'next-intl'
import SiteHeader from '@/components/sections/SiteHeader'
import SiteFooter from '@/components/sections/SiteFooter'
import BuySellSplit from '@/components/sections/BuySellSplit'
import ValueProps from '@/components/marketing/ValueProps'
import MarketplaceSearchBar from '@/components/marketing/MarketplaceSearchBar'
import ListingsMap from '@/components/marketplace/ListingsMap'
import AnimatedStat from '@/components/marketing/AnimatedStat'
import { LinkButton } from '@/components/ui'
import { getListingsForMap } from '@/lib/listings'
import { TESTIMONIALS } from '@/data/testimonials'

type Params = Promise<{ locale: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'sell' })
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  }
}

// ISR: re-render at most every 5 minutes. The map's listing pins only
// need to be fresh-ish; this keeps /sell on the static path while still
// picking up new listings as they get approved.
export const revalidate = 300

type Stat = { value: string; label: string }

function SellStats() {
  // Stats array is locale-aware. AnimatedStat counts the $0 Upfront stat
  // down from $2,500 — we hard-wire the `from` value here since it's
  // animation behavior, not content.
  const messages = useMessages() as { sell?: { stats?: Stat[] } }
  const stats: Stat[] = messages?.sell?.stats ?? []
  const fromValues: Record<string, number | undefined> = { '$0 Upfront': 2500 }
  return (
    <section className="py-16 px-4" style={{ background: 'var(--color-yellow)' }}>
      <div className="mx-auto grid grid-cols-1 sm:grid-cols-3 gap-y-12 gap-x-4" style={{ maxWidth: '1100px' }}>
        {stats.map((s) => (
          <div key={s.value} className="text-center px-4">
            <div className="font-display font-medium leading-none tracking-[-0.02em]" style={{ fontSize: 'clamp(2.25rem, 5vw, 3.75rem)' }}>
              <AnimatedStat value={s.value} from={fromValues[s.value]} />
            </div>
            <div className="mt-4" style={{ fontSize: 'clamp(0.95rem, 1.4vw, 1.125rem)', lineHeight: '1.5' }}>{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

function SellHero() {
  const t = useTranslations('sell.hero')
  return (
    <section className="relative w-full overflow-hidden md:-mt-[104px]" style={{ minHeight: '600px', height: '70vh' }}>
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
          <h1 className="font-display text-white font-medium tracking-[-0.01em] mb-6">
            {t('headlineLine1')}<br />{t('headlineLine2')}
          </h1>
          <p className="text-white/90 mb-10" style={{ fontSize: '1.125rem', lineHeight: '1.55', maxWidth: '500px' }}>
            {t('subhead')}
          </p>
          <div className="flex flex-wrap gap-4">
            <LinkButton href="/sell/new" size="lg">
              {t('primaryCta')}
            </LinkButton>
            <LinkButton
              href="/contact?intent=valuation"
              size="lg"
              className="border-2 border-white hover:bg-white hover:text-black transition-colors hover:opacity-100"
              style={{ background: 'transparent', color: '#fff' }}
            >
              {t('secondaryCta')}
            </LinkButton>
          </div>
        </div>
      </div>
    </section>
  )
}

function SellHotspotsHeader() {
  const t = useTranslations('sell.hotspots')
  return (
    <>
      <h2 className="font-display font-medium tracking-[-0.01em] mb-4" style={{ fontSize: '2.1875rem' }}>
        {t('heading')}
      </h2>
      <p className="font-body mb-10" style={{ fontSize: '1.125rem', color: 'rgba(0,0,0,0.65)', maxWidth: '720px' }}>
        {t('subhead')}
      </p>
    </>
  )
}

function TestimonialsHeader() {
  const t = useTranslations('sell.testimonials')
  return (
    <h2 className="font-display font-medium tracking-[-0.01em] text-center mb-12" style={{ fontSize: '2.1875rem' }}>
      {t('heading')}
    </h2>
  )
}

export default async function SellPage({ params }: { params: Params }) {
  const { locale } = await params
  setRequestLocale(locale)
  // Deterministic pick — Math.random() in a server component bakes a single
  // pair into the static cache, so the "rotation" never actually rotated.
  // Reorder TESTIMONIALS to change which two surface on this page.
  const featured = TESTIMONIALS.slice(0, 2)
  const mapListings = await getListingsForMap()

  return (
    <main style={{ background: 'var(--color-cream)' }}>
      <SiteHeader />
      <SellHero />

      <section className="pt-24">
        <ValueProps headingKey="sell.valueProps" />
      </section>

      <section className="px-4 py-24" style={{ background: 'var(--color-yellow)' }}>
        <div className="mx-auto" style={{ maxWidth: '1540px' }}>
          <SellHotspotsHeader />
          <MarketplaceSearchBar />
          <div className="mt-10">
            <ListingsMap listings={mapListings} />
          </div>
        </div>
      </section>

      <SellStats />

      <section className="px-4 py-24">
        <div className="mx-auto" style={{ maxWidth: '1280px' }}>
          <TestimonialsHeader />
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
      <SiteFooter />
    </main>
  )
}
