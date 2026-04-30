'use client'
import { useState } from 'react'
import Image from 'next/image'
import UserMenu from '@/components/layout/UserMenu'

const leftLinks = [
  { label: 'Buy Business', href: '/buy' },
  { label: 'Sell Business', href: '/sell' },
  { label: 'Partners', href: '/partners' },
]

const rightLinks = [
  { label: 'Playbooks', href: '/playbook' },
  { label: 'Who We Are', href: '/about' },
]

const allLinks = [...leftLinks, ...rightLinks]

const NAV_ITEM_CLASS = 'font-body text-[var(--color-cream-soft)] font-medium text-sm whitespace-nowrap hover:opacity-80 transition-opacity'

export default function SiteHeader() {
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-50 px-4 pt-3 pb-0">
      <div
        className="mx-auto rounded-[50px] px-8 py-4"
        style={{ background: 'var(--color-brand)', maxWidth: '1589px' }}
      >
        {/* Desktop: 3-column grid keeps the logo dead-centered regardless of
            how many items live in the left vs right nav. */}
        <div className="hidden md:grid items-center" style={{ gridTemplateColumns: '1fr auto 1fr' }}>
          <nav className="flex items-center justify-end gap-8">
            {leftLinks.map((l) => (
              <a key={l.label} href={l.href} className={NAV_ITEM_CLASS}>{l.label}</a>
            ))}
          </nav>
          <a href="/" className="flex items-center justify-center px-8">
            <Image
              src="/PTP_Logo_NavBar.png"
              alt="Pass The Plate"
              width={1486}
              height={170}
              className="h-7 w-auto"
              priority
            />
          </a>
          <div className="flex items-center justify-start gap-8">
            <nav className="flex items-center gap-8">
              {rightLinks.map((l) => (
                <a key={l.label} href={l.href} className={NAV_ITEM_CLASS}>{l.label}</a>
              ))}
            </nav>
            <UserMenu />
          </div>
        </div>

        {/* Mobile: logo center, hamburger right */}
        <div className="md:hidden flex items-center justify-between">
          <span className="w-10" aria-hidden />
          <a href="/" className="flex items-center mx-auto">
            <Image
              src="/PTP_Logo_NavBar.png"
              alt="Pass The Plate"
              width={1486}
              height={170}
              className="h-7 w-auto"
              priority
            />
          </a>
          <div className="flex items-center gap-2">
            <UserMenu />
            <button
              className="text-[var(--color-cream-soft)] p-2"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                {open ? (<><line x1="4" y1="4" x2="20" y2="20"/><line x1="20" y1="4" x2="4" y2="20"/></>) : (<><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/></>)}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="md:hidden fixed inset-0 top-[72px] z-40 flex flex-col gap-6 px-8 pt-12" style={{ background: 'var(--color-brand)' }}>
          {allLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              className="font-body text-[var(--color-cream-soft)] text-3xl font-medium"
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </header>
  )
}
