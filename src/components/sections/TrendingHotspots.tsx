import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import type { Listing } from '@/lib/listings'

function formatCuisine(cuisine: string): string {
  if (cuisine === 'pan_asian') return 'Pan-Asian'
  return cuisine.charAt(0).toUpperCase() + cuisine.slice(1)
}

function formatLocation(location: string): string {
  return location.replace(/,\s*NY\s*$/i, '')
}

// Compact "$1.2M / $850k / $999" form so the price doesn't wrap the
// tile or compete with the title for width. Mirrors the formatter the
// /sell ListingsMap popup uses.
function formatPrice(cents: number): string {
  if (cents <= 0) return ''
  const dollars = cents / 100
  if (dollars >= 1_000_000) {
    return `$${(dollars / 1_000_000).toFixed(2).replace(/\.?0+$/, '')}M`
  }
  if (dollars >= 1_000) {
    return `$${Math.round(dollars / 1_000)}k`
  }
  return `$${Math.round(dollars).toLocaleString('en-US')}`
}

export default function TrendingHotspots({ listings }: { listings: Listing[] }) {
  const t = useTranslations('home.trending')
  return (
    <section className="px-4 pb-20">
      <div className="mx-auto" style={{ maxWidth: '1540px' }}>
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="font-display font-medium tracking-[-0.01em]" style={{ fontSize: '60px', lineHeight: '1.1' }}>{t('heading')}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {listings.map((listing) => (
            <div key={listing.id} className="relative rounded-3xl overflow-hidden block aspect-[354/490] group" style={{ background: '#333' }}>
              {listing.cover_image_url && (
                <Image src={listing.cover_image_url} alt={listing.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  style={listing.slug === 'grandmas-noods' ? { objectPosition: '30% 40%', filter: 'grayscale(100%) brightness(1.15)' } : {}} />
              )}
              <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.55) 65%, rgba(0,0,0,0.8) 100%)' }} />
              <div className="absolute left-0 right-0 bottom-5 px-4 text-center text-white flex flex-col items-center gap-1.5">
                <div className="font-display font-medium leading-none tracking-[-0.01em]" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.375rem)' }}>{listing.title}</div>
                <div className="font-display font-medium leading-none tracking-[-0.01em]" style={{ fontSize: 'clamp(1.125rem, 1.8vw, 1.5rem)' }}>{formatPrice(listing.asking_price_cents)}</div>
                <div className="font-body text-sm tracking-[0.02em] opacity-90">{formatLocation(listing.location)} &nbsp;|&nbsp; {formatCuisine(listing.cuisine)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
