'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui'

export default function SignOutButton({ label = 'Sign out' }: { label?: string }) {
  const [submitting, setSubmitting] = useState(false)

  async function onClick() {
    if (submitting) return
    setSubmitting(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <Button type="button" onClick={onClick} disabled={submitting}>
      {submitting ? 'Signing out…' : label}
    </Button>
  )
}
