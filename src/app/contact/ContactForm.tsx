'use client'
import { useActionState } from 'react'
import { submitContact, type ContactState } from './actions'

const TOPICS = [
  'Buying a Business',
  'Selling a Business',
  'Membership',
  'Partnership',
  'Press',
  'Other',
]

export default function ContactForm() {
  const [state, action, pending] = useActionState<ContactState, FormData>(submitContact, null)

  if (state?.ok) {
    return (
      <div className="rounded-2xl bg-white border border-black/10 p-8">
        <h2 className="font-medium mb-3" style={{ fontFamily: 'var(--font-display)', fontSize: '1.875rem' }}>
          Message sent
        </h2>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.0625rem', lineHeight: '1.6', color: 'rgba(0,0,0,0.7)' }}>
          Thanks — we&apos;ll be in touch within one business day.
        </p>
      </div>
    )
  }

  return (
    <form action={action} className="rounded-2xl bg-white border border-black/10 p-8 space-y-4">
      <div>
        <label htmlFor="name" className="block mb-2 font-medium" style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem' }}>Full Name</label>
        <input id="name" name="name" type="text" required
          className="w-full px-4 py-3 rounded-lg border border-black/15 bg-white outline-none focus:border-black/40"
          style={{ fontFamily: 'var(--font-body)', fontSize: '1rem' }} />
      </div>
      <div>
        <label htmlFor="email" className="block mb-2 font-medium" style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem' }}>Email</label>
        <input id="email" name="email" type="email" required
          className="w-full px-4 py-3 rounded-lg border border-black/15 bg-white outline-none focus:border-black/40"
          style={{ fontFamily: 'var(--font-body)', fontSize: '1rem' }} />
      </div>
      <div>
        <label htmlFor="topic" className="block mb-2 font-medium" style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem' }}>Topic</label>
        <select id="topic" name="topic" required defaultValue=""
          className="w-full px-4 py-3 rounded-lg border border-black/15 bg-white outline-none focus:border-black/40 appearance-none"
          style={{ fontFamily: 'var(--font-body)', fontSize: '1rem' }}>
          <option value="" disabled>Choose a topic…</option>
          {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="message" className="block mb-2 font-medium" style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem' }}>Message</label>
        <textarea id="message" name="message" rows={6} required
          className="w-full px-4 py-3 rounded-lg border border-black/15 bg-white outline-none focus:border-black/40 resize-y"
          style={{ fontFamily: 'var(--font-body)', fontSize: '1rem' }} />
      </div>
      <button type="submit" disabled={pending}
        className="w-full py-3.5 rounded-full text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        style={{ background: 'var(--color-brand)', fontFamily: 'var(--font-body)', fontSize: '1rem' }}>
        {pending ? 'Sending…' : 'Send Message →'}
      </button>
    </form>
  )
}
