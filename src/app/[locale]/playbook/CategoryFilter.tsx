'use client'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'

const CATEGORY_VALUES = ['buying', 'selling', 'legal', 'visa_immigration', 'market_entry', 'operations', 'finance'] as const

export default function CategoryFilter() {
  const t = useTranslations('playbook.categories')
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

  const options = [
    { value: '', label: t('all') },
    ...CATEGORY_VALUES.map((v) => ({ value: v, label: t(v) })),
  ]

  return (
    <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
      {options.map(c => {
        const isActive = c.value === active
        return (
          <button
            key={c.value || 'all'}
            type="button"
            onClick={() => pick(c.value)}
            className={`flex-shrink-0 px-5 py-2.5 rounded-full font-medium border transition-colors ${isActive ? 'border-black' : 'border-black hover:bg-black/5'}`}
            style={{
              background: isActive ? 'var(--color-yellow)' : '#fff',
              color: '#000',
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
