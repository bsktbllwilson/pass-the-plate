'use client'
import { useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import UserMenu from '@/components/layout/UserMenu'
import LanguageToggle from '@/components/layout/LanguageToggle'

const navHrefs = {
  buy: '/buy',
  sell: '/sell',
  partners: '/partners',
  playbook: '/playbook',
  about: '/about',
} as const

const NAV_ITEM_CLASS =
  'font-body text-[var(--color-cream-soft)] font-normal whitespace-nowrap hover:opacity-80 transition-opacity'

export default function SiteHeader() {
  const t = useTranslations('header')
  const [open, setOpen] = useState(false)

  const leftLinks: { key: keyof typeof navHrefs; label: string }[] = [
    { key: 'buy', label: t('nav.buy') },
    { key: 'sell', label: t('nav.sell') },
    { key: 'partners', label: t('nav.partners') },
  ]
  const rightLinks: { key: keyof typeof navHrefs; label: string }[] = [
    { key: 'playbook', label: t('nav.playbook') },
    { key: 'about', label: t('nav.about') },
  ]
  const allLinks = [...leftLinks, ...rightLinks]

  return (
    <header className="sticky top-0 z-50 px-4 pt-3 pb-0">
      <div
        className="mx-auto rounded-[50px] px-6 sm:px-8 py-4"
        style={{ background: 'var(--color-brand)', maxWidth: '1589px' }}
      >
        {/* Desktop: full-width flex with three flex-1 flanks. Each flank
            internally uses justify-between so items spread to its outer
            edge, with a max-width cap so wide viewports don't yawn out. */}
        <div className="hidden md:flex items-center justify-between gap-6">
          <nav
            className="flex items-center justify-between"
            style={{ flex: '1 1 0', maxWidth: '440px' }}
          >
            {leftLinks.map((l) => (
              <Link key={l.key} href={navHrefs[l.key]} className={NAV_ITEM_CLASS} style={{ fontSize: '15px' }}>
                {l.label}
              </Link>
            ))}
          </nav>
          <Link href="/" className="flex-shrink-0 flex items-center justify-center gap-3 px-4 lg:px-8">
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
              {t('subtitle')}
            </span>
          </Link>
          <div
            className="flex items-center justify-between gap-4"
            style={{ flex: '1 1 0', maxWidth: '500px' }}
          >
            <nav className="flex items-center gap-8">
              {rightLinks.map((l) => (
                <Link key={l.key} href={navHrefs[l.key]} className={NAV_ITEM_CLASS} style={{ fontSize: '15px' }}>
                  {l.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-3">
              <LanguageToggle />
              <UserMenu />
            </div>
          </div>
        </div>

        {/* Mobile: logo center, hamburger right */}
        <div className="md:hidden flex items-center justify-between">
          <span className="w-10" aria-hidden />
          <Link href="/" className="flex items-center gap-2 mx-auto">
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
              {t('subtitle')}
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <UserMenu />
            <button
              className="text-[var(--color-cream-soft)] p-2"
              onClick={() => setOpen(!open)}
              aria-label={t('menuToggle')}
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
            <Link
              key={l.key}
              href={navHrefs[l.key]}
              onClick={() => setOpen(false)}
              className="font-body text-[var(--color-cream-soft)] text-3xl font-medium"
            >
              {l.label}
            </Link>
          ))}
          <div className="pt-4">
            <LanguageToggle />
          </div>
        </div>
      )}
    </header>
  )
}
