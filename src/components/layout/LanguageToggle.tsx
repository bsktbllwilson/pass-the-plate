'use client'
import { useLocale } from 'next-intl'
import { useTransition } from 'react'
import { usePathname, useRouter } from '@/i18n/navigation'
import { routing, type Locale } from '@/i18n/routing'

// Circular EN | 中 toggle for the nav. Pill container in brand
// orange with a cream-soft border; each button is a 32px circle.
// Active locale = filled cream / brand-orange text. Inactive =
// muted cream-soft text. Hidden when only one locale is enabled
// (NEXT_PUBLIC_ENABLE_ZH=false in production).
export default function LanguageToggle() {
  const locale = useLocale() as Locale
  const pathname = usePathname()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  if (routing.locales.length < 2) return null

  function switchTo(next: Locale) {
    if (next === locale) return
    // Set <html lang> immediately so the :lang(zh) CSS rule applies
    // before next-intl finishes the route change. zh-TW matches the
    // Source Han Sans Traditional font licensed in the Typekit kit.
    if (typeof document !== 'undefined') {
      document.documentElement.lang = next === 'zh' ? 'zh-TW' : 'en'
    }
    startTransition(() => {
      router.replace(pathname, { locale: next })
    })
  }

  const baseBtn =
    'flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors disabled:opacity-50'

  return (
    <div
      role="group"
      aria-label="Language"
      className="inline-flex items-center rounded-full border border-[#f8f3de]/40 bg-[#e64e21] p-0.5"
    >
      <button
        type="button"
        onClick={() => switchTo('en')}
        disabled={isPending}
        aria-pressed={locale === 'en'}
        aria-label="English"
        className={`${baseBtn} ${
          locale === 'en'
            ? 'bg-[#f8f3de] text-[#e64e21]'
            : 'text-[#f8f3de]/80 hover:text-[#f8f3de]'
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => switchTo('zh')}
        disabled={isPending}
        aria-pressed={locale === 'zh'}
        aria-label="中文"
        className={`${baseBtn} ${
          locale === 'zh'
            ? 'bg-[#f8f3de] text-[#e64e21]'
            : 'text-[#f8f3de]/80 hover:text-[#f8f3de]'
        }`}
      >
        中
      </button>
    </div>
  )
}
