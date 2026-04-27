'use client'
import { useRouter, useSearchParams } from 'next/navigation'

const CATEGORIES: { value: string; label: string }[] = [
  { value: '', label: 'Read All' },
  { value: 'buying', label: 'Buying' },
  { value: 'selling', label: 'Selling' },
  { value: 'legal', label: 'Legal' },
  { value: 'visa_immigration', label: 'Visa & Immigration' },
  { value: 'market_entry', label: 'Market Entry' },
  { value: 'operations', label: 'Operations' },
  { value: 'finance', label: 'Finance' },
]

export default function CategoryFilter() {
  const router = useRouter()
  const params = useSearchParams()
  const active = params.get('category') ?? ''

  function pick(value: string) {
    const next = new URLSearchParams(params.toString())
    if (value) next.set('category', value)
    else next.delete('category')
    next.delete('page')
    router.replace(`/playbook${next.toString() ? '?' + next.toString() : ''}`)
  }

  return (
    <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
      {CATEGORIES.map(c => {
        const isActive = c.value === active
        return (
          <button
            key={c.value || 'all'}
            type="button"
            onClick={() => pick(c.value)}
            className={`flex-shrink-0 px-5 py-2.5 rounded-full font-medium border transition-colors ${isActive ? 'border-black' : 'border-black hover:bg-black/5'}`}
            style={{
              background: isActive ? '#FCE16E' : '#fff',
              color: '#000',
              fontFamily: 'var(--font-body)',
              fontSize: '0.95rem',
            }}
          >
            {c.label}
          </button>
        )
      })}
    </div>
  )
}
