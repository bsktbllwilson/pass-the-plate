import type { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.passtheplate.store'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Crawl restrictions cover both unprefixed (default-locale) and
      // /zh-prefixed paths so Google doesn't index account / auth
      // surfaces in either language.
      disallow: [
        '/account',
        '/zh/account',
        '/verify',
        '/zh/verify',
        '/api/',
        '/auth/',
        '/zh/auth/',
        '/sign-in',
        '/zh/sign-in',
        '/sign-up',
        '/zh/sign-up',
        '/forgot-password',
        '/zh/forgot-password',
        '/reset-password',
        '/zh/reset-password',
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
