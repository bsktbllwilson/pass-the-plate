import { useTranslations } from 'next-intl'
import MarketplaceSearchBar from '@/components/marketing/MarketplaceSearchBar'

export default function Hero() {
  const t = useTranslations('home.hero')
  return (
    <section className="pt-16 pb-20 px-4 text-center">
      <div className="mx-auto" style={{ maxWidth: '1100px' }}>
        <h1
          className="font-display font-medium tracking-[-0.01em] mb-6"
          style={{ color: '#000' }}
        >
          {t('headline')}
        </h1>
        <p
          className="font-body font-medium mb-12 mx-auto"
          style={{ fontSize: '1.25rem', maxWidth: '900px', color: '#000', lineHeight: '1.5' }}
        >
          {t('subhead')}
        </p>
        <MarketplaceSearchBar submitLabel={t('searchSubmit')} placeholder={t('searchPlaceholder')} />
      </div>
    </section>
  )
}
