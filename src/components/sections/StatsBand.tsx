'use client'
import { useEffect, useRef, useState } from 'react'
import type { Stat } from '@/lib/content'
import AnimatedStat from '@/components/marketing/AnimatedStat'

export default function StatsBand({ stats }: { stats: Stat[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } }, { threshold: 0.2 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return (
    <section ref={ref} className="py-20 px-4" style={{ background: 'var(--color-yellow)', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)', transition: 'opacity 0.7s ease, transform 0.7s ease' }}>
      <div className="mx-auto grid grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-4" style={{ maxWidth: '1400px' }}>
        {stats.map((s) => (
          <div key={s.value} className="text-center px-4">
            <div className="font-display font-medium leading-none tracking-[-0.02em]" style={{ fontSize: 'clamp(3rem, 7vw, 5.625rem)' }}>
              <AnimatedStat value={s.value} />
            </div>
            <div className="mt-4" style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.375rem)' }}>{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
