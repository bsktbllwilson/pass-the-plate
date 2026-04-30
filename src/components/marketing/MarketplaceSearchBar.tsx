'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui'

type Props = {
  submitLabel?: string
  placeholder?: string
}

// Keyword search bar that mirrors the /buy listing-page search bar
// (white pill, orange "Search →" CTA on the right). Used on the
// homepage hero and /sell hero — both navigate to /buy?q=...
export default function MarketplaceSearchBar({
  submitLabel = 'Search →',
  placeholder = 'Keywords (e.g. dumplings, Williamsburg, liquor license)',
}: Props) {
  const router = useRouter()
  const [value, setValue] = useState('')

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (value.trim()) params.set('q', value.trim())
    router.push(`/buy${params.toString() ? '?' + params.toString() : ''}`)
  }

  return (
    <form
      onSubmit={submit}
      className="mx-auto flex items-stretch rounded-full bg-white border border-black overflow-hidden"
      style={{ maxWidth: '720px' }}
    >
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder={placeholder}
        className="flex-1 px-7 py-4 font-medium outline-none bg-transparent placeholder-black/40"
        style={{ fontSize: '1.125rem' }}
      />
      <Button type="submit" size="lg" shape="rounded" className="rounded-l-none">
        {submitLabel}
      </Button>
    </form>
  )
}
