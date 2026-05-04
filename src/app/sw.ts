/// <reference lib="webworker" />
import { defaultCache } from '@serwist/next/worker'
import type { PrecacheEntry, SerwistGlobalConfig } from 'serwist'
import { Serwist } from 'serwist'
import {
  CacheFirst,
  ExpirationPlugin,
  NetworkFirst,
  StaleWhileRevalidate,
} from 'serwist'

// Augments the worker scope with the Serwist precache injection point
// (__SW_MANIFEST) plus the standard ServiceWorkerGlobalScope.
declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined
  }
}

declare const self: ServiceWorkerGlobalScope & {
  __SW_MANIFEST: (PrecacheEntry | string)[] | undefined
}

// Caching strategy summary (per founder spec):
//
//   stale-while-revalidate — frequently-updated content surfaces.
//     /buy listings, /partners directory, /playbook articles.
//     Returns the cached response immediately, refreshes the cache in
//     the background. Fast first paint, eventually-consistent data.
//
//   cache-first — static assets and images.
//     /_next/static/*, /images/*, /icons/*, fonts. Long max-age.
//
//   network-first — form-driven pages.
//     /sell/new, /contact, anything with a server action that needs
//     fresh data. Tries network first, falls back to cache after a
//     timeout.
//
// Anything not matched by these falls through to defaultCache (Serwist's
// sensible runtime defaults — assets, fonts, images, JSON, etc.).
const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  // skipWaiting + clientsClaim: a new SW takes control immediately as
  // soon as the user taps "tap to refresh" in the UpdateToast. Without
  // these, users would stay on the previous SW until every tab is
  // closed.
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  disableDevLogs: true,
  // Custom routes layered before the default cache list. Order matters:
  // Serwist evaluates routes top-to-bottom and stops at the first match.
  runtimeCaching: [
    {
      // /sell/new and /contact — network-first so server-action redirects
      // and validation messages always reflect live state. Falls back
      // to cache after 3s (intermittent connection on a subway, plane).
      matcher: ({ url }) =>
        url.pathname.startsWith('/sell/new') ||
        url.pathname.startsWith('/zh/sell/new') ||
        url.pathname.startsWith('/contact') ||
        url.pathname.startsWith('/zh/contact'),
      handler: new NetworkFirst({
        cacheName: 'ptp-forms',
        networkTimeoutSeconds: 3,
        plugins: [
          new ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 60 * 60 }),
        ],
      }),
    },
    {
      // /buy, /partners, /playbook navigation requests — SWR.
      matcher: ({ url, request }) =>
        request.mode === 'navigate' &&
        (url.pathname.startsWith('/buy') ||
          url.pathname.startsWith('/zh/buy') ||
          url.pathname.startsWith('/partners') ||
          url.pathname.startsWith('/zh/partners') ||
          url.pathname.startsWith('/playbook') ||
          url.pathname.startsWith('/zh/playbook')),
      handler: new StaleWhileRevalidate({
        cacheName: 'ptp-content-pages',
        plugins: [
          new ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 60 * 60 * 24 }),
        ],
      }),
    },
    {
      // Supabase Storage images (cover + gallery photos) — cache-first
      // with a generous TTL since signed URLs change rarely and the
      // photos themselves don't.
      matcher: ({ url }) => url.hostname.endsWith('.supabase.co') && url.pathname.includes('/storage/'),
      handler: new CacheFirst({
        cacheName: 'ptp-supabase-images',
        plugins: [
          new ExpirationPlugin({ maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 }),
        ],
      }),
    },
    ...defaultCache,
  ],
  // Offline fallback. The /offline page is precached as part of the
  // Next.js build manifest; navigations that fail (no network, no
  // cache hit) get served this URL. Same fallback for both locales —
  // the offline page itself reads the active locale from the URL it
  // was navigated from.
  fallbacks: {
    entries: [
      {
        url: '/offline',
        matcher: ({ request }) => request.destination === 'document',
      },
    ],
  },
})

serwist.addEventListeners()
