import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'
import withSerwistInit from '@serwist/next'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

// Service worker pipeline. Reads src/app/sw.ts (TypeScript SW source),
// emits a bundled service worker at /public/sw.js plus the precache
// manifest. Skipped in dev to avoid stale-cache headaches while the
// SW is iterated; full SW + caching only runs in production builds.
const withSerwist = withSerwistInit({
  swSrc: 'src/app/sw.ts',
  swDest: 'public/sw.js',
  reloadOnOnline: true,
  // SW disabled in dev (set to true via env if you need to debug it
  // locally with `pnpm build && pnpm start`).
  disable: process.env.NODE_ENV === 'development',
})

// Pull the Supabase project hostname out of the env so next/image can
// load Storage-served images (cover + gallery on /buy and /account).
// Falls back to a wildcard *.supabase.co pattern for preview deploys
// where the env var may not be set at build time.
const supabaseHost = (() => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url) return null
  try {
    return new URL(url).hostname
  } catch {
    return null
  }
})()

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Hard-pinned production project hostname. Belt-and-suspenders next to
      // the env-derived block below: guarantees /_next/image accepts uploaded
      // cover/gallery images even if NEXT_PUBLIC_SUPABASE_URL isn't visible
      // at the build step or the wildcard match below misses.
      {
        protocol: 'https' as const,
        hostname: 'kqsbsvwlvkiptswtlmli.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      ...(supabaseHost
        ? [
            {
              protocol: 'https' as const,
              hostname: supabaseHost,
              pathname: '/storage/v1/object/public/**',
            },
          ]
        : []),
      // Next.js 16 documents '**.example.com' (double-star) as the canonical
      // subdomain wildcard form. Use it here so any other supabase project
      // (preview branches, future migrations) still gets picked up.
      {
        protocol: 'https' as const,
        hostname: '**.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
}

export default withSerwist(withNextIntl(nextConfig))
