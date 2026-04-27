import Image from 'next/image'
import type { Partner } from '@/lib/content'

export default function PartnerLogos({ partners }: { partners: Partner[] }) {
  return (
    <section className="py-20 px-4">
      <div className="mx-auto text-center" style={{ maxWidth: '1400px' }}>
        <h2 className="font-medium tracking-[-0.01em] mb-14" style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)' }}>You&apos;re In Good Hands</h2>
        <div className="flex flex-wrap items-center justify-center gap-12 md:gap-20">
          {partners.map((partner) => {
            if (partner.name === 'chowbus' && partner.logo) return (
              <div key={partner.name} className="grayscale hover:grayscale-0 transition-all">
                <Image src={partner.logo} alt="Chowbus" width={160} height={44} className="h-10 w-auto" />
              </div>
            )
            if (partner.name === 'HungryPanda') return (
              <div key={partner.name} className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full border-[3px] border-black grid place-items-center text-white text-2xl" style={{ background: '#5dc6ea', fontFamily: 'var(--font-display)' }}>熊</div>
                <span className="text-3xl font-bold" style={{ fontFamily: 'var(--font-body)' }}>HungryPanda</span>
              </div>
            )
            if (partner.name === 'Minitable') return (
              <div key={partner.name} className="flex items-baseline gap-1">
                <span className="text-4xl font-bold" style={{ fontFamily: 'var(--font-body)' }}>Minitable</span>
                <span className="inline-block w-2 h-2 rounded-sm ml-1" style={{ background: 'rgb(230,78,33)' }} />
              </div>
            )
            return null
          })}
        </div>
      </div>
    </section>
  )
}
