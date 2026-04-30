'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button, Field, Input } from '@/components/ui'

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
    <div className="font-body">
      <h1 className="font-display font-medium tracking-[-0.01em] mb-2 text-center" style={{ fontSize: '3.875rem', lineHeight: '1.15' }}>Set a new password</h1>
      <p className="text-center text-black/55 mb-8 text-sm">Choose a new password for your account.</p>

      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="New password" htmlFor="password" tone="auth" helper="(min 8 characters)">
          <Input
            id="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            tone="auth"
          />
        </Field>
        <Field label="Confirm new password" htmlFor="confirm" tone="auth">
          <Input
            id="confirm"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            tone="auth"
          />
        </Field>

        {error && <div className="text-sm text-red-600">{error}</div>}

        <Button type="submit" disabled={submitting} fullWidth>
          {submitting ? 'Updating…' : 'Update Password →'}
        </Button>
      </form>
    </div>
  )
}
