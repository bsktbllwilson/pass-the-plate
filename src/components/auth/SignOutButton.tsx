'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function SignOutButton({ className, label = 'Sign out' }: { className?: string; label?: string }) {
  const [submitting, setSubmitting] = useState(false)

  async function onClick() {
    if (submitting) return
    setSubmitting(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={submitting}
      className={className ?? 'inline-block px-6 py-3 rounded-full text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50'}
      style={!className ? { background: 'rgb(230,78,33)', fontFamily: 'var(--font-body)', fontSize: '1rem' } : undefined}
    >
      {submitting ? 'Signing out…' : label}
    </button>
  )
}
