import type { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  const supabase = await createClient()

  const [{ data: listings }, { data: posts }] = await Promise.all([
    supabase
      .from('listings')
      .select('slug, updated_at')
      .eq('status', 'active'),
    supabase
      .from('playbook_posts')
      .select('slug, published_at')
      .eq('published', true),
  ])

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }))

  const listingEntries: MetadataRoute.Sitemap = (listings ?? []).map((l) => ({
    url: `${SITE_URL}/buy/${l.slug}`,
    lastModified: l.updated_at ? new Date(l.updated_at) : now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const postEntries: MetadataRoute.Sitemap = (posts ?? []).map((p) => ({
    url: `${SITE_URL}/playbook/${p.slug}`,
    lastModified: p.published_at ? new Date(p.published_at) : now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...staticEntries, ...listingEntries, ...postEntries]
}
