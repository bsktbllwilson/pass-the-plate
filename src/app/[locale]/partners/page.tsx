import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { useTranslations } from 'next-intl'
import { applyPartnerLocale, getPartners, type Partner } from '@/lib/partners'
import SiteHeader from '@/components/sections/SiteHeader'
import SiteFooter from '@/components/sections/SiteFooter'
import { LinkButton } from '@/components/ui'

type Params = Promise<{ locale: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'partners' })
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  }
}

function formatLanguages(languages: string[]): string {
  return languages.join(' • ')
}

function PartnerCard({ partner }: { partner: Partner }) {
  const t = useTranslations('partners')
  const specialtyKey = partner.specialty as keyof typeof partnerSpecialtyKeys
  // Cast the specialty string to a known key. If a partner row has an
  // unmapped specialty, we fall back to the raw value so the card still
  // renders (no key lookup throws).
  const specialtyLabel =
    partner.specialty in partnerSpecialtyKeys
      ? t(`specialty.${partner.specialty}`)
      : partner.specialty
  void specialtyKey
  return (
    <article className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] p-6 flex flex-col h-full">
      <div className="flex items-start justify-between gap-3 mb-4">
        <span
          className="inline-block px-3 py-1 rounded-full text-xs uppercase tracking-wide"
          style={{ background: 'rgba(230,78,33,0.08)', color: 'var(--color-brand)' }}
        >
          {specialtyLabel}
        </span>
        {partner.featured && (
          <span
            className="inline-block px-3 py-1 rounded-full text-xs uppercase tracking-wide"
            style={{ background: 'rgba(0,0,0,0.06)', color: 'rgba(0,0,0,0.7)' }}
          >
            {t('card.featured')}
          </span>
        )}
      </div>

      <h2 className="font-display font-medium tracking-[-0.01em] mb-1" style={{ fontSize: '2.1875rem', lineHeight: '1.15' }}>
        {partner.full_name}
      </h2>
      {partner.job_title && partner.company && (
        <div className="font-body text-sm text-black/60 mb-4">
          {partner.job_title} · {partner.company}
        </div>
      )}

      {partner.languages.length > 0 && (
        <div className="font-body text-xs uppercase tracking-wide text-black/55 mb-4">
          {formatLanguages(partner.languages)}
        </div>
      )}

      {partner.bio && (
        <p
          className="text-black/70 mb-5 flex-1"
          style={{ fontSize: '0.95rem', lineHeight: '1.55', display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
        >
          {partner.bio}
        </p>
      )}

      <div className="font-body pt-4 border-t border-black/10 flex flex-wrap gap-x-4 gap-y-2 text-sm">
        <a href={`mailto:${partner.email}`} className="text-black/70 hover:text-black transition-colors">
          {t('card.email')}
        </a>
        {partner.phone && (
          <a href={`tel:${partner.phone.replace(/[^\d+]/g, '')}`} className="text-black/70 hover:text-black transition-colors">
            {partner.phone}
          </a>
        )}
        {partner.website && (
          <a href={partner.website} target="_blank" rel="noopener noreferrer" className="text-black/70 hover:text-black transition-colors ml-auto">
            {t('card.website')} →
          </a>
        )}
      </div>
    </article>
  )
}

const partnerSpecialtyKeys = {
  sba_lender: true,
  immigration_attorney: true,
  bilingual_broker: true,
  accountant: true,
  insurance: true,
} as const

export default async function PartnersPage({ params }: { params: Params }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'partners' })
  const { rows: rawRows, totalCount } = await getPartners({ perPage: 100 })
  const rows = rawRows.map((r) => applyPartnerLocale(r, locale))

  return (
    <main style={{ background: 'var(--color-cream)' }}>
      <SiteHeader />

      <section className="px-4 pt-20 md:pt-28 pb-20 md:pb-28">
        <div className="mx-auto text-center" style={{ maxWidth: '1540px' }}>
          <h1 className="font-display font-medium tracking-[-0.01em] mb-6" style={{ fontSize: '3.875rem', lineHeight: '1.15' }}>
            {t('heroH1')}
          </h1>
          <p className="mb-12 mx-auto" style={{ fontSize: '1.25rem', color: 'rgba(0,0,0,0.65)', maxWidth: '640px', fontWeight: 500 }}>
            {t('heroSubhead')}
          </p>
          <div>
            <LinkButton href="/partners/apply" size="md">
              {t('heroCta')}
            </LinkButton>
          </div>
        </div>
      </section>

      <section className="px-4 pb-24">
        <div className="mx-auto" style={{ maxWidth: '1540px' }}>
          {rows.length === 0 ? (
            <div className="font-body rounded-2xl bg-white border border-black/10 p-12 text-center">
              <p className="text-xl mb-2">{t('noResults')}</p>
              <p className="text-black/60">{t('noResultsHint')}</p>
            </div>
          ) : (
            <>
              <div className="font-body text-sm text-black/55 mb-6">
                {t('count', { count: totalCount })}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rows.map(partner => (
                  <PartnerCard key={partner.id} partner={partner} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
