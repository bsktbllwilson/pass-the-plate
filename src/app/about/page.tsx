import Image from 'next/image'
import type { Metadata } from 'next'
import { content } from '@/lib/content'
import SiteHeader from '@/components/sections/SiteHeader'
import SiteFooter from '@/components/sections/SiteFooter'
import BuySellSplit from '@/components/sections/BuySellSplit'
import FindYourNextBigDeal from '@/components/sections/FindYourNextBigDeal'
import StatsBand from '@/components/sections/StatsBand'

export const metadata: Metadata = {
  title: 'Who We Are — Pass The Plate',
  description:
    "We're building the marketplace the Asian F&B community deserves — bilingual, transparent, and built around how deals actually get done.",
}

const TIMELINE: { year: string; title: string; body: string }[] = [
  {
    year: '2024',
    title: 'Founded',
    body:
      'Pass The Plate is founded on the conviction that the Asian F&B transition deserves dedicated, bilingual infrastructure. The first version is a paper prototype shopped through Flushing and Sunset Park.',
  },
  {
    year: '2025',
    title: 'First 100 Listings',
    body:
      'We onboard one hundred sellers across New York, Los Angeles, and the Bay Area. Eighty-two close successfully; the median listing-to-LOI window drops from the industry standard 180 days to 71.',
  },
  {
    year: '2026',
    title: 'Chowbus Partnership',
    body:
      'We sign a strategic partnership with Chowbus to surface qualified listings to their twenty-thousand-restaurant operator network. Cross-platform pre-qualification cuts buyer screening time in half.',
  },
  {
    year: '2026',
    title: 'Expanded to Los Angeles',
    body:
      "We open our second metro with a dedicated bilingual team in San Gabriel Valley. The first LA quarter delivers thirty-eight listings and four closings before the team's first review cycle.",
  },
]

const TEAM: { name: string; role: string; bio: string }[] = [
  {
    name: 'Mathiew Wilson',
    role: 'Founder',
    bio:
      "Former operator turned marketplace builder. Mathiew grew up watching his family navigate restaurant ownership without the tools or networks they needed — Pass The Plate is the platform he wishes had existed twenty years ago.",
  },
  {
    name: 'Jenny Liu',
    role: 'Head of Marketplace',
    bio:
      "Twelve years at SBA and First Citizens Bank originating $400M+ in F&B acquisitions. Jenny leads listing intake, advisor partnerships, and the success-fee economics that keep Pass The Plate aligned with sellers.",
  },
  {
    name: 'Dr. Helen Park',
    role: 'Senior Advisor, Immigration & Capital',
    bio:
      'Former immigration partner at Curtis Mallet-Prevost in New York and Seoul. Helen advises on visa pathway design, capital structuring, and cross-border closings across the EB-5, E-2, and L-1A programs.',
  },
]

const PRESS = ['World Journal', 'Korea Times', 'The Real Deal', 'Eater NY', 'TechCrunch']

export default function AboutPage() {
  return (
    <main style={{ background: 'var(--color-cream)' }}>
      <SiteHeader />

      <section className="px-4 py-24 text-center">
        <div className="mx-auto" style={{ maxWidth: '900px' }}>
          <h1 className="font-medium tracking-[-0.02em] mb-6" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem, 8vw, 6rem)', lineHeight: '1' }}>
            Who We Are
          </h1>
          <p className="mx-auto" style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(1.125rem, 2vw, 1.375rem)', lineHeight: '1.55', color: 'rgba(0,0,0,0.65)', maxWidth: '640px' }}>
            We&apos;re building the marketplace the Asian F&amp;B community deserves — bilingual, transparent, and built around how deals actually get done in our communities.
          </p>
        </div>
      </section>

      <section className="px-4 py-24">
        <div className="mx-auto grid grid-cols-1 lg:grid-cols-12 lg:gap-16 items-center" style={{ maxWidth: '1280px' }}>
          <div className="lg:col-span-7">
            <h2 className="font-medium tracking-[-0.01em] mb-8" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 2.875rem)', lineHeight: '1.1' }}>
              Our Mission
            </h2>
            <div className="space-y-6" style={{ fontFamily: 'var(--font-body)', fontSize: '1.0625rem', lineHeight: '1.7', color: 'rgba(0,0,0,0.78)' }}>
              <p>
                There is roughly $240 billion of Asian F&amp;B value changing hands as a generation of operators retires — and the existing tools are built for a different industry. BizBuySell and the generic marketplace listings don&apos;t speak the languages our owners do, don&apos;t read the books they keep, and don&apos;t connect them to the buyers who already trust their networks.
              </p>
              <p>
                Most Asian F&amp;B businesses still change hands through WeChat groups, KakaoTalk threads, temple bulletin boards, and word-of-mouth between bilingual brokers. The networks are real, deep, and effective — they&apos;re just fragmented and largely invisible to the next generation of buyers, the lenders who would underwrite them, and the immigration counsel who would route capital to them.
              </p>
              <p>
                Pass The Plate is the first marketplace built around how the community actually operates. Bilingual listings from any device, success-fee-only pricing, vetted buyers who clear proof of funds before they see a contact, and a curated network of SBA lenders, immigration attorneys, and bilingual brokers — all in one place. We charge nothing upfront. We win when sellers win.
              </p>
            </div>
          </div>
          <div className="lg:col-span-5 mt-12 lg:mt-0">
            <div className="relative mx-auto" style={{ maxWidth: '380px', height: '560px' }}>
              <div className="absolute left-0 top-0 rounded-2xl overflow-hidden border-8 border-white shadow-xl" style={{ width: '280px', height: '360px', transform: 'rotate(-3deg)' }}>
                <Image src="/images/brand/dessert.JPG" alt="Dessert" fill sizes="280px" className="object-cover" />
              </div>
              <div className="absolute right-0 top-32 rounded-2xl overflow-hidden border-8 border-white shadow-xl" style={{ width: '280px', height: '360px', transform: 'rotate(2deg)' }}>
                <Image src="/images/brand/girsl.JPG" alt="Owners" fill sizes="280px" className="object-cover" />
              </div>
              <div className="absolute left-4 top-64 rounded-2xl overflow-hidden border-8 border-white shadow-xl" style={{ width: '280px', height: '360px', transform: 'rotate(-1deg)' }}>
                <Image src="/images/brand/IMG_2672.JPG" alt="Family table" fill sizes="280px" className="object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <StatsBand stats={content.stats} />

      <section className="px-4 py-24">
        <div className="mx-auto" style={{ maxWidth: '900px' }}>
          <h2 className="font-medium tracking-[-0.01em] mb-12 text-center" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3.375rem)' }}>
            Our Story
          </h2>
          <div className="space-y-12">
            {TIMELINE.map((m, i) => (
              <div key={`${m.year}-${m.title}`} className={`flex flex-col md:flex-row items-start gap-8 ${i % 2 === 1 ? 'md:flex-row-reverse md:text-right' : ''}`}>
                <div className="md:w-1/3 flex-shrink-0">
                  <div className="font-medium leading-none tracking-[-0.02em]" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: 'var(--color-brand)' }}>
                    {m.year}
                  </div>
                </div>
                <div className="md:w-2/3">
                  <h3 className="font-medium tracking-[-0.01em] mb-2" style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>
                    {m.title}
                  </h3>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.0625rem', lineHeight: '1.6', color: 'rgba(0,0,0,0.72)' }}>
                    {m.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="trust" className="px-4 py-24">
        <div className="mx-auto" style={{ maxWidth: '1280px' }}>
          <h2 className="font-medium tracking-[-0.01em] mb-12 text-center" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3.375rem)' }}>
            The Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TEAM.map(member => (
              <article key={member.name} className="flex flex-col">
                <div className="aspect-square rounded-2xl mb-5" style={{ background: 'rgb(229,231,235)' }} aria-hidden />
                <h3 className="font-medium tracking-[-0.01em]" style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>
                  {member.name}
                </h3>
                <div className="text-black/55 mb-3" style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem' }}>{member.role}</div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', lineHeight: '1.6', color: 'rgba(0,0,0,0.72)' }}>
                  {member.bio}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16">
        <div className="mx-auto text-center" style={{ maxWidth: '1100px' }}>
          <div className="text-xs uppercase tracking-widest mb-8" style={{ fontFamily: 'var(--font-body)', color: 'rgba(0,0,0,0.45)' }}>
            As featured in
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
            {PRESS.map(name => (
              <span
                key={name}
                className="uppercase tracking-wide"
                style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: '#6B6B6B' }}
              >
                {name}
              </span>
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
