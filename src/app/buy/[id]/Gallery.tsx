'use client'
import Image from 'next/image'
import { useState } from 'react'

export default function Gallery({ cover, gallery, alt }: { cover: string; gallery: string[]; alt: string }) {
  const images = Array.from(new Set([cover, ...gallery]))
  const [active, setActive] = useState(images[0] ?? cover)

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
