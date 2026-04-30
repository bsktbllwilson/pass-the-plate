'use client'
import { useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import { Button } from '@/components/ui'

export default function SearchBar() {
  const t = useTranslations('buy.search')
  const router = useRouter()
  const params = useSearchParams()
  const [value, setValue] = useState(params.get('q') ?? '')

  useEffect(() => { setValue(params.get('q') ?? '') }, [params])

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const next = new URLSearchParams(params.toString())
    if (value.trim()) next.set('q', value.trim())
    else next.delete('q')
    next.delete('page')
    router.replace(`/buy${next.toString() ? '?' + next.toString() : ''}`)
  }

  return (
    <form onSubmit={submit} className="mx-auto flex items-stretch rounded-full bg-white border border-black overflow-hidden" style={{ maxWidth: '720px' }}>
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder={t('placeholder')}
        className="flex-1 px-7 py-4 font-medium outline-none bg-transparent placeholder-black/40"
        style={{ fontSize: '1.125rem' }}
      />
      <Button type="submit" variant="search" size="lg" shape="rounded" className="rounded-l-none">
        {t('submit')}
      </Button>
    </form>
  )
}
