'use client'
import { useState } from 'react'
import Image from 'next/image'

const navLinks = [
  { label: 'Buy Business', href: '/buy' },
  { label: 'Sell Business', href: '/sell' },
  { label: 'Partners', href: '/partners' },
  { label: 'Playbooks', href: '/playbook' },
  { label: 'Who We Are', href: '/about' },
]

export default function SiteHeader() {
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-50 px-4 pt-3 pb-0">
      <div className="mx-auto flex items-center justify-between px-8 py-4 rounded-[50px]"
        style={{ background: 'rgb(230,80,37)', maxWidth: '1589px' }}>
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.slice(0, 2).map((l) => (
            <a key={l.label} href={l.href} className="text-[rgb(248,243,223)] font-medium text-lg whitespace-nowrap hover:opacity-80 transition-opacity" style={{ fontFamily: 'var(--font-body)' }}>{l.label}</a>
          ))}
        </nav>
        <a href="/" className="flex items-center mx-auto md:mx-0">
          <Image src="/logo-passtheplate.png" alt="Pass The Plate" width={220} height={40} className="h-9 w-auto"
            style={{ filter: 'brightness(0) saturate(100%) invert(97%) sepia(6%) saturate(1350%) hue-rotate(2deg) brightness(99%) contrast(90%)' }} priority />
        </a>
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.slice(2).map((l) => (
            <a key={l.label} href={l.href} className="text-[rgb(248,243,223)] font-medium text-lg whitespace-nowrap hover:opacity-80 transition-opacity" style={{ fontFamily: 'var(--font-body)' }}>{l.label}</a>
          ))}
        </nav>
        <button className="md:hidden text-[rgb(248,243,223)] p-2" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            {open ? (<><line x1="4" y1="4" x2="20" y2="20"/><line x1="20" y1="4" x2="4" y2="20"/></>) : (<><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/></>)}
          </svg>
        </button>
      </div>
      {open && (
        <div className="md:hidden fixed inset-0 top-[72px] z-40 flex flex-col gap-6 px-8 pt-12" style={{ background: 'rgb(230,80,37)' }}>
          {navLinks.map((l) => (
            <a key={l.label} href={l.href} onClick={() => setOpen(false)} className="text-[rgb(248,243,223)] text-3xl font-medium" style={{ fontFamily: 'var(--font-body)' }}>{l.label}</a>
          ))}
        </div>
      )}
    </header>
  )
}
