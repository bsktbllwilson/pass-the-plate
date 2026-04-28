'use client'
import { useState } from 'react'
import { Button, Input } from '@/components/ui'

export default function SubscribeCard() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    console.log('Newsletter subscribe:', { email })
    setSubmitted(true)
  }

  return (
    <article className="rounded-2xl overflow-hidden flex flex-col p-8" style={{ background: 'var(--color-yellow)' }}>
      {submitted ? (
        <div className="flex flex-col flex-1 justify-center">
          <h3 className="font-medium tracking-[-0.01em] mb-3" style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', lineHeight: '1.1' }}>
            You&apos;re on the list.
          </h3>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem' }}>
            Watch your inbox — the next guide drops in a few days.
          </p>
        </div>
      ) : (
        <>
          <h3 className="font-medium tracking-[-0.01em] mb-3" style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', lineHeight: '1.1' }}>
            Subscribe For Weekly Guides
          </h3>
          <p className="mb-5" style={{ fontFamily: 'var(--font-body)', fontSize: '1rem' }}>
            Bilingual playbooks for buyers, sellers, and operators delivered every Thursday.
          </p>
          <form onSubmit={submit} className="mt-auto flex flex-col gap-3">
            <Input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@email.com"
            />
            <Button type="submit" variant="dark">
              Subscribe →
            </Button>
          </form>
        </>
      )}
    </article>
  )
}
