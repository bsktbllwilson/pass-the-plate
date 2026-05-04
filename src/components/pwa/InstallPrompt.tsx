'use client'
import { useEffect, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'

// Add-to-Home-Screen flow with three branches:
//
//   1. Chromium / Android — listen for the beforeinstallprompt event
//      and offer a custom CTA that calls prompt() on user tap.
//
//   2. iOS Safari — no programmatic API. Show an instruction modal
//      telling the user to tap Share → Add to Home Screen. Only fires
//      on iOS Safari (not iOS Chrome / Firefox, which can't install).
//
//   3. WeChat in-app browser — neither of the above works (WeChat
//      sandbox blocks A2HS on iOS). Show a one-time hint in Mandarin
//      asking the user to open the link in Safari/Chrome. Suppress
//      the install CTA entirely.
//
// Feature-flagged via NEXT_PUBLIC_PWA_INSTALL_ENABLED. While the
// placeholder icons are in place, the founder wants the prompt off
// in production. Set NEXT_PUBLIC_PWA_INSTALL_ENABLED=true in the
// preview environment to QA.

const DISMISS_KEY = 'ptp:install-dismissed'
const WECHAT_HINT_KEY = 'ptp:wechat-hint-shown'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

type Mode = 'idle' | 'chromium' | 'ios' | 'wechat' | 'installed'

function detectMode(): Mode {
  if (typeof window === 'undefined') return 'idle'

  // Already installed — running in standalone display mode.
  const standalone =
    window.matchMedia?.('(display-mode: standalone)').matches ||
    // Safari iOS sets navigator.standalone outside the spec
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  if (standalone) return 'installed'

  const ua = navigator.userAgent || ''
  if (/MicroMessenger/i.test(ua)) return 'wechat'

  // iOS Safari: iPhone/iPad Safari, NOT Chrome/Firefox-on-iOS.
  // CriOS = Chrome on iOS, FxiOS = Firefox on iOS — those can't A2HS.
  const isIOS = /iPad|iPhone|iPod/.test(ua) && !('MSStream' in window)
  const isCriOSorFxiOS = /CriOS|FxiOS/i.test(ua)
  if (isIOS && !isCriOSorFxiOS) return 'ios'

  // Default to 'idle' until beforeinstallprompt fires (if ever).
  return 'idle'
}

export default function InstallPrompt() {
  const locale = useLocale()
  const t = useTranslations('pwa.install')
  const [mode, setMode] = useState<Mode>('idle')
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showIosModal, setShowIosModal] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [wechatHintShown, setWechatHintShown] = useState(true)

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_PWA_INSTALL_ENABLED !== 'true') return

    setDismissed(localStorage.getItem(DISMISS_KEY) === '1')
    setWechatHintShown(localStorage.getItem(WECHAT_HINT_KEY) === '1')

    const initial = detectMode()
    setMode(initial)

    function onBeforeInstall(e: Event) {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setMode('chromium')
    }
    function onInstalled() {
      setMode('installed')
      localStorage.setItem(DISMISS_KEY, '1')
    }
    window.addEventListener('beforeinstallprompt', onBeforeInstall)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  // WeChat: show the "open in Safari/Chrome" hint once per browser
  // origin, then suppress. Auto-dismisses after 8 seconds.
  useEffect(() => {
    if (mode !== 'wechat' || wechatHintShown) return
    const timer = setTimeout(() => {
      localStorage.setItem(WECHAT_HINT_KEY, '1')
      setWechatHintShown(true)
    }, 8000)
    return () => clearTimeout(timer)
  }, [mode, wechatHintShown])

  if (process.env.NEXT_PUBLIC_PWA_INSTALL_ENABLED !== 'true') return null
  if (mode === 'idle' || mode === 'installed') return null
  if (dismissed && mode !== 'wechat') return null

  function handleChromiumInstall() {
    if (!deferredPrompt) return
    void deferredPrompt.prompt()
    deferredPrompt.userChoice.then(() => {
      setDeferredPrompt(null)
      localStorage.setItem(DISMISS_KEY, '1')
      setDismissed(true)
    })
  }

  function dismissCta() {
    localStorage.setItem(DISMISS_KEY, '1')
    setDismissed(true)
  }

  function dismissWechatHint() {
    localStorage.setItem(WECHAT_HINT_KEY, '1')
    setWechatHintShown(true)
  }

  // ── WeChat hint (Mandarin copy regardless of active locale, since
  //     this is specifically targeting WeChat users) ──────────────
  if (mode === 'wechat') {
    if (wechatHintShown) return null
    return (
      <div
        role="status"
        aria-live="polite"
        className="fixed left-1/2 -translate-x-1/2 z-[60] rounded-full shadow-lg flex items-center gap-3 px-5 py-3 max-w-[90vw]"
        style={{ background: '#000', color: 'var(--color-cream-soft)', top: 'calc(env(safe-area-inset-top, 0px) + 80px)', fontSize: '14px' }}
      >
        <span style={{ fontFamily: 'source-han-sans-traditional, sans-serif' }}>
          {locale === 'zh' ? t('wechatHint') : '请在 Safari 或 Chrome 中打开以安装到主屏幕'}
        </span>
        <button type="button" onClick={dismissWechatHint} aria-label="Dismiss" className="opacity-70 hover:opacity-100">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="4" y1="4" x2="20" y2="20"/>
            <line x1="20" y1="4" x2="4" y2="20"/>
          </svg>
        </button>
      </div>
    )
  }

  // ── Chromium / Android: visible CTA pill ────────────────────────
  if (mode === 'chromium') {
    return (
      <div
        className="md:hidden fixed left-1/2 -translate-x-1/2 z-[55] flex items-center gap-2 rounded-full shadow-lg px-4 py-2"
        style={{ background: 'var(--color-brand)', color: '#fff', bottom: 'calc(env(safe-area-inset-bottom, 0px) + 16px)' }}
      >
        <button type="button" onClick={handleChromiumInstall} className="font-medium text-sm flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          {t('ctaShort')}
        </button>
        <button type="button" onClick={dismissCta} aria-label="Dismiss" className="opacity-80 hover:opacity-100 ml-1">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="4" y1="4" x2="20" y2="20"/>
            <line x1="20" y1="4" x2="4" y2="20"/>
          </svg>
        </button>
      </div>
    )
  }

  // ── iOS Safari: instruction modal ───────────────────────────────
  // No programmatic install API on iOS; the user has to do it manually
  // via the Share sheet. Show a CTA pill that opens an explainer modal.
  if (mode === 'ios') {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIosModal(true)}
          className="md:hidden fixed left-1/2 -translate-x-1/2 z-[55] flex items-center gap-2 rounded-full shadow-lg px-4 py-2 font-medium text-sm"
          style={{ background: 'var(--color-brand)', color: '#fff', bottom: 'calc(env(safe-area-inset-bottom, 0px) + 16px)' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <polyline points="16 6 12 2 8 6" />
            <line x1="12" y1="2" x2="12" y2="15" />
          </svg>
          {t('ctaShort')}
        </button>
        {showIosModal && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.55)' }}
            onClick={(e) => { if (e.target === e.currentTarget) setShowIosModal(false) }}
          >
            <div className="rounded-3xl bg-white max-w-md w-full p-6 sm:p-8">
              <h2 className="font-display font-medium mb-3">{t('iosTitle')}</h2>
              <p className="mb-6" style={{ color: 'rgba(0,0,0,0.7)' }}>
                {t('iosBody')}
              </p>
              <button
                type="button"
                onClick={() => { setShowIosModal(false); dismissCta() }}
                className="w-full rounded-full py-3 font-medium"
                style={{ background: 'var(--color-brand)', color: '#fff' }}
              >
                {t('iosClose')}
              </button>
            </div>
          </div>
        )}
      </>
    )
  }

  return null
}
