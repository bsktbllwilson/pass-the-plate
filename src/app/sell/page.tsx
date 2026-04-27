import SiteHeader from '@/components/sections/SiteHeader'
import SiteFooter from '@/components/sections/SiteFooter'
import SellForm from '@/components/sections/SellForm'
import { content } from '@/lib/content'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sell A Business — Pass The Plate',
  description: 'List your Asian F&B business on Pass The Plate. Reach vetted buyers and get expert guidance through every step of the sale.',
}

export default function SellPage() {
  return (
    <main>
      <SiteHeader />
      <SellHero />
      <SellForm />
      <SiteFooter columns={content.footer.columns} />
    </main>
  )
}

function SellHero() {
  return (
    <section className="pt-16 pb-12 px-4 text-center">
      <div className="mx-auto" style={{ maxWidth: '860px' }}>
        <div className="inline-block px-5 py-2 rounded-full text-sm font-medium mb-6"
          style={{ background: 'rgb(255,239,124)', fontFamily: 'var(--font-body)' }}>
          For Sellers
        </div>
        <h1 className="font-medium tracking-[-0.01em] mb-5"
          style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.75rem, 6vw, 5rem)', lineHeight: '1.05' }}>
          Pass The Plate<br />
          <em style={{ fontStyle: 'italic' }}>To The Right Hands</em>
        </h1>
        <p className="mx-auto"
          style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(1.1rem, 2vw, 1.375rem)', maxWidth: '600px', color: 'rgba(0,0,0,0.65)', lineHeight: '1.6' }}>
          List your business in minutes. Reach thousands of vetted buyers — bilingual advisors guide you through every step.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6 mt-10">
          {['Bilingual Support', 'Vetted Buyers Only', 'SBA-Ready Network', 'No Upfront Fees'].map((item) => (
            <div key={item} className="flex items-center gap-2 text-sm font-medium" style={{ fontFamily: 'var(--font-body)' }}>
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0"
                style={{ background: 'rgb(230,78,33)' }}>✓</span>
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
