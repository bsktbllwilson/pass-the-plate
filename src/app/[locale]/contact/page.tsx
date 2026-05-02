import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { FAQS } from '@/data/faqs'
import SiteHeader from '@/components/sections/SiteHeader'
import SiteFooter from '@/components/sections/SiteFooter'
import BuySellSplit from '@/components/sections/BuySellSplit'
import FindYourNextBigDeal from '@/components/sections/FindYourNextBigDeal'
import ContactForm from './ContactForm'
import FaqAccordion from './FaqAccordion'

type Params = Promise<{ locale: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'contact' })
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  }
}

const ALT_LINKS: { tKey: 'playbook' | 'partners' | 'buy'; href: string }[] = [
  { tKey: 'playbook', href: '/playbook' },
  { tKey: 'partners', href: '/partners' },
  { tKey: 'buy', href: '/buy' },
]

function ContactHero() {
  const t = useTranslations('contact')
  return (
    <section className="px-4 py-24 text-center">
      <div className="mx-auto" style={{ maxWidth: '900px' }}>
        <h1 className="font-display font-medium tracking-[-0.02em] mb-6">
          {t('heroH1')}
        </h1>
        <p className="mx-auto" style={{ fontSize: 'clamp(1.125rem, 2vw, 1.375rem)', lineHeight: '1.55', color: 'rgba(0,0,0,0.65)', maxWidth: '560px' }}>
          {t('heroSubhead')}
        </p>
      </div>
    </section>
  )
}

function OtherWaysAside() {
  const t = useTranslations('contact')
  return (
    <aside className="lg:col-span-5 mt-8 lg:mt-0">
      <div className="rounded-2xl bg-white border border-black/10 p-8">
        <h2 className="font-display font-medium mb-6" style={{ fontSize: '2.1875rem' }}>
          {t('otherWays.heading')}
        </h2>
        <dl className="font-body space-y-5 mb-8">
          <div>
            <dt className="text-xs uppercase tracking-wide text-black/55 mb-1">{t('otherWays.email')}</dt>
            <dd>
              <a href="mailto:hello@passtheplate.store" className="hover:opacity-70 transition-opacity" style={{ color: 'var(--color-brand)' }}>
                hello@passtheplate.store
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-black/55 mb-1">{t('otherWays.phone')}</dt>
            <dd>(212) 555-0100</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-black/55 mb-1">{t('otherWays.officeHours')}</dt>
            <dd>{t('otherWays.officeHoursValue')}</dd>
          </div>
        </dl>
        <div className="border-t border-black/10 pt-5 space-y-1">
          {ALT_LINKS.map(l => (
            <Link
              key={l.tKey}
              href={l.href}
              className="flex items-center justify-between py-3 px-3 -mx-3 rounded-lg hover:bg-black/5 transition-colors"
              style={{ fontSize: '1rem' }}
            >
              <span className="font-medium">{t(`altLinks.${l.tKey}`)}</span>
              <span aria-hidden style={{ color: 'var(--color-brand)' }}>→</span>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  )
}

function FaqHeader() {
  const t = useTranslations('contact.faq')
  return (
    <h2 className="font-display font-medium tracking-[-0.01em] mb-10 text-center" style={{ fontSize: '2.1875rem' }}>
      {t('heading')}
    </h2>
  )
}

export default async function ContactPage({ params }: { params: Params }) {
  const { locale } = await params
  setRequestLocale(locale)
  return (
    <main style={{ background: 'var(--color-cream)' }}>
      <SiteHeader />
      <ContactHero />

      <section className="px-4 py-12">
        <div className="mx-auto grid grid-cols-1 lg:grid-cols-12 lg:gap-10" style={{ maxWidth: '1280px' }}>
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
          <OtherWaysAside />
        </div>
      </section>

      <section className="px-4 py-24">
        <div className="mx-auto" style={{ maxWidth: '900px' }}>
          <FaqHeader />
          <FaqAccordion faqs={FAQS} />
        </div>
      </section>

      <FindYourNextBigDeal />
      <BuySellSplit />
      <SiteFooter />
    </main>
  )
}
