import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import SiteHeader from '@/components/sections/SiteHeader'
import SiteFooter from '@/components/sections/SiteFooter'
import BuySellSplit from '@/components/sections/BuySellSplit'
import FindYourNextBigDeal from '@/components/sections/FindYourNextBigDeal'
import ValueProps from '@/components/marketing/ValueProps'
import HeroSearch from '@/components/marketing/HeroSearch'
import { content } from '@/lib/content'
import { TESTIMONIALS, type Testimonial } from '@/data/testimonials'

export const metadata: Metadata = {
  title: 'Sell A Business — Pass The Plate',
  description: 'List your Asian F&B business on Pass The Plate. Bilingual support, vetted buyers, and zero upfront fees.',
}

const SELL_STATS: { value: string; label: string }[] = [
  { value: '$0 Upfront', label: 'We charge zero to list. 3–5% success fee only when you close.' },
  { value: '10 Minutes', label: 'List from your phone in Chinese, Korean, Japanese, or Vietnamese.' },
  { value: '120+ Partners', label: 'SBA lenders, bilingual brokers, and immigration attorneys.' },
  { value: 'Verified Buyers', label: 'Every buyer must show proof of funds before seeing your contact.' },
]

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function SellPage() {
  const featured: Testimonial[] = shuffle(TESTIMONIALS).slice(0, 2)

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
            <h1 className="text-white font-medium tracking-[-0.01em] mb-6" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem, 7vw, 5rem)', lineHeight: '0.95' }}>
              Pass the Plate to<br />The Right Hands
            </h1>
            <p className="text-white/90 mb-10" style={{ fontFamily: 'var(--font-body)', fontSize: '1.125rem', lineHeight: '1.55', maxWidth: '500px' }}>
              List your Asian F&amp;B Business in 10 Minutes. We charge $0 upfront, we only win when you win.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/contact?intent=sell"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-full text-white font-medium hover:opacity-90 transition-opacity"
                style={{ background: 'var(--color-brand)', fontFamily: 'var(--font-body)', fontSize: '1.0625rem' }}
              >
                List My Business →
              </Link>
              <Link
                href="/contact?intent=valuation"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-full text-white font-medium border-2 border-white hover:bg-white hover:text-black transition-colors"
                style={{ fontFamily: 'var(--font-body)', fontSize: '1.0625rem' }}
              >
                Get Free Valuation →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-24">
        <ValueProps heading="How It Works" plates={content.platesAreFull} />
      </section>

      <section className="px-4 py-24" style={{ background: 'var(--color-yellow)' }}>
        <div className="mx-auto" style={{ maxWidth: '1540px' }}>
          <h2 className="font-medium tracking-[-0.01em] mb-10" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3.375rem)' }}>
            Listing Hotspots
          </h2>
          <HeroSearch />
          <div className="mt-10 rounded-2xl flex items-center justify-center" style={{ height: '600px', background: 'rgba(0,0,0,0.08)', border: '1px dashed rgba(0,0,0,0.2)' }}>
            <span className="font-medium text-black/55" style={{ fontFamily: 'var(--font-body)', fontSize: '1.125rem' }}>
              Interactive map coming soon
            </span>
          </div>
        </div>
      </section>

      <section className="py-16 px-4" style={{ background: 'var(--color-yellow)' }}>
        <div className="mx-auto grid grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-4" style={{ maxWidth: '1400px' }}>
          {SELL_STATS.map((s) => (
            <div key={s.value} className="text-center px-4">
              <div className="font-medium leading-none tracking-[-0.02em]" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.25rem, 5vw, 3.75rem)' }}>{s.value}</div>
              <div className="mt-4" style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(0.95rem, 1.4vw, 1.125rem)', lineHeight: '1.5' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 py-24">
        <div className="mx-auto" style={{ maxWidth: '1280px' }}>
          <h2 className="font-medium tracking-[-0.01em] text-center mb-12" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3.375rem)' }}>
            Trusted by 100+ Sellers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featured.map((t) => (
              <article key={t.id} className="rounded-2xl bg-white border border-black/10 p-8 flex flex-col">
                <p className="font-medium mb-6 flex-1" style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '1.5rem', lineHeight: '1.35' }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div>
                  <div className="font-medium" style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem' }}>{t.name}</div>
                  <div className="text-black/55 mt-1" style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem' }}>{t.role} · {t.city}</div>
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
