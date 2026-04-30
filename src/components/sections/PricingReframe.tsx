import { useTranslations } from 'next-intl'
import { LinkButton } from '@/components/ui'

export default function PricingReframe() {
  const t = useTranslations('home.pricing')
  return (
    <section className="px-4">
      <div
        className="mx-auto rounded-[35px] px-8 md:px-16 py-20 md:py-28 text-center"
        style={{ background: 'var(--color-yellow)', maxWidth: '1540px' }}
      >
        <p
          className="font-display font-medium tracking-[-0.01em] mx-auto"
          style={{
            fontSize: 'clamp(1.875rem, 4.5vw, 3.25rem)',
            lineHeight: '1.15',
            color: '#000',
            maxWidth: '1100px',
          }}
        >
          {t('lineOne')}
          <br />
          {t('lineTwo')}
          <br />
          {t('lineThree')}
          <br />
          <span style={{ fontStyle: 'italic' }}>{t('lineFour')}</span>
        </p>
        <div className="mt-12">
          <LinkButton href="/sell" variant="dark" size="lg">
            {t('cta')}
          </LinkButton>
        </div>
      </div>
    </section>
  )
}
