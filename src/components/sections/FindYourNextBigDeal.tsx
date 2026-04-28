export default function FindYourNextBigDeal() {
  return (
    <section className="px-4 py-20">
      <div className="mx-auto rounded-[35px] px-8 py-16 md:px-16 md:py-20 text-center" style={{ background: 'var(--color-brand)', maxWidth: '1540px' }}>
        <h2 className="text-[var(--color-cream-soft)] font-medium tracking-[-0.01em] mb-6 mx-auto" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 4rem)', lineHeight: '1.05', maxWidth: '900px' }}>
          Find Your Next <em style={{ fontStyle: 'italic' }}>Big Deal</em>
        </h2>
        <p className="text-[var(--color-cream-soft)]/85 mx-auto mb-10" style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(1.1rem, 2vw, 1.375rem)', maxWidth: '700px', lineHeight: '1.6' }}>
          Browse vetted Asian F&amp;B businesses for sale across the country. Bilingual support, transparent financials, and an advisor network ready when you are.
        </p>
        <a href="/buy" className="inline-flex items-center gap-3 px-10 py-5 rounded-3xl font-medium text-xl" style={{ background: 'var(--color-cream-soft)', color: 'var(--color-brand)', fontFamily: 'var(--font-body)' }}>
          Browse All Listings →
        </a>
      </div>
    </section>
  )
}
