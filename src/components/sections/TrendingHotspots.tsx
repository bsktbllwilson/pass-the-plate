import Image from 'next/image'
import type { Listing } from '@/lib/listings'

const CUISINE_LABEL: Record<Listing['cuisine'], string> = {
  chinese: 'Chinese',
  japanese: 'Japanese',
  korean: 'Korean',
  vietnamese: 'Vietnamese',
  thai: 'Thai',
  pan_asian: 'Pan-Asian',
}

export default function TrendingHotspots({ listings }: { listings: Listing[] }) {
  return (
    <section className="px-4 pb-20">
      <div className="mx-auto" style={{ maxWidth: '1540px' }}>
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="font-medium tracking-[-0.01em]" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3.375rem)' }}>Trending Hotspots</h2>
          <a href="#" className="font-medium text-black/55 hover:text-black transition-colors text-lg hidden md:block" style={{ fontFamily: 'var(--font-body)' }}>More Listings →</a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {listings.map((listing) => (
            <a key={listing.id} href={`/listings/${listing.id}`} className="relative rounded-3xl overflow-hidden block aspect-[354/490] group" style={{ background: '#333' }}>
              <Image src={listing.cover_image_url} alt={listing.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                style={listing.id === 'grandmas-noods' ? { objectPosition: '30% 40%', filter: 'grayscale(100%) brightness(1.15)' } : {}} />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.55) 65%, rgba(0,0,0,0.8) 100%)' }} />
              <div className="absolute left-0 right-0 bottom-14 text-center text-white font-medium leading-none tracking-[-0.01em] px-4" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 3vw, 2.375rem)' }}>{listing.title}</div>
              <div className="absolute left-0 right-0 bottom-5 text-center text-white text-sm tracking-[0.02em]" style={{ fontFamily: 'var(--font-body)' }}>{listing.city}, {listing.state} &nbsp;|&nbsp; {CUISINE_LABEL[listing.cuisine]}</div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
