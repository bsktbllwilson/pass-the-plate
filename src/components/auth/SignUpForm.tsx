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

type Role = 'buyer' | 'seller'

export default function SignUpForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<Role>('buyer')
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (submitting) return
    setError(null)

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    setSubmitting(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${siteUrl()}/auth/callback`,
        data: { intended_role: role },
      },
    })
    setSubmitting(false)
    if (error) {
      setError(error.message)
      return
    }
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="text-center" style={{ fontFamily: 'var(--font-body)' }}>
        <h1 className="font-medium tracking-[-0.01em] mb-3" style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', lineHeight: '1.15' }}>Check your email</h1>
        <p className="text-black/70 mb-6">We sent a confirmation link to <span className="font-medium text-black">{email}</span>. Click it to finish creating your account.</p>
        <button
          type="button"
          onClick={() => { setSubmitted(false); setEmail(''); setPassword('') }}
          className="text-sm underline text-black/55 hover:text-black"
        >
          Wrong email? Sign up again
        </button>
      </div>
    )
  }

  return (
    <div style={{ fontFamily: 'var(--font-body)' }}>
      <h1 className="font-medium tracking-[-0.01em] mb-2 text-center" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 2.5rem)', lineHeight: '1.1' }}>Get a seat at the table</h1>
      <p className="text-center text-black/55 mb-8 text-sm">Create your account to save searches, contact partners, and list your business.</p>

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

        <div>
          <label htmlFor="password" className={labelClasses}>Password <span className="text-black/40 font-normal">(min 8 characters)</span></label>
          <input
            id="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className={inputClasses}
          />
        </div>

        <fieldset className="pt-2">
          <legend className={labelClasses}>I&apos;m here to…</legend>
          <div className="space-y-2">
            <label className={`flex items-center gap-3 px-4 py-3 rounded-full border cursor-pointer transition-colors ${role === 'buyer' ? 'border-black bg-[#FAF6EB]' : 'border-black/15 hover:border-black/40'}`}>
              <input
                type="radio"
                name="role"
                value="buyer"
                checked={role === 'buyer'}
                onChange={() => setRole('buyer')}
                className="w-4 h-4 accent-[rgb(230,78,33)]"
              />
              <span className="text-sm">Buy a business</span>
            </label>
            <label className={`flex items-center gap-3 px-4 py-3 rounded-full border cursor-pointer transition-colors ${role === 'seller' ? 'border-black bg-[#FAF6EB]' : 'border-black/15 hover:border-black/40'}`}>
              <input
                type="radio"
                name="role"
                value="seller"
                checked={role === 'seller'}
                onChange={() => setRole('seller')}
                className="w-4 h-4 accent-[rgb(230,78,33)]"
              />
              <span className="text-sm">Sell my business</span>
            </label>
          </div>
        </fieldset>

        {error && <div className="text-sm text-red-600">{error}</div>}

        <button
          type="submit"
          disabled={submitting}
          className="block text-center w-full py-3 rounded-full text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          style={{ background: 'rgb(230,78,33)', fontSize: '1rem' }}
        >
          {submitting ? 'Creating account…' : 'Create Account →'}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-black/10 text-center text-sm text-black/55">
        Already have an account?{' '}
        <Link href="/sign-in" className="text-black underline font-medium">Sign in</Link>
      </div>
    </div>
  )
}
