'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui'

export default function SearchBar() {
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
        placeholder="Keywords (e.g. dumplings, Williamsburg, liquor license)"
        className="flex-1 px-7 py-4 font-medium outline-none bg-transparent placeholder-black/40"
        style={{ fontFamily: 'var(--font-body)', fontSize: '1.125rem' }}
      />
      <Button type="submit" size="lg" shape="rounded" className="rounded-l-none">
        Search →
      </Button>
    </form>
  )
}
