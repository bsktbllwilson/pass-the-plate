'use client'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button, Field, Input } from '@/components/ui'

function siteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL
  if (typeof window !== 'undefined') return window.location.origin
  return ''
}

export default function SignInForm() {
  const router = useRouter()
  const params = useSearchParams()
  const next = params.get('next') ?? '/'
  const initialError = params.get('error') === 'auth_callback_failed' ? 'We could not sign you in from that link. Please try again.' : null

  const [mode, setMode] = useState<'password' | 'magic'>('password')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(initialError)
  const [magicSent, setMagicSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (submitting) return
    setError(null)
    setSubmitting(true)
    const supabase = createClient()

    if (mode === 'magic') {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${siteUrl()}/auth/callback?next=${encodeURIComponent(next)}` },
      })
      setSubmitting(false)
      if (error) {
        setError(error.message)
        return
      }
      setMagicSent(true)
      return
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setSubmitting(false)
    if (error) {
      setError(error.message === 'Invalid login credentials' ? 'Invalid email or password.' : error.message)
      return
    }
    router.push(next)
    router.refresh()
  }

  if (magicSent) {
    return (
      <div className="font-body text-center">
        <h1 className="font-display font-medium tracking-[-0.01em] mb-3" style={{ fontSize: '2.75rem', lineHeight: '1.15' }}>Check your email</h1>
        <p className="text-black/70 mb-6">We sent a sign-in link to <span className="font-medium text-black">{email}</span>. Click it to finish signing in.</p>
        <button
          type="button"
          onClick={() => { setMagicSent(false); setEmail('') }}
          className="text-sm underline text-black/55 hover:text-black"
        >
          Wrong email? Try again
        </button>
      </div>
    )
  }

  return (
    <div className="font-body">
      <h1 className="font-display font-medium tracking-[-0.01em] mb-2 text-center" style={{ fontSize: '2.75rem', lineHeight: '1.1' }}>Welcome back</h1>
      <p className="text-center text-black/55 mb-8 text-sm">Sign in to manage listings, save searches, and contact partners.</p>

      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Email" htmlFor="email" tone="auth">
          <Input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            tone="auth"
          />
        </Field>

        {mode === 'password' && (
          <Field label="Password" htmlFor="password" tone="auth">
            <Input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              tone="auth"
            />
          </Field>
        )}

        {error && <div className="text-sm text-red-600">{error}</div>}

        <Button type="submit" disabled={submitting} fullWidth>
          {submitting ? 'Signing in…' : mode === 'magic' ? 'Send Magic Link →' : 'Sign In →'}
        </Button>
      </form>

      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={() => { setMode(mode === 'magic' ? 'password' : 'magic'); setError(null) }}
          className="text-sm underline text-black/55 hover:text-black"
        >
          {mode === 'magic' ? 'Use password instead' : 'Use Magic Link instead'}
        </button>
      </div>

      <div className="mt-8 pt-6 border-t border-black/10 flex flex-col items-center gap-3 text-sm">
        <Link href="/forgot-password" className="text-black/55 hover:text-black">Forgot password?</Link>
        <span className="text-black/55">
          Don&apos;t have an account?{' '}
          <Link href={`/sign-up${next !== '/' ? `?next=${encodeURIComponent(next)}` : ''}`} className="text-black underline font-medium">Sign up</Link>
        </span>
      </div>
    </div>
  )
}
