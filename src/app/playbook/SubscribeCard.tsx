'use client'
import { useState } from 'react'

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
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="px-4 py-3 rounded-lg bg-white border border-black/15 outline-none focus:border-black/40"
              style={{ fontFamily: 'var(--font-body)', fontSize: '1rem' }}
            />
            <button
              type="submit"
              className="px-5 py-3 rounded-full font-medium text-white hover:opacity-90 transition-opacity"
              style={{ background: '#000', fontFamily: 'var(--font-body)', fontSize: '1rem' }}
            >
              Subscribe →
            </button>
          </form>
        </>
      )}
    </article>
  )
}
