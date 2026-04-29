import type { NextConfig } from 'next'

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

export default nextConfig
