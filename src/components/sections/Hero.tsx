'use client'
import { useState } from 'react'

export default function Hero({ headline, italicWord, subhead }: { headline: string; italicWord: string; subhead: string }) {
  const [city, setCity] = useState('')
  const [industry, setIndustry] = useState('All Industries')
  const words = headline.split(' ')
  const italicIdx = words.findIndex(w => w.toLowerCase().includes(italicWord.toLowerCase()))

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
        <div className="mx-auto flex flex-col md:flex-row items-stretch md:items-center rounded-3xl bg-white border border-black overflow-hidden" style={{ maxWidth: '900px' }}>
          <input type="text" value={city} onChange={e => setCity(e.target.value)} placeholder="City, State"
            className="flex-1 px-8 py-5 font-medium outline-none bg-transparent placeholder-black/40 border-b md:border-b-0 md:border-r border-black/10"
            style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(1rem, 2vw, 1.5rem)' }} />
          <div className="relative flex-shrink-0 md:w-56">
            <select value={industry} onChange={e => setIndustry(e.target.value)}
              className="w-full appearance-none px-8 py-5 font-medium outline-none bg-transparent text-black/50 border-b md:border-b-0 border-black/10 cursor-pointer pr-12"
              style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(1rem, 2vw, 1.5rem)' }}>
              <option>All Industries</option>
              <option>Restaurants</option>
              <option>Grocery</option>
              <option>Manufacturing</option>
              <option>Bakery & Cafe</option>
            </select>
            <svg className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2" width="20" height="11" viewBox="0 0 20 11" fill="none" stroke="rgba(41,41,41,0.6)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="1,1 10,9 19,1"/></svg>
          </div>
          <button onClick={() => console.log({ city, industry })}
            className="px-10 py-5 font-medium text-white rounded-b-3xl md:rounded-b-none md:rounded-r-3xl flex items-center justify-center gap-3 min-h-[72px]"
            style={{ background: 'rgb(230,78,33)', fontFamily: 'var(--font-body)', fontSize: 'clamp(1rem, 2vw, 1.5rem)' }}>
            Find A Seat →
          </button>
        </div>
      </div>
    </section>
  )
}
