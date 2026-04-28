'use client'
import { useState } from 'react'
import { Button } from '@/components/ui'

export default function Subscribe() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
    setEmail('')
    setTimeout(() => setSubmitted(false), 5000)
  }
  return (
    <section className="px-4 py-12">
      <div className="mx-auto rounded-[80px] px-8 md:px-16 py-16 flex flex-col md:flex-row items-center md:items-start gap-10" style={{ background: 'var(--color-brand)', maxWidth: '1540px' }}>
        <div className="flex-1">
          <h2 className="font-medium tracking-[-0.01em]" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4.5vw, 3.625rem)', lineHeight: '1', color: '#000' }}>Find Your Next Big Deal</h2>
        </div>
        <div className="flex-shrink-0 w-full md:w-[480px]">
          <p className="mb-4 leading-7" style={{ fontFamily: 'var(--font-body)', fontSize: '1.125rem', color: '#000' }}>Get in touch with our advisor for a complimentary consultation on your next venture.</p>
          {submitted ? (
            <div className="px-8 py-4 rounded-full text-center font-medium text-white" style={{ background: '#000', fontFamily: 'var(--font-body)' }}>Thanks — we&apos;ll be in touch!</div>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-3 flex-col sm:flex-row">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email Address"
                required
                className="flex-1 rounded-full px-7 py-4 text-lg font-medium outline-none border border-gray-200"
                style={{ fontFamily: 'var(--font-body)', color: '#000' }}
              />
              <Button type="submit" variant="dark" size="lg" shape="rounded">Get In Touch →</Button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
