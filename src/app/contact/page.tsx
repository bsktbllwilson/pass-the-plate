import Link from 'next/link'
import type { Metadata } from 'next'
import { content } from '@/lib/content'
import { FAQS } from '@/data/faqs'
import SiteHeader from '@/components/sections/SiteHeader'
import SiteFooter from '@/components/sections/SiteFooter'
import BuySellSplit from '@/components/sections/BuySellSplit'
import FindYourNextBigDeal from '@/components/sections/FindYourNextBigDeal'
import ContactForm from './ContactForm'
import FaqAccordion from './FaqAccordion'

export const metadata: Metadata = {
  title: 'Contact — Pass The Plate',
  description: 'Get in touch with Pass The Plate. We respond within one business day.',
}

const ALT_LINKS = [
  { label: 'Playbook', href: '/playbook' },
  { label: 'Find a Partner', href: '/partners' },
  { label: 'Browse Listings', href: '/buy' },
]

export default function ContactPage() {
  return (
    <main style={{ background: 'var(--color-cream)' }}>
      <SiteHeader />

      <section className="px-4 py-24 text-center">
        <div className="mx-auto" style={{ maxWidth: '900px' }}>
          <h1 className="font-display font-medium tracking-[-0.02em] mb-6" style={{ fontSize: '2.75rem', lineHeight: '1' }}>
            Questions We Get A Lot
          </h1>
          <p className="mx-auto" style={{ fontSize: 'clamp(1.125rem, 2vw, 1.375rem)', lineHeight: '1.55', color: 'rgba(0,0,0,0.65)', maxWidth: '560px' }}>
            Reach out and we&apos;ll get back within one business day.
          </p>
        </div>
      </section>

      <section className="px-4 py-12">
        <div className="mx-auto grid grid-cols-1 lg:grid-cols-12 lg:gap-10" style={{ maxWidth: '1280px' }}>
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
          <aside className="lg:col-span-5 mt-8 lg:mt-0">
            <div className="rounded-2xl bg-white border border-black/10 p-8">
              <h2 className="font-display font-medium mb-6" style={{ fontSize: '2rem' }}>
                Other ways to reach us
              </h2>
              <dl className="font-body space-y-5 mb-8">
                <div>
                  <dt className="text-xs uppercase tracking-wide text-black/55 mb-1">Email</dt>
                  <dd>
                    <a href="mailto:hello@passtheplate.store" className="hover:opacity-70 transition-opacity" style={{ color: 'var(--color-brand)' }}>
                      hello@passtheplate.store
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-black/55 mb-1">Phone</dt>
                  <dd>(212) 555-0100</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-black/55 mb-1">Office hours</dt>
                  <dd>Mon–Fri, 9am–6pm ET</dd>
                </div>
              </dl>
              <div className="border-t border-black/10 pt-5 space-y-1">
                {ALT_LINKS.map(l => (
                  <Link
                    key={l.label}
                    href={l.href}
                    className="flex items-center justify-between py-3 px-3 -mx-3 rounded-lg hover:bg-black/5 transition-colors"
                    style={{ fontSize: '1rem' }}
                  >
                    <span className="font-medium">{l.label}</span>
                    <span aria-hidden style={{ color: 'var(--color-brand)' }}>→</span>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="px-4 py-24">
        <div className="mx-auto" style={{ maxWidth: '900px' }}>
          <h2 className="font-display font-medium tracking-[-0.01em] mb-10 text-center" style={{ fontSize: '2rem' }}>
            Common Questions
          </h2>
          <FaqAccordion faqs={FAQS} />
        </div>
      </section>

      <FindYourNextBigDeal />
      <BuySellSplit />
      <SiteFooter columns={content.footer.columns} />
    </main>
  )
}
