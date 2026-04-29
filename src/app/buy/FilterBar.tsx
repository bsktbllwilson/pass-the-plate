'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

type Option = { value: string; label: string }

const INDUSTRY_OPTIONS: Option[] = [
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'bakery', label: 'Bakery' },
  { value: 'grocery', label: 'Grocery' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'catering', label: 'Catering' },
]

const LOCATION_OPTIONS: Option[] = [
  { value: 'Manhattan', label: 'Manhattan' },
  { value: 'Brooklyn', label: 'Brooklyn' },
  { value: 'Queens', label: 'Queens' },
  { value: 'Flushing', label: 'Flushing' },
  { value: 'Sunset Park', label: 'Sunset Park' },
  { value: 'Williamsburg', label: 'Williamsburg' },
  { value: 'Chinatown', label: 'Chinatown' },
]

const PRICE_BANDS: Option[] = [
  { value: 'under_500k', label: 'Under $500K' },
  { value: '500k_1m', label: '$500K – $1M' },
  { value: '1m_2m', label: '$1M – $2M' },
  { value: '2m_plus', label: '$2M+' },
]

const REVENUE_BANDS: Option[] = [
  { value: 'under_500k', label: 'Under $500K' },
  { value: '500k_1m', label: '$500K – $1M' },
  { value: '1m_2m', label: '$1M – $2M' },
  { value: '2m_plus', label: '$2M+' },
]

const ASSET_OPTIONS: Option[] = [
  { value: 'walk-in cooler', label: 'Walk-in cooler' },
  { value: 'liquor license', label: 'Liquor license' },
  { value: 'patio', label: 'Outdoor patio' },
  { value: 'POS', label: 'POS system' },
  { value: 'hood', label: 'Hood system' },
  { value: 'walk-in freezer', label: 'Walk-in freezer' },
]

// Default sort = '' (Trending) so the URL stays clean for the most-common
// case. Server-side, an absent `sort` param maps to 'trending'.
const SORT_OPTIONS: Option[] = [
  { value: '', label: 'Trending' },
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'revenue_desc', label: 'Revenue: High to Low' },
]

export default function FilterBar() {
  const router = useRouter()
  const params = useSearchParams()

  function multi(key: string): string[] {
    const v = params.get(key)
    return v ? v.split(',').filter(Boolean) : []
  }

  function toggleMulti(key: string, value: string) {
    const cur = multi(key)
    const next = cur.includes(value) ? cur.filter(v => v !== value) : [...cur, value]
    pushParams({ [key]: next.length ? next.join(',') : null })
  }

  function setSingle(key: string, value: string | null) {
    pushParams({ [key]: value })
  }

  function pushParams(updates: Record<string, string | null>) {
    const next = new URLSearchParams(params.toString())
    for (const [k, v] of Object.entries(updates)) {
      if (v === null || v === '') next.delete(k)
      else next.set(k, v)
    }
    next.delete('page')
    router.replace(`/buy${next.toString() ? '?' + next.toString() : ''}`)
  }

  const industry = multi('industry')
  const location = multi('location')
  const assets = multi('assets')
  const price = params.get('price') ?? ''
  const revenue = params.get('revenue') ?? ''
  const sort = params.get('sort') ?? ''
  const sortLabel = SORT_OPTIONS.find(o => o.value === sort)?.label ?? 'Trending'

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Popover label="Industry" count={industry.length}>
        <CheckboxList options={INDUSTRY_OPTIONS} selected={industry} onToggle={v => toggleMulti('industry', v)} />
      </Popover>
      <Popover label="Location" count={location.length}>
        <CheckboxList options={LOCATION_OPTIONS} selected={location} onToggle={v => toggleMulti('location', v)} />
      </Popover>
      <Popover label="Asking Price" count={price ? 1 : 0}>
        <RadioList options={PRICE_BANDS} selected={price} onSelect={v => setSingle('price', v === price ? null : v)} />
      </Popover>
      <Popover label="Annual Revenue" count={revenue ? 1 : 0}>
        <RadioList options={REVENUE_BANDS} selected={revenue} onSelect={v => setSingle('revenue', v === revenue ? null : v)} />
      </Popover>
      <Popover label="Assets & Equipments" count={assets.length}>
        <CheckboxList options={ASSET_OPTIONS} selected={assets} onToggle={v => toggleMulti('assets', v)} />
      </Popover>
      <Popover label={`Sort: ${sortLabel}`} count={0}>
        <RadioList
          options={SORT_OPTIONS}
          selected={sort}
          onSelect={v => setSingle('sort', v === sort ? null : v || null)}
        />
      </Popover>
    </div>
  )
}

function Popover({ label, count, children }: { label: string; count: number; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-black/15 bg-white font-medium hover:border-black/40 transition-colors"
        style={{ fontSize: '0.95rem' }}
      >
        <span>{label}</span>
        {count > 0 && (
          <span className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded-full text-white text-xs" style={{ background: 'var(--color-brand)' }}>{count}</span>
        )}
        <svg width="12" height="8" viewBox="0 0 20 11" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><polyline points="1,1 10,9 19,1"/></svg>
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-2 z-30 bg-white border border-black/15 rounded-2xl shadow-lg p-2 min-w-[240px]">
          {children}
        </div>
      )}
    </div>
  )
}

function CheckboxList({ options, selected, onToggle }: { options: Option[]; selected: string[]; onToggle: (v: string) => void }) {
  return (
    <ul role="listbox" aria-multiselectable className="max-h-72 overflow-y-auto">
      {options.map(opt => (
        <li key={opt.value}>
          <label className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-black/5">
            <input
              type="checkbox"
              checked={selected.includes(opt.value)}
              onChange={() => onToggle(opt.value)}
              className="w-4 h-4 accent-[var(--color-brand)]"
            />
            <span style={{ fontSize: '0.95rem' }}>{opt.label}</span>
          </label>
        </li>
      ))}
    </ul>
  )
}

function RadioList({ options, selected, onSelect }: { options: Option[]; selected: string; onSelect: (v: string) => void }) {
  return (
    <ul role="listbox" className="max-h-72 overflow-y-auto">
      {options.map(opt => (
        <li key={opt.value}>
          <label className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-black/5">
            <input
              type="radio"
              checked={selected === opt.value}
              onChange={() => onSelect(opt.value)}
              className="w-4 h-4 accent-[var(--color-brand)]"
            />
            <span style={{ fontSize: '0.95rem' }}>{opt.label}</span>
          </label>
        </li>
      ))}
    </ul>
  )
}
