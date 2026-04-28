'use client'
import Image from 'next/image'
import { useState } from 'react'

export default function Gallery({ cover, gallery, alt }: { cover: string; gallery: string[]; alt: string }) {
  // Drop any empty strings (drafts may not have a cover yet, and gallery
  // entries are always non-empty by validation but defend against the
  // legacy seed data shape).
  const images = Array.from(new Set([cover, ...gallery])).filter((s): s is string => Boolean(s))
  const [active, setActive] = useState(images[0] ?? '')

  if (images.length === 0) {
    return (
      <div
        className="relative w-full aspect-[16/9] rounded-3xl overflow-hidden flex items-center justify-center font-body"
        style={{ background: 'var(--color-cream-input)', color: 'rgba(0,0,0,0.45)' }}
      >
        <span className="text-sm uppercase tracking-wider">No photos yet</span>
      </div>
    )
  }

  return (
    <div>
      <div className="relative w-full aspect-[16/9] rounded-3xl overflow-hidden bg-black/5">
        <Image src={active} alt={alt} fill sizes="(max-width: 1024px) 100vw, 1200px" className="object-cover" priority />
      </div>
      {images.length > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto">
          {images.map(src => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(src)}
              className={`relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-colors ${active === src ? 'border-black' : 'border-transparent'}`}
              aria-label={`Show ${alt} image`}
            >
              <Image src={src} alt={alt} fill sizes="96px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
