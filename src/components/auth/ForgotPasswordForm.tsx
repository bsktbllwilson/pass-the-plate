'use client'
import Link from 'next/link'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button, Field, Input } from '@/components/ui'

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
      <div className="font-body text-center">
        <h1 className="font-display font-medium tracking-[-0.01em] mb-3">Check your email</h1>
        <p className="text-black/70 mb-6">We sent a password reset link to <span className="font-medium text-black">{email}</span>.</p>
        <Link href="/sign-in" className="text-sm underline text-black/55 hover:text-black">Back to sign in</Link>
      </div>
    )
  }

  return (
    <div className="font-body">
      <h1 className="font-display font-medium tracking-[-0.01em] mb-2 text-center">Reset your password</h1>
      <p className="text-center text-black/55 mb-8 text-sm">Enter the email tied to your account and we&apos;ll send a reset link.</p>

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

        {error && <div className="text-sm text-red-600">{error}</div>}

        <Button type="submit" disabled={submitting} fullWidth>
          {submitting ? 'Sending…' : 'Send Reset Link →'}
        </Button>
      </form>

      <div className="mt-8 pt-6 border-t border-black/10 text-center text-sm">
        <Link href="/sign-in" className="text-black/55 hover:text-black">← Back to sign in</Link>
      </div>
    </div>
  )
}
