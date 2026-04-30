import { defineRouting } from 'next-intl/routing'

// Path-based routing. Default locale (en) is unprefixed (/, /buy);
// non-default locales use a prefix (/zh, /zh/buy). This is the
// 'as-needed' mode in next-intl. Required for SEO so /zh/buy and
// /buy index as separate URLs in Google.
//
// /zh is gated behind NEXT_PUBLIC_ENABLE_ZH so it's reachable in
// Vercel previews (founder's QA) but invisible in production until
// PR2 / PR3 land translation content.
const ZH_ENABLED = process.env.NEXT_PUBLIC_ENABLE_ZH === 'true'

export const routing = defineRouting({
  locales: ZH_ENABLED ? ['en', 'zh'] : ['en'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
})

export type Locale = (typeof routing.locales)[number]
