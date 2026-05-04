'use client'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'

// Registers /sw.js on mount and surfaces a "new version available"
// toast when a new SW finishes installing in the background. Tapping
// the toast tells the new SW to skipWaiting and reloads — the SW
// itself was built with skipWaiting + clientsClaim so the second
// reload picks up the new bundle immediately.
//
// Renders nothing on the server. Only registers in production builds
// (next.config disables Serwist in dev).
export default function ServiceWorkerRegister() {
  const t = useTranslations('pwa.update')
  const [waiting, setWaiting] = useState<ServiceWorker | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!('serviceWorker' in navigator)) return
    if (process.env.NODE_ENV !== 'production') return

    // WeChat in-app browser ships a service worker stub that fails to
    // register cleanly. Catch the error so the page keeps rendering.
    const ua = navigator.userAgent || ''
    if (/MicroMessenger/i.test(ua)) return

    let cancelled = false

    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then((reg) => {
        if (cancelled) return

        // Worker already installed and waiting (e.g. tab reopened
        // after a deploy) — surface the toast immediately.
        if (reg.waiting) setWaiting(reg.waiting)

        reg.addEventListener('updatefound', () => {
          const installing = reg.installing
          if (!installing) return
          installing.addEventListener('statechange', () => {
            if (
              installing.state === 'installed' &&
              navigator.serviceWorker.controller
            ) {
              setWaiting(installing)
            }
          })
        })
      })
      .catch((err) => {
        // Don't crash the page on registration failure (older browsers,
        // restrictive iframes, WeChat-style stubs that we missed).
        console.warn('Service worker registration failed:', err)
      })

    let reloading = false
    function onControllerChange() {
      if (reloading) return
      reloading = true
      window.location.reload()
    }
    navigator.serviceWorker.addEventListener('controllerchange', onControllerChange)

    return () => {
      cancelled = true
      navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange)
    }
  }, [])

  function applyUpdate() {
    if (!waiting) return
    waiting.postMessage({ type: 'SKIP_WAITING' })
    // The SW's own skipWaiting() activates the new worker; the
    // controllerchange listener above triggers the actual reload.
  }

  if (!waiting) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed left-1/2 -translate-x-1/2 z-[60] rounded-full shadow-lg flex items-center gap-3 px-5 py-3"
      style={{ background: '#000', color: 'var(--color-cream-soft)', bottom: 'calc(env(safe-area-inset-bottom, 0px) + 16px)' }}
    >
      <span className="text-sm">{t('message')}</span>
      <button
        type="button"
        onClick={applyUpdate}
        className="rounded-full px-4 py-1 text-sm font-medium"
        style={{ background: 'var(--color-cream-soft)', color: '#000' }}
      >
        {t('action')}
      </button>
    </div>
  )
}
