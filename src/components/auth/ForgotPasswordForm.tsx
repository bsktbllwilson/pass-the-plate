'use client'
import Link from 'next/link'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const inputClasses = 'w-full rounded-full border border-black/15 bg-[#FAF6EB] px-5 py-3 text-base focus:outline-none focus:border-black/40 transition-colors'
const labelClasses = 'block text-sm font-medium mb-2 text-black/70'

function siteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL
  if (typeof window !== 'undefined') return window.location.origin
  return ''
}

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (submitting) return
    setError(null)
    setSubmitting(true)
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${siteUrl()}/reset-password`,
    })
    setSubmitting(false)
    if (error) {
      setError(error.message)
      return
    }
    setSent(true)
  }

  if (sent) {
    return (
      <div className="text-center" style={{ fontFamily: 'var(--font-body)' }}>
        <h1 className="font-medium tracking-[-0.01em] mb-3" style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', lineHeight: '1.15' }}>Check your email</h1>
        <p className="text-black/70 mb-6">We sent a password reset link to <span className="font-medium text-black">{email}</span>.</p>
        <Link href="/sign-in" className="text-sm underline text-black/55 hover:text-black">Back to sign in</Link>
      </div>
    )
  }

  return (
    <div style={{ fontFamily: 'var(--font-body)' }}>
      <h1 className="font-medium tracking-[-0.01em] mb-2 text-center" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 2.5rem)', lineHeight: '1.1' }}>Reset your password</h1>
      <p className="text-center text-black/55 mb-8 text-sm">Enter the email tied to your account and we&apos;ll send a reset link.</p>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className={labelClasses}>Email</label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className={inputClasses}
          />
        </div>

        {error && <div className="text-sm text-red-600">{error}</div>}

        <button
          type="submit"
          disabled={submitting}
          className="block text-center w-full py-3 rounded-full text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          style={{ background: 'rgb(230,78,33)', fontSize: '1rem' }}
        >
          {submitting ? 'Sending…' : 'Send Reset Link →'}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-black/10 text-center text-sm">
        <Link href="/sign-in" className="text-black/55 hover:text-black">← Back to sign in</Link>
      </div>
    </div>
  )
}
