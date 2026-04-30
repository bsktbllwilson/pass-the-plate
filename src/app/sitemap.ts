import type { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'
import { routing } from '@/i18n/routing'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.passtheplate.store'

const STATIC_ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
  { path: '/', priority: 1, changeFrequency: 'weekly' },
  { path: '/buy', priority: 0.9, changeFrequency: 'daily' },
  { path: '/sell', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/partners', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/partners/apply', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/playbook', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/about', priority: 0.5, changeFrequency: 'monthly' },
  { path: '/contact', priority: 0.5, changeFrequency: 'monthly' },
]

// Build the locale-prefixed URL for a given path. Default locale (en)
// is unprefixed per next-intl's `as-needed` rule, matching what the
// router actually serves.
function localizedUrl(path: string, locale: string): string {
  if (locale === routing.defaultLocale) return `${SITE_URL}${path}`
  // Avoid `/zh/` (with trailing slash) for the homepage since the
  // canonical is `/zh`.
  if (path === '/') return `${SITE_URL}/${locale}`
  return `${SITE_URL}/${locale}${path}`
}

// Per-URL hreflang alternates. Required by Google to avoid the
// duplicate-content penalty when /buy and /zh/buy serve the same
// page in different languages.
function alternatesFor(path: string): { languages: Record<string, string> } {
  const languages: Record<string, string> = {}
  for (const locale of routing.locales) {
    const tag = locale === 'zh' ? 'zh-CN' : locale
    languages[tag] = localizedUrl(path, locale)
  }
  // x-default points at the default locale URL.
  languages['x-default'] = localizedUrl(path, routing.defaultLocale)
  return { languages }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  const supabase = await createClient()

  const [{ data: listings }, { data: posts }] = await Promise.all([
    supabase.from('listings').select('slug, updated_at').eq('status', 'active'),
    supabase.from('playbook_posts').select('slug, published_at').eq('published', true),
  ])

  const entries: MetadataRoute.Sitemap = []

  // Static routes — emit one entry per locale, each with hreflang
  // alternates pointing at every other locale's version.
  for (const route of STATIC_ROUTES) {
    for (const locale of routing.locales) {
      entries.push({
        url: localizedUrl(route.path, locale),
        lastModified: now,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        alternates: alternatesFor(route.path),
      })
    }
  }

  // Listing detail pages — same pattern. Listing CONTENT stays in the
  // seller's submitted language, but the URL routes through both
  // locales because the page chrome (header, footer, metadata) is
  // localized.
  for (const l of listings ?? []) {
    const path = `/buy/${l.slug}`
    for (const locale of routing.locales) {
      entries.push({
        url: localizedUrl(path, locale),
        lastModified: l.updated_at ? new Date(l.updated_at) : now,
        changeFrequency: 'weekly',
        priority: 0.8,
        alternates: alternatesFor(path),
      })
    }
  }

  // Playbook posts — same.
  for (const p of posts ?? []) {
    const path = `/playbook/${p.slug}`
    for (const locale of routing.locales) {
      entries.push({
        url: localizedUrl(path, locale),
        lastModified: p.published_at ? new Date(p.published_at) : now,
        changeFrequency: 'monthly',
        priority: 0.6,
        alternates: alternatesFor(path),
      })
    }
  }

  return entries
}
