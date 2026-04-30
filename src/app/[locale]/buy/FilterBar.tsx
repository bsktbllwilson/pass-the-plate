'use client'
import { useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'

type Option = { value: string; label: string }

// Internal value (URL param) ↔ translation key for the option label.
// Industries / locations / asset filters live by stable internal
// codes; the labels render via t() so they translate per locale.
const INDUSTRY_KEYS = ['restaurant', 'bakery', 'grocery', 'manufacturing', 'catering'] as const
const LOCATION_VALUES = ['Manhattan', 'Brooklyn', 'Queens', 'Flushing', 'Sunset Park', 'Williamsburg', 'Chinatown'] as const
const PRICE_KEYS = ['under_500k', '500k_1m', '1m_2m', '2m_plus'] as const
const ASSET_KEYS = [
  { value: 'walk-in cooler', tKey: 'walkInCooler' },
  { value: 'liquor license', tKey: 'liquorLicense' },
  { value: 'patio', tKey: 'patio' },
  { value: 'POS', tKey: 'pos' },
  { value: 'hood', tKey: 'hood' },
  { value: 'walk-in freezer', tKey: 'walkInFreezer' },
] as const
const SORT_KEYS = [
  { value: '', tKey: 'trending' },
  { value: 'newest', tKey: 'newest' },
  { value: 'price_asc', tKey: 'priceAsc' },
  { value: 'revenue_desc', tKey: 'revenueDesc' },
] as const

export default function FilterBar() {
  const t = useTranslations('buy.filter')
  const router = useRouter()
  const params = useSearchParams()

  const INDUSTRY_OPTIONS: Option[] = INDUSTRY_KEYS.map((k) => ({ value: k, label: t(`industries.${k}`) }))
  const LOCATION_OPTIONS: Option[] = LOCATION_VALUES.map((v) => ({ value: v, label: v }))
  const PRICE_BANDS: Option[] = PRICE_KEYS.map((k) => ({ value: k, label: t(`priceBands.${k}`) }))
  const REVENUE_BANDS: Option[] = PRICE_KEYS.map((k) => ({ value: k, label: t(`revenueBands.${k}`) }))
  const ASSET_OPTIONS: Option[] = ASSET_KEYS.map((a) => ({ value: a.value, label: t(`assetOptions.${a.tKey}`) }))
  const SORT_OPTIONS: Option[] = SORT_KEYS.map((s) => ({ value: s.value, label: t(`sort.${s.tKey}`) }))

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
  const sortLabel = SORT_OPTIONS.find(o => o.value === sort)?.label ?? t('sort.trending')

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Popover label={t('industry')} count={industry.length}>
        <CheckboxList options={INDUSTRY_OPTIONS} selected={industry} onToggle={v => toggleMulti('industry', v)} />
      </Popover>
      <Popover label={t('location')} count={location.length}>
        <CheckboxList options={LOCATION_OPTIONS} selected={location} onToggle={v => toggleMulti('location', v)} />
      </Popover>
      <Popover label={t('askingPrice')} count={price ? 1 : 0}>
        <RadioList options={PRICE_BANDS} selected={price} onSelect={v => setSingle('price', v === price ? null : v)} />
      </Popover>
      <Popover label={t('annualRevenue')} count={revenue ? 1 : 0}>
        <RadioList options={REVENUE_BANDS} selected={revenue} onSelect={v => setSingle('revenue', v === revenue ? null : v)} />
      </Popover>
      <Popover label={t('assets')} count={assets.length}>
        <CheckboxList options={ASSET_OPTIONS} selected={assets} onToggle={v => toggleMulti('assets', v)} />
      </Popover>
      <Popover label={`${t('sortPrefix')} ${sortLabel}`} count={0}>
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
