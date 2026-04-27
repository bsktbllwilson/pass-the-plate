'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const INDUSTRIES = ['All Industries', 'Restaurants', 'Grocery', 'Manufacturing', 'Bakery & Cafe']

const INDUSTRY_PARAM: Record<string, string | null> = {
  'All Industries': null,
  Restaurants: 'restaurant',
  Grocery: 'grocery',
  Manufacturing: 'manufacturing',
  'Bakery & Cafe': 'bakery',
}

export default function Hero({ headline, italicWord, subhead }: { headline: string; italicWord: string; subhead: string }) {
  const router = useRouter()
  const [city, setCity] = useState('')
  const [industry, setIndustry] = useState('All Industries')
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const words = headline.split(' ')
  const italicIdx = words.findIndex(w => w.toLowerCase().includes(italicWord.toLowerCase()))

  function search(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (city.trim()) params.set('q', city.trim())
    const ind = INDUSTRY_PARAM[industry]
    if (ind) params.set('industry', ind)
    router.push(`/buy${params.toString() ? '?' + params.toString() : ''}`)
  }

  useEffect(() => {
    if (!open) return
    function onDocClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <section className="pt-16 pb-20 px-4 text-center">
      <div className="mx-auto" style={{ maxWidth: '1100px' }}>
        <h1 className="font-medium leading-[1.1] tracking-[-0.01em] mb-6"
          style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.75rem, 7vw, 6.25rem)', color: '#000' }}>
          {words.map((word, i) => (
            <span key={i}>{i === italicIdx ? <em style={{ fontStyle: 'italic' }}>{word}</em> : word}{i < words.length - 1 ? ' ' : ''}</span>
          ))}
        </h1>
        <p className="font-medium mb-12 mx-auto" style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(1.125rem, 2.5vw, 1.875rem)', maxWidth: '900px', color: '#000' }}>
          {subhead}
        </p>
        <form onSubmit={search} className="mx-auto flex flex-col md:flex-row items-stretch md:items-center rounded-3xl bg-white border border-black overflow-visible" style={{ maxWidth: '900px' }}>
          <input type="text" value={city} onChange={e => setCity(e.target.value)} placeholder="City, State"
            className="flex-1 px-8 py-5 font-medium outline-none bg-transparent placeholder-black/40 border-b md:border-b-0 md:border-r border-black/10"
            style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(1rem, 2vw, 1.5rem)' }} />
          <div ref={wrapperRef} className="relative flex-shrink-0 md:w-56 border-b md:border-b-0 border-black/10">
            <button type="button" onClick={() => setOpen(o => !o)} aria-haspopup="listbox" aria-expanded={open}
              className="w-full text-left px-8 py-5 font-medium outline-none bg-transparent text-black/50 cursor-pointer pr-12 flex items-center justify-between"
              style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(1rem, 2vw, 1.5rem)' }}>
              <span className="truncate">{industry}</span>
              <svg className="absolute right-5 top-1/2 -translate-y-1/2" width="20" height="11" viewBox="0 0 20 11" fill="none" stroke="rgba(41,41,41,0.6)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="1,1 10,9 19,1"/></svg>
            </button>
            {open && (
              <ul role="listbox" className="absolute left-0 right-0 top-full mt-2 z-20 bg-white border border-black rounded-2xl overflow-hidden shadow-lg">
                {INDUSTRIES.map(opt => (
                  <li key={opt} role="option" aria-selected={industry === opt}
                    onClick={() => { setIndustry(opt); setOpen(false) }}
                    className={`px-6 py-3 cursor-pointer hover:bg-black/5 ${industry === opt ? 'text-black' : 'text-black/70'}`}
                    style={{ fontFamily: 'var(--font-body)', fontSize: '1.0625rem' }}>
                    {opt}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button type="submit"
            className="px-10 py-5 font-medium text-white rounded-b-3xl md:rounded-b-none md:rounded-r-3xl flex items-center justify-center gap-3 min-h-[72px]"
            style={{ background: 'rgb(230,78,33)', fontFamily: 'var(--font-body)', fontSize: 'clamp(1rem, 2vw, 1.5rem)' }}>
            Find A Seat →
          </button>
        </form>
      </div>
    </section>
  )
}
