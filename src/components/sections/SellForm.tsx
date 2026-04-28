'use client'

import { useState, FormEvent } from 'react'

type Status = 'idle' | 'submitting' | 'success' | 'error'

export default function SellForm() {
  const [status, setStatus] = useState<Status>('idle')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('submitting')
    try {
      // Replace with real endpoint when ready.
      await new Promise((r) => setTimeout(r, 600))
      setStatus('success')
      ;(e.target as HTMLFormElement).reset()
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <section className="px-4 pb-24">
        <div
          className="mx-auto rounded-3xl p-10 text-center"
          style={{ maxWidth: '720px', background: 'var(--color-yellow)' }}
        >
          <h2
            className="font-medium mb-3"
            style={{ fontFamily: 'var(--font-display)', fontSize: 
'clamp(1.75rem, 3vw, 2.5rem)', lineHeight: '1.1' }}
          >
            Thanks — we&rsquo;ll be in touch.
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', color: 
'rgba(0,0,0,0.7)' }}>
            A bilingual advisor will reach out within 1 business day.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="px-4 pb-24">
      <form
        onSubmit={handleSubmit}
        className="mx-auto rounded-3xl p-8 sm:p-10"
        style={{ maxWidth: '720px', background: 'rgba(0,0,0,0.03)' }}
      >
        <h2
          className="font-medium mb-2"
          style={{ fontFamily: 'var(--font-display)', fontSize: 
'clamp(1.75rem, 3vw, 2.5rem)', lineHeight: '1.1' }}
        >
          Tell us about your business
        </h2>
        <p
          className="mb-8"
          style={{ fontFamily: 'var(--font-body)', color: 
'rgba(0,0,0,0.65)' }}
        >
          The more we know, the better we can match you with serious 
buyers.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Your name" name="name" required />
          <Field label="Email" name="email" type="email" required />
          <Field label="Phone" name="phone" type="tel" />
          <Field label="Business name" name="business" required />
          <Field label="City, State" name="location" required />
          <Field label="Cuisine / category" name="category" 
placeholder="e.g. Korean, boba, sushi" />
        </div>

        <div className="mt-4">
          <label
            className="font-body block text-sm mb-2 font-medium"
          >
            Annual revenue
          </label>
          <select
            name="revenue"
            className="font-body w-full rounded-xl border border-black/10 bg-white 
px-4 py-3 text-base outline-none focus:border-black/40"
            defaultValue=""
          >
            <option value="" disabled>Select a range</option>
            <option>Under $250K</option>
            <option>$250K – $500K</option>
            <option>$500K – $1M</option>
            <option>$1M – $2.5M</option>
            <option>$2.5M+</option>
          </select>
        </div>

        <div className="mt-4">
          <label
            className="font-body block text-sm mb-2 font-medium"
          >
            Anything else we should know?
          </label>
          <textarea
            name="notes"
            rows={4}
            className="font-body w-full rounded-xl border border-black/10 bg-white 
px-4 py-3 text-base outline-none focus:border-black/40 resize-none"
            placeholder="Reason for selling, timeline, asking price..."
          />
        </div>

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="mt-8 w-full sm:w-auto px-8 py-4 rounded-full 
text-white font-medium transition-opacity disabled:opacity-60"
          style={{ background: 'var(--color-brand)', fontFamily: 
'var(--font-body)' }}
        >
          {status === 'submitting' ? 'Submitting…' : 'Submit listing'}
        </button>

        {status === 'error' && (
          <p className="mt-4 text-sm" style={{ color: 'var(--color-brand)', 
fontFamily: 'var(--font-body)' }}>
            Something went wrong. Please try again.
          </p>
        )}
      </form>
    </section>
  )
}

function Field({
  label,
  name,
  type = 'text',
  required,
  placeholder,
}: {
  label: string
  name: string
  type?: string
  required?: boolean
  placeholder?: string
}) {
  return (
    <div>
      <label
        className="font-body block text-sm mb-2 font-medium"
      >
        {label}
        {required && <span style={{ color: 'var(--color-brand)' }}> *</span>}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="font-body w-full rounded-xl border border-black/10 bg-white px-4 
py-3 text-base outline-none focus:border-black/40"
      />
    </div>
  )
}
