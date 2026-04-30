'use client'
import { useEffect, useRef, useState } from 'react'
import { useMessages } from 'next-intl'
import AnimatedStat from '@/components/marketing/AnimatedStat'

type Stat = { value: string; label: string }

export default function StatsBand() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  // Stats array lives in the active-locale messages file; useTranslations
  // can't return arrays so we read raw messages and pluck home.stats.
  const messages = useMessages() as { home?: { stats?: Stat[] } }
  const stats: Stat[] = messages?.home?.stats ?? []

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } }, { threshold: 0.2 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return (
    <section
      ref={ref}
      className="py-20 px-4"
      style={{
        background: '#000',
        color: 'var(--color-cream-soft)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.7s ease, transform 0.7s ease',
      }}
    >
      <div className="mx-auto grid grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-4" style={{ maxWidth: '1400px' }}>
        {stats.map((s) => (
          <div key={s.value} className="text-center px-4">
            <div className="font-display font-medium leading-none tracking-[-0.02em]" style={{ fontSize: 'clamp(3rem, 7vw, 5.625rem)', color: 'var(--color-yellow)' }}>
              <AnimatedStat value={s.value} />
            </div>
            <div className="mt-4" style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.375rem)' }}>{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
