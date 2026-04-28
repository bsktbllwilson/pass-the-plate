import type { Partner } from '@/lib/content'

export default function PartnerLogos({ partners }: { partners: Partner[] }) {
  return (
    <section className="py-20 px-4">
      <div className="mx-auto text-center" style={{ maxWidth: '1400px' }}>
        <h2 className="font-display font-medium tracking-[-0.01em] mb-14" style={{ fontStyle: 'italic', fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)' }}>You&apos;re In Good Hands</h2>
        <div className="flex flex-wrap items-center justify-center gap-12 md:gap-20">
          {partners.map((partner) => (
            <span
              key={partner.name}
              className="font-display uppercase tracking-wide" style={{ fontSize: '1.5rem', color: '#6B6B6B' }}
            >
              {partner.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
