import { LinkButton } from '@/components/ui'

export default function FindYourNextBigDeal() {
  return (
    <section className="px-4 py-20">
      <div className="mx-auto rounded-[35px] px-8 py-16 md:px-16 md:py-20 text-center" style={{ background: 'var(--color-brand)', maxWidth: '1540px' }}>
        <h2 className="font-display text-[var(--color-cream-soft)] font-medium tracking-[-0.01em] mb-6 mx-auto" style={{ fontSize: '2.1875rem', lineHeight: '1.05', maxWidth: '900px' }}>
          Find Your Next Big Deal
        </h2>
        <p className="text-[var(--color-cream-soft)]/85 mx-auto mb-10" style={{ fontSize: 'clamp(1.1rem, 2vw, 1.375rem)', maxWidth: '700px', lineHeight: '1.6' }}>
          Browse vetted Asian F&amp;B businesses for sale across the country. Bilingual support, transparent financials, and an advisor network ready when you are.
        </p>
        <LinkButton href="/buy" variant="inverse" size="lg" shape="rounded" className="px-10 py-5">
          Browse All Listings →
        </LinkButton>
      </div>
    </section>
  )
}
