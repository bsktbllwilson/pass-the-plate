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

const NAV_ITEM_CLASS =
  'font-body text-[var(--color-cream-soft)] font-normal whitespace-nowrap hover:opacity-80 transition-opacity'

export default function SiteHeader() {
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-50 px-4 pt-3 pb-0">
      <div
        className="mx-auto rounded-[50px] px-6 sm:px-8 py-4"
        style={{ background: 'var(--color-brand)', maxWidth: '1589px' }}
      >
        {/* Desktop: full-width flex with three flex-1 flanks. Each flank
            internally uses justify-between so items spread to its outer
            edge, with a max-width cap so wide viewports don't yawn out. */}
        <div className="hidden md:flex items-center justify-between gap-8">
          <nav
            className="flex items-center justify-between"
            style={{ flex: '1 1 0', maxWidth: '440px' }}
          >
            {leftLinks.map((l) => (
              <a key={l.label} href={l.href} className={NAV_ITEM_CLASS} style={{ fontSize: '15px' }}>
                {l.label}
              </a>
            ))}
          </nav>
          <a href="/" className="flex-shrink-0 flex items-center justify-center gap-3 px-6 lg:px-12">
            <Image
              src="/PTP_Logo_NavBar.png"
              alt="Pass The Plate"
              width={1486}
              height={170}
              className="h-7 w-auto"
              priority
            />
            <span
              aria-hidden="true"
              className="font-display text-[var(--color-cream-soft)] leading-none tracking-wide hidden sm:inline-block"
              style={{ fontSize: '20px', fontWeight: 500 }}
            >
              传盘
            </span>
          </a>
          <div
            className="flex items-center justify-between"
            style={{ flex: '1 1 0', maxWidth: '440px' }}
          >
            {rightLinks.map((l) => (
              <a key={l.label} href={l.href} className={NAV_ITEM_CLASS} style={{ fontSize: '15px' }}>
                {l.label}
              </a>
            ))}
            <UserMenu />
          </div>
        </div>

        {/* Mobile: logo center, hamburger right */}
        <div className="md:hidden flex items-center justify-between">
          <span className="w-10" aria-hidden />
          <a href="/" className="flex items-center gap-2 mx-auto">
            <Image
              src="/PTP_Logo_NavBar.png"
              alt="Pass The Plate"
              width={1486}
              height={170}
              className="h-7 w-auto"
              priority
            />
            <span
              aria-hidden="true"
              className="font-display text-[var(--color-cream-soft)] leading-none tracking-wide"
              style={{ fontSize: '18px', fontWeight: 500 }}
            >
              传盘
            </span>
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
