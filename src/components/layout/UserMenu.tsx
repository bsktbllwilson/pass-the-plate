'use client'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

function initialOf(user: User): string {
  const fullName = (user.user_metadata?.full_name as string | undefined)?.trim()
  if (fullName) return fullName.charAt(0).toUpperCase()
  return (user.email ?? '?').charAt(0).toUpperCase()
}

export default function UserMenu() {
  const [user, setUser] = useState<User | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [open, setOpen] = useState(false)
  const [signingOut, setSigningOut] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const supabase = createClient()
    let active = true
    supabase.auth.getUser().then(({ data }) => {
      if (active) {
        setUser(data.user)
        setLoaded(true)
      }
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => {
      active = false
      sub.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (!open) return
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  if (!loaded) {
    return <div className="w-10 h-10" aria-hidden />
  }

  if (!user) {
    return (
      <Link
        href="/sign-in"
        className="group font-body inline-flex items-center gap-2 rounded-full font-medium transition-colors bg-[#F8F3DE] text-black hover:bg-[#FFEF7C] active:bg-[#FFEF7C] px-6 py-2.5 sm:px-7 sm:py-2.5"
        style={{ fontSize: '15px' }}
      >
        <span>Sign In</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
        >
          <path
            d="M4 12H20M20 12L14 6M20 12L14 18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>
    )
  }

  async function signOut() {
    if (signingOut) return
    setSigningOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="font-display w-10 h-10 rounded-full bg-[var(--color-cream-soft)] text-[var(--color-brand)] flex items-center justify-center hover:opacity-90 transition-opacity" style={{ fontSize: '1.125rem', fontWeight: 600 }}
        aria-label="Account menu"
      >
        {initialOf(user)}
      </button>
      {open && (
        <div
          role="menu"
          className="font-body absolute right-0 top-full mt-2 z-30 bg-white border border-black/10 rounded-2xl shadow-lg min-w-[220px] py-2"
        >
          <div className="px-4 pb-2 mb-1 border-b border-black/10 text-xs text-black/50 truncate">{user.email}</div>
          <Link
            href="/account"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-sm hover:bg-black/5"
          >
            Account
          </Link>
          <Link
            href="/verify"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-sm hover:bg-black/5"
          >
            Verification
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={signOut}
            disabled={signingOut}
            className="block w-full text-left px-4 py-2 text-sm hover:bg-black/5 disabled:opacity-50"
          >
            {signingOut ? 'Signing out…' : 'Sign out'}
          </button>
        </div>
      )}
    </div>
  )
}
