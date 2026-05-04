import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { LinkButton } from '@/components/ui'
import SiteHeader from '@/components/sections/SiteHeader'

type Params = Promise<{ locale: string }>

export const metadata: Metadata = {
  title: 'Offline — Pass The Plate',
  robots: { index: false, follow: false },
}

// Fallback page served by the service worker when a navigation fails
// (no network, no cached response). Cream + brand-orange messaging,
// per founder spec. Links route back to cached / commonly-cached
// surfaces so the offline reader has somewhere to go.
export default async function OfflinePage({ params }: { params: Params }) {
  const { locale } = await params
  setRequestLocale(locale)
  return <OfflineContent />
}

function OfflineContent() {
  const t = useTranslations('offline')
  return (
    <main style={{ background: 'var(--color-cream)', minHeight: '100vh' }}>
      <SiteHeader />
      <section className="px-4 py-24 text-center">
        <div className="mx-auto" style={{ maxWidth: '720px' }}>
          <div
            className="mx-auto mb-8 flex items-center justify-center rounded-full"
            style={{ width: 96, height: 96, background: 'var(--color-brand)' }}
            aria-hidden
          >
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12.55a11 11 0 0 1 14.08 0" />
              <path d="M1.42 9a16 16 0 0 1 21.16 0" />
              <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
              <line x1="12" y1="20" x2="12.01" y2="20" />
              <line x1="2" y1="2" x2="22" y2="22" />
            </svg>
          </div>
          <h1 className="font-display font-medium tracking-[-0.01em] mb-4">
            {t('heading')}
          </h1>
          <p className="mx-auto mb-10" style={{ fontSize: '1.125rem', color: 'rgba(0,0,0,0.65)', maxWidth: '480px' }}>
            {t('subhead')}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <LinkButton href="/buy" size="md">{t('browseListings')}</LinkButton>
            <Link href="/" className="font-body text-sm underline">{t('backHome')}</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
