import type { Metadata } from 'next'
import { content } from '@/lib/content'
import { getPartners, type Partner } from '@/lib/partners'
import SiteHeader from '@/components/sections/SiteHeader'
import SiteFooter from '@/components/sections/SiteFooter'
import { LinkButton } from '@/components/ui'

export const metadata: Metadata = {
  title: 'Trusted Partners — Pass The Plate',
  description: 'Vetted SBA lenders, immigration attorneys, bilingual brokers, accountants, and insurance specialists who work with Asian F&B operators in NYC.',
}

const SPECIALTY_LABEL: Record<string, string> = {
  sba_lender: 'SBA Lender',
  immigration_attorney: 'Immigration Attorney',
  bilingual_broker: 'Bilingual Broker',
  accountant: 'Accountant',
  insurance: 'Insurance',
}

function formatSpecialty(specialty: string): string {
  return SPECIALTY_LABEL[specialty] ?? specialty
}

function formatLanguages(languages: string[]): string {
  return languages.join(' • ')
}

function PartnerCard({ partner }: { partner: Partner }) {
  return (
    <article className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] p-6 flex flex-col h-full">
      <div className="flex items-start justify-between gap-3 mb-4">
        <span
          className="inline-block px-3 py-1 rounded-full text-xs uppercase tracking-wide"
          style={{ background: 'rgba(230,78,33,0.08)', color: 'var(--color-brand)' }}
        >
          {formatSpecialty(partner.specialty)}
        </span>
        {partner.featured && (
          <span
            className="inline-block px-3 py-1 rounded-full text-xs uppercase tracking-wide"
            style={{ background: 'rgba(0,0,0,0.06)', color: 'rgba(0,0,0,0.7)' }}
          >
            Featured
          </span>
        )}
      </div>

      <h2 className="font-display font-medium tracking-[-0.01em] mb-1" style={{ fontSize: '1.5rem', lineHeight: '1.15' }}>
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
          Email
        </a>
        {partner.phone && (
          <a href={`tel:${partner.phone.replace(/[^\d+]/g, '')}`} className="text-black/70 hover:text-black transition-colors">
            {partner.phone}
          </a>
        )}
        {partner.website && (
          <a href={partner.website} target="_blank" rel="noopener noreferrer" className="text-black/70 hover:text-black transition-colors ml-auto">
            Website →
          </a>
        )}
      </div>
    </article>
  )
}

export default async function PartnersPage() {
  const { rows, totalCount } = await getPartners({ perPage: 100 })

  return (
    <main style={{ background: 'var(--color-cream)' }}>
      <SiteHeader />

      <section className="px-4 pt-12 pb-6">
        <div className="mx-auto" style={{ maxWidth: '1540px' }}>
          <h1 className="font-display font-medium tracking-[-0.01em] text-center mb-2" style={{ fontSize: '2.5rem', lineHeight: '1.05' }}>
            Trusted <em style={{ fontStyle: 'italic' }}>Partners</em>
          </h1>
          <p className="text-center mb-8 mx-auto" style={{ fontSize: '1.125rem', color: 'rgba(0,0,0,0.65)', maxWidth: '640px' }}>
            Vetted SBA lenders, immigration attorneys, bilingual brokers, accountants, and insurance specialists who work with Asian F&amp;B operators in NYC.
          </p>
          <div className="text-center">
            <LinkButton href="/partners/apply" size="md">
              Become a Partner →
            </LinkButton>
          </div>
        </div>
      </section>

      <section className="px-4 pb-20">
        <div className="mx-auto" style={{ maxWidth: '1540px' }}>
          {rows.length === 0 ? (
            <div className="font-body rounded-2xl bg-white border border-black/10 p-12 text-center">
              <p className="text-xl mb-2">No partners listed yet.</p>
              <p className="text-black/60">Check back soon — we&apos;re adding vetted partners every week.</p>
            </div>
          ) : (
            <>
              <div className="font-body text-sm text-black/55 mb-6">
                {totalCount} {totalCount === 1 ? 'partner' : 'partners'}
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

      <SiteFooter columns={content.footer.columns} />
    </main>
  )
}
