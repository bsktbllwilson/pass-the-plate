import Image from 'next/image'
import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { applyPlaybookPostLocale, getPosts, type PlaybookPost } from '@/lib/playbook'
import SiteHeader from '@/components/sections/SiteHeader'
import SiteFooter from '@/components/sections/SiteFooter'
import BuySellSplit from '@/components/sections/BuySellSplit'
import FindYourNextBigDeal from '@/components/sections/FindYourNextBigDeal'
import CategoryFilter from './CategoryFilter'
import SubscribeCard from './SubscribeCard'

type Params = Promise<{ locale: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'playbook' })
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  }
}

function first(v: string | string[] | undefined): string | undefined {
  if (!v) return undefined
  return Array.isArray(v) ? v[0] : v
}

type SP = { [key: string]: string | string[] | undefined }

function Pagination({ page, totalPages, pageHref }: { page: number; totalPages: number; pageHref: (n: number) => string }) {
  const t = useTranslations('common')
  return (
    <nav className="font-body mt-12 flex items-center justify-between">
      {page > 1 ? (
        <Link href={pageHref(page - 1)} className="font-medium hover:opacity-70">← {t('previousPage')}</Link>
      ) : <span className="text-black/30">← {t('previousPage')}</span>}
      <span className="text-black/55">{t('pageOf', { page, total: totalPages })}</span>
      {page < totalPages ? (
        <Link href={pageHref(page + 1)} className="font-medium hover:opacity-70">{t('nextPage')} →</Link>
      ) : <span className="text-black/30">{t('nextPage')} →</span>}
    </nav>
  )
}

function PostCard({ post }: { post: PlaybookPost }) {
  const tCat = useTranslations('playbook.categories')
  const t = useTranslations('playbook')
  let categoryLabel: string
  try {
    categoryLabel = tCat(post.category)
  } catch {
    categoryLabel = post.category
  }
  return (
    <Link
      href={`/playbook/${post.slug}`}
      className="group bg-white rounded-2xl overflow-hidden block hover:shadow-[0_4px_24px_rgba(0,0,0,0.08)] transition-shadow"
    >
      <div className="relative aspect-[16/10] bg-black/5">
        {post.cover_image_url && (
          <Image
            src={post.cover_image_url}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <span className="absolute left-4 bottom-4 px-3 py-1.5 rounded-full text-sm font-medium" style={{ background: 'var(--color-yellow)' }}>
          {categoryLabel}
        </span>
      </div>
      <div className="p-8">
        <h2 className="font-display font-medium tracking-[-0.01em] mb-3" style={{ fontSize: '2.1875rem', lineHeight: '1.15' }}>
          {post.title}
        </h2>
        {post.excerpt && (
          <p className="text-black/70 mb-5" style={{ fontSize: '1rem', lineHeight: '1.55', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {post.excerpt}
          </p>
        )}
        <span className="font-semibold border-b-2 pb-0.5" style={{ borderColor: 'var(--color-yellow)', fontSize: '1rem' }}>
          {t('readGuide')} →
        </span>
      </div>
    </Link>
  )
}

export default async function PlaybookIndexPage({ params, searchParams }: { params: Params; searchParams: Promise<SP> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const sp = await searchParams
  const t = await getTranslations({ locale, namespace: 'playbook' })

  const category = first(sp.category)
  const page = Math.max(1, Number.parseInt(first(sp.page) ?? '1', 10) || 1)

  const { rows: rawRows, totalPages } = await getPosts({ category, page, perPage: 6 })
  // Overlay any reviewed zh translations. Posts without zh content
  // show their English title / excerpt — no auto-translate for
  // editorial content; PR3c populates these manually.
  const rows = rawRows.map((r) => applyPlaybookPostLocale(r, locale))

  const baseQS = new URLSearchParams()
  for (const [k, v] of Object.entries(sp)) {
    if (k === 'page') continue
    if (Array.isArray(v)) baseQS.set(k, v.join(','))
    else if (v) baseQS.set(k, v)
  }
  const pageHref = (n: number) => {
    const next = new URLSearchParams(baseQS.toString())
    if (n > 1) next.set('page', String(n))
    return `/playbook${next.toString() ? '?' + next.toString() : ''}`
  }

  // Inject SubscribeCard after every 4th post (positions 4, 8, 12...).
  const items: ({ kind: 'post'; post: PlaybookPost } | { kind: 'subscribe' })[] = []
  rows.forEach((post, i) => {
    items.push({ kind: 'post', post })
    if ((i + 1) % 4 === 0) items.push({ kind: 'subscribe' })
  })

  return (
    <main style={{ background: 'var(--color-cream)' }}>
      <SiteHeader />

      <section className="relative w-full overflow-hidden -mt-[104px]" style={{ minHeight: '400px', height: '50vh' }}>
        <Image
          src="/images/brand/dinner_table.jpeg"
          alt={t('heroH1')}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.4) 100%)' }} />
        <div className="absolute inset-0 flex items-end">
          <h1 className="font-display pl-12 lg:pl-24 pb-12 pr-6 font-medium tracking-[-0.02em]" style={{ color: 'var(--color-cream-soft)' }}>
            {t('heroH1')}
          </h1>
        </div>
      </section>

      <section className="px-4 py-8" style={{ background: 'var(--color-cream)' }}>
        <div className="mx-auto" style={{ maxWidth: '1280px' }}>
          <CategoryFilter />
        </div>
      </section>

      <section className="px-4 py-12">
        <div className="mx-auto" style={{ maxWidth: '1280px' }}>
          {rows.length === 0 ? (
            <div className="font-body rounded-2xl bg-white border border-black/10 p-12 text-center">
              <p className="text-xl mb-2">{t('noResults')}</p>
              <p className="text-black/60">{t('noResultsHint')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {items.map((item, i) => {
                if (item.kind === 'subscribe') return <SubscribeCard key={`subscribe-${i}`} />
                return <PostCard key={item.post.slug} post={item.post} />
              })}
            </div>
          )}

          {totalPages > 1 && <Pagination page={page} totalPages={totalPages} pageHref={pageHref} />}
        </div>
      </section>

      <FindYourNextBigDeal />
      <BuySellSplit />
      <SiteFooter />
    </main>
  )
}
