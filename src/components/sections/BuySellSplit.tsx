import { useTranslations } from 'next-intl'
import { LinkButton } from '@/components/ui'

export default function BuySellSplit() {
  const t = useTranslations('home.buySellSplit')
  return (
    <section className="relative overflow-hidden" style={{ minHeight: 'clamp(400px, 55vw, 892px)' }}>
      <div className="absolute inset-0">
        <div className="absolute inset-0" style={{ background: 'url(/split-left.jpg) left center', backgroundSize: '50% 100%', backgroundRepeat: 'no-repeat' }} />
        <div className="absolute inset-0" style={{ background: 'url(/split-right.jpg) right center', backgroundSize: '50% 100%', backgroundRepeat: 'no-repeat' }} />
      </div>
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.5625) 49%, rgba(0,0,0,0.85) 100%)' }} />
      <div className="relative z-10 h-full flex flex-col md:flex-row items-end px-4 pb-12 pt-40 gap-8" style={{ minHeight: 'inherit' }}>
        <div className="flex-1 md:pl-12">
          <h2 className="font-display text-white font-medium tracking-[-0.01em] mb-6" style={{ fontSize: '60px', lineHeight: '1.1' }}>
            {t('buyHeading')}
          </h2>
          <LinkButton href="/buy" size="lg" shape="rounded" className="px-8 py-5">{t('buyCta')}</LinkButton>
        </div>
        <div className="flex-1 md:text-right md:pr-12">
          <h2 className="font-display text-white font-medium tracking-[-0.01em] mb-6" style={{ fontSize: '60px', lineHeight: '1.1' }}>
            {t('sellHeading')}
          </h2>
          <LinkButton href="/sell" size="lg" shape="rounded" className="px-8 py-5">{t('sellCta')}</LinkButton>
        </div>
      </div>
    </section>
  )
}
