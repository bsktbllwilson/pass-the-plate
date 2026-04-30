'use client'
import { LinkButton } from '@/components/ui'

export default function BuySellSplit() {
  return (
    <section className="relative overflow-hidden" style={{ minHeight: 'clamp(400px, 55vw, 892px)' }}>
      <div className="absolute inset-0">
        <div className="absolute inset-0" style={{ background: 'url(/split-left.jpg) left center', backgroundSize: '50% 100%', backgroundRepeat: 'no-repeat' }} />
        <div className="absolute inset-0" style={{ background: 'url(/split-right.jpg) right center', backgroundSize: '50% 100%', backgroundRepeat: 'no-repeat' }} />
      </div>
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.5625) 49%, rgba(0,0,0,0.85) 100%)' }} />
      <div className="relative z-10 h-full flex flex-col md:flex-row items-end px-4 pb-12 pt-40 gap-8" style={{ minHeight: 'inherit' }}>
        <div className="flex-1 md:pl-12">
          <h2 className="font-display text-white font-medium tracking-[-0.01em] mb-6" style={{ fontSize: '2rem', lineHeight: '1.1' }}>Find A Business<br />You&apos;re Hungry For</h2>
          <LinkButton href="/buy" size="lg" shape="rounded" className="px-8 py-5">Buy A Business →</LinkButton>
        </div>
        <div className="flex-1 md:text-right md:pr-12">
          <h2 className="font-display text-white font-medium tracking-[-0.01em] mb-6" style={{ fontSize: '2rem', lineHeight: '1.1' }}>Pass The Plate<br />To The Right Hands</h2>
          <LinkButton href="/sell" size="lg" shape="rounded" className="px-8 py-5">Sell A Business →</LinkButton>
        </div>
      </div>
    </section>
  )
}
