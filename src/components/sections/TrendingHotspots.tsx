import Image from 'next/image'
import type { Listing } from '@/lib/listings'

function formatCuisine(cuisine: string): string {
  if (cuisine === 'pan_asian') return 'Pan-Asian'
  return cuisine.charAt(0).toUpperCase() + cuisine.slice(1)
}

function formatLocation(location: string): string {
  return location.replace(/,\s*NY\s*$/i, '')
}

export default function TrendingHotspots({ listings }: { listings: Listing[] }) {
  return (
    <section className="px-4 pb-20">
      <div className="mx-auto" style={{ maxWidth: '1540px' }}>
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="font-medium tracking-[-0.01em]" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3.375rem)' }}>Trending Hotspots</h2>
          <a href="/buy" className="font-medium text-black/55 hover:text-black transition-colors text-lg hidden md:block" style={{ fontFamily: 'var(--font-body)' }}>More Listings →</a>
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
              <div className="absolute left-0 right-0 bottom-14 text-center text-white font-medium leading-none tracking-[-0.01em] px-4" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 3vw, 2.375rem)' }}>{listing.title}</div>
              <div className="absolute left-0 right-0 bottom-5 text-center text-white text-sm tracking-[0.02em]" style={{ fontFamily: 'var(--font-body)' }}>{formatLocation(listing.location)} &nbsp;|&nbsp; {formatCuisine(listing.cuisine)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
