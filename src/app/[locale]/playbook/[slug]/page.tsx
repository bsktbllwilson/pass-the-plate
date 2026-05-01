import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { content } from '@/lib/content'
import { applyPlaybookPostLocale, getPostBySlug, getRelatedPosts } from '@/lib/playbook'
import SiteHeader from '@/components/sections/SiteHeader'
import SiteFooter from '@/components/sections/SiteFooter'
import BuySellSplit from '@/components/sections/BuySellSplit'
import FindYourNextBigDeal from '@/components/sections/FindYourNextBigDeal'
import Markdown from './Markdown'
import { categoryLabel, dateFmt } from '../labels'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) {
    return {
      title: 'Guide Not Found — Pass The Plate',
      robots: { index: false, follow: false },
    }
  }
  const description = post.excerpt ?? undefined
  const url = `/playbook/${post.slug}`
  const images = post.cover_image_url ? [{ url: post.cover_image_url, alt: post.title }] : undefined
  return {
    title: `${post.title} — Pass The Plate`,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title: post.title,
      description,
      images,
      publishedTime: post.published_at ?? undefined,
      authors: post.author_name ? [post.author_name] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: post.cover_image_url ? [post.cover_image_url] : undefined,
    },
  }
}

export default async function PlaybookPostPage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await params
  const rawPost = await getPostBySlug(slug)
  if (!rawPost) notFound()
  const post = applyPlaybookPostLocale(rawPost, locale)

  const rawRelated = await getRelatedPosts(slug, 3)
  const related = rawRelated.map((r) => applyPlaybookPostLocale(r, locale))
  const published = post.published_at ? dateFmt.format(new Date(post.published_at)) : ''

  return (
    <main style={{ background: 'var(--color-cream)' }}>
      <SiteHeader />

      <article className="px-4 py-12">
        <div className="mx-auto" style={{ maxWidth: '768px' }}>
          <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-black/5">
            {post.cover_image_url && (
              <Image
                src={post.cover_image_url}
                alt={post.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
              />
            )}
          </div>

          <div className="mt-8">
            <span className="inline-block px-3 py-1.5 rounded-full text-sm font-medium" style={{ background: 'var(--color-yellow)' }}>
              {categoryLabel(post.category)}
            </span>
          </div>

          <h1 className="font-display font-medium tracking-[-0.02em] mt-6" style={{ fontSize: '3.875rem', lineHeight: '1.05' }}>
            {post.title}
          </h1>

          <div className="mt-4 text-black/55" style={{ fontSize: '0.95rem' }}>
            {post.author_name}{published && ` · ${published}`}
          </div>

          <div className="mt-10">
            <Markdown>{post.body_md}</Markdown>
          </div>

          {related.length > 0 && (
            <>
              <hr className="my-16 border-black/10" />
              <section>
                <h2 className="font-display font-medium tracking-[-0.01em] mb-8" style={{ fontSize: '2.1875rem', lineHeight: '1.15' }}>
                  Related Reads
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {related.map(r => (
                    <Link
                      key={r.slug}
                      href={`/playbook/${r.slug}`}
                      className="group bg-white rounded-2xl overflow-hidden block hover:shadow-[0_4px_24px_rgba(0,0,0,0.08)] transition-shadow"
                    >
                      <div className="relative aspect-[16/10] bg-black/5">
                        {r.cover_image_url && (
                          <Image src={r.cover_image_url} alt={r.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                        )}
                      </div>
                      <div className="p-5">
                        <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium mb-3" style={{ background: 'var(--color-yellow)' }}>
                          {categoryLabel(r.category)}
                        </span>
                        <h3 className="font-display font-medium tracking-[-0.01em]" style={{ fontSize: '1.25rem', lineHeight: '1.2' }}>
                          {r.title}
                        </h3>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            </>
          )}
        </div>
      </article>

      <FindYourNextBigDeal />
      <BuySellSplit />
      <SiteFooter />
    </main>
  )
}
