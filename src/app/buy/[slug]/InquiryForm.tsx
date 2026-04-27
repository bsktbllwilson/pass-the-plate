'use client'
import { useState } from 'react'

export default function InquiryForm({ listingId, listingTitle }: { listingId: string; listingTitle: string }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const payload = { listingId, listingTitle, name, email, message }
    console.log('Inquiry submitted:', payload)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-black/10 bg-white p-6">
        <h3 className="font-medium mb-2" style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>Inquiry sent</h3>
        <p style={{ fontFamily: 'var(--font-body)', color: 'rgba(0,0,0,0.7)' }}>
          Thanks — we&apos;ll forward your message to the seller.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-black/10 bg-white p-6">
      <h3 className="font-medium mb-4" style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>Inquire about this business</h3>
      <div className="space-y-3">
        <input
          type="text"
          required
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Your name"
          className="w-full px-4 py-3 rounded-lg border border-black/15 bg-white outline-none focus:border-black/40"
          style={{ fontFamily: 'var(--font-body)', fontSize: '1rem' }}
        />
        <input
          type="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full px-4 py-3 rounded-lg border border-black/15 bg-white outline-none focus:border-black/40"
          style={{ fontFamily: 'var(--font-body)', fontSize: '1rem' }}
        />
        <textarea
          required
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="What would you like to know about this business?"
          rows={4}
          className="w-full px-4 py-3 rounded-lg border border-black/15 bg-white outline-none focus:border-black/40 resize-y"
          style={{ fontFamily: 'var(--font-body)', fontSize: '1rem' }}
        />
        <button
          type="submit"
          className="w-full py-3 rounded-full text-white font-medium hover:opacity-90 transition-opacity"
          style={{ background: 'rgb(230,78,33)', fontFamily: 'var(--font-body)', fontSize: '1rem' }}
        >
          Send Inquiry →
        </button>
      </div>
    </form>
  )
}
