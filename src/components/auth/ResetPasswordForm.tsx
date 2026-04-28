'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const inputClasses = 'w-full rounded-full border border-black/15 bg-[var(--color-cream-input)] px-5 py-3 text-base focus:outline-none focus:border-black/40 transition-colors'
const labelClasses = 'block text-sm font-medium mb-2 text-black/70'

export default function ResetPasswordForm() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (submitting) return
    setError(null)

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setSubmitting(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })
    setSubmitting(false)
    if (error) {
      setError(error.message)
      return
    }
    router.push('/account')
    router.refresh()
  }

  return (
    <div style={{ fontFamily: 'var(--font-body)' }}>
      <h1 className="font-medium tracking-[-0.01em] mb-2 text-center" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 2.5rem)', lineHeight: '1.1' }}>Set a new password</h1>
      <p className="text-center text-black/55 mb-8 text-sm">Choose a new password for your account.</p>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="password" className={labelClasses}>New password <span className="text-black/40 font-normal">(min 8 characters)</span></label>
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
        <div>
          <label htmlFor="confirm" className={labelClasses}>Confirm new password</label>
          <input
            id="confirm"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            className={inputClasses}
          />
        </div>

        {error && <div className="text-sm text-red-600">{error}</div>}

        <button
          type="submit"
          disabled={submitting}
          className="block text-center w-full py-3 rounded-full text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          style={{ background: 'var(--color-brand)', fontSize: '1rem' }}
        >
          {submitting ? 'Updating…' : 'Update Password →'}
        </button>
      </form>
    </div>
  )
}
