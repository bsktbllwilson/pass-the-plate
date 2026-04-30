'use client'
import { useLocale } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'
import { routing, type Locale } from '@/i18n/routing'
import { useTransition } from 'react'

// Visible, prominent EN | 中文 toggle for the nav. The Chinese
// character is the brand's #1 differentiator vs BizBuySell, so this
// switch is meant to be loud — not a subtle dropdown. The active
// locale gets cream-on-orange weight; the inactive one is muted.
//
// Hidden entirely when only one locale is enabled (i.e. zh disabled
// in production via NEXT_PUBLIC_ENABLE_ZH=false). Keeps the nav
// uncluttered until the Chinese version is ready to ship live.
export default function LanguageToggle({ className = '' }: { className?: string }) {
  const locale = useLocale() as Locale
  const pathname = usePathname()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  // Hide if only one locale is configured.
  if (routing.locales.length < 2) return null

  function switchTo(next: Locale) {
    if (next === locale) return
    startTransition(() => {
      // Pass `locale` as the second arg so next-intl reroutes to the
      // same path under the new locale prefix. usePathname() returns
      // the path without the locale prefix already.
      router.replace(pathname, { locale: next })
    })
  }

  const buttonBase =
    'font-display font-medium leading-none px-3 py-1 rounded-full transition-colors disabled:opacity-50'

  return (
    <div
      role="group"
      aria-label="Language"
      className={`inline-flex items-center gap-1 rounded-full border border-[var(--color-cream-soft)]/60 px-1 py-0.5 ${className}`}
      style={{ fontSize: '15px' }}
    >
      <button
        type="button"
        onClick={() => switchTo('en')}
        disabled={isPending}
        aria-pressed={locale === 'en'}
        className={`${buttonBase} ${
          locale === 'en'
            ? 'bg-[var(--color-cream-soft)] text-[var(--color-brand)]'
            : 'text-[var(--color-cream-soft)] hover:text-white'
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => switchTo('zh')}
        disabled={isPending}
        aria-pressed={locale === 'zh'}
        className={`${buttonBase} ${
          locale === 'zh'
            ? 'bg-[var(--color-cream-soft)] text-[var(--color-brand)]'
            : 'text-[var(--color-cream-soft)] hover:text-white'
        }`}
      >
        中文
      </button>
    </div>
  )
}
