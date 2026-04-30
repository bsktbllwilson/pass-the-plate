import MarketplaceSearchBar from '@/components/marketing/MarketplaceSearchBar'

export default function Hero({ headline, subhead }: { headline: string; subhead: string }) {
  return (
    <section className="pt-16 pb-20 px-4 text-center">
      <div className="mx-auto" style={{ maxWidth: '1100px' }}>
        <h1 className="font-display font-medium leading-[1.15] tracking-[-0.01em] mb-6" style={{ fontSize: '3.875rem', color: '#000' }}>
          {headline}
        </h1>
        <p className="font-body font-medium mb-12 mx-auto" style={{ fontSize: '1.25rem', maxWidth: '900px', color: '#000', lineHeight: '1.5' }}>
          {subhead}
        </p>
        <MarketplaceSearchBar submitLabel="Find A Seat" />
      </div>
    </section>
  )
}
