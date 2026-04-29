'use client'

import 'mapbox-gl/dist/mapbox-gl.css'

import Image from 'next/image'
import Link from 'next/link'
import MapboxMap, {
  Marker,
  NavigationControl,
  Popup,
  type MapRef,
} from 'react-map-gl/mapbox'
import { useMemo, useRef, useState } from 'react'
import { getCoordsForLocation } from '@/lib/geocode-nyc'
import type { ListingForMap } from '@/lib/listings'

type PinnedListing = ListingForMap & {
  lng: number
  lat: number
}

const NYC_CENTER: [number, number] = [-73.95, 40.72]
const INITIAL_ZOOM = 10
const STYLE_URL = 'mapbox://styles/mapbox/light-v11'
const JITTER_RADIUS = 0.0006 // ~50–60m, enough to separate pins at the same neighborhood

function formatPrice(cents: number | null): string {
  if (!cents || cents <= 0) return '—'
  const dollars = cents / 100
  if (dollars >= 1_000_000) {
    return `$${(dollars / 1_000_000).toFixed(2).replace(/\.?0+$/, '')}M`
  }
  if (dollars >= 1_000) {
    return `$${Math.round(dollars / 1_000)}k`
  }
  return `$${Math.round(dollars).toLocaleString('en-US')}`
}

function formatLocation(location: string): string {
  // Strip the trailing ", NY" so the popup pill reads "Flushing, Queens"
  // instead of "Flushing, Queens, NY".
  return location.replace(/,\s*NY\s*$/i, '')
}

function formatCuisine(cuisine: string | null): string {
  if (!cuisine) return ''
  if (cuisine === 'pan_asian') return 'Pan-Asian'
  return cuisine.charAt(0).toUpperCase() + cuisine.slice(1)
}

/**
 * Spread out pins that share coordinates so each is clickable.
 * Deterministic per index so the position is stable across renders.
 */
function jitter([lng, lat]: [number, number], occurrenceIndex: number): [number, number] {
  if (occurrenceIndex === 0) return [lng, lat]
  // Walk a small clockwise circle: NE, E, SE, S, SW, W, NW, N…
  const angle = (occurrenceIndex - 1) * (Math.PI / 4)
  return [lng + Math.cos(angle) * JITTER_RADIUS, lat + Math.sin(angle) * JITTER_RADIUS]
}

export default function ListingsMap({ listings }: { listings: ListingForMap[] }) {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
  const mapRef = useRef<MapRef | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const pinned = useMemo<PinnedListing[]>(() => {
    const seen = new Map<string, number>()
    const out: PinnedListing[] = []
    for (const l of listings) {
      const coords = getCoordsForLocation(l.location)
      if (!coords) continue
      const key = `${coords[0]}|${coords[1]}`
      const occurrence = seen.get(key) ?? 0
      seen.set(key, occurrence + 1)
      const [lng, lat] = jitter(coords, occurrence)
      out.push({ ...l, lng, lat })
    }
    return out
  }, [listings])

  const selected = pinned.find((p) => p.id === selectedId) ?? null

  // No token -> render the same yellow surface but with a polite fallback
  // instead of letting Mapbox blow up (it throws when the token is missing).
  if (!token) {
    return (
      <div className="w-full rounded-2xl overflow-hidden flex items-center justify-center font-body text-sm text-black/55"
           style={{ height: 'clamp(400px, 48vw, 480px)', background: 'rgba(0,0,0,0.04)' }}>
        Map unavailable
      </div>
    )
  }

  return (
    <div className="relative w-full rounded-2xl overflow-hidden"
         style={{ height: 'clamp(400px, 48vw, 480px)' }}>
      <MapboxMap
        ref={mapRef}
        mapboxAccessToken={token}
        mapStyle={STYLE_URL}
        initialViewState={{
          longitude: NYC_CENTER[0],
          latitude: NYC_CENTER[1],
          zoom: INITIAL_ZOOM,
        }}
        dragRotate={false}
        pitchWithRotate={false}
        touchPitch={false}
        onClick={() => setSelectedId(null)}
      >
        <NavigationControl position="top-right" showCompass={false} />

        {pinned.map((p) => (
          <Marker
            key={p.id}
            longitude={p.lng}
            latitude={p.lat}
            anchor="bottom"
            onClick={(e) => {
              // Prevent the Map onClick handler (which clears the popup).
              e.originalEvent.stopPropagation()
              setSelectedId(p.id)
            }}
          >
            <button
              type="button"
              aria-label={`View ${p.title}`}
              className="ListingsMap__pin"
            />
          </Marker>
        ))}

        {selected && (
          <Popup
            longitude={selected.lng}
            latitude={selected.lat}
            anchor="bottom"
            offset={20}
            closeButton={false}
            closeOnClick={false}
            onClose={() => setSelectedId(null)}
            className="ListingsMap__popup"
            maxWidth="280px"
          >
            <div className="font-body" style={{ width: '280px' }}>
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                aria-label="Close"
                className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-white/95 border border-black/10 flex items-center justify-center text-base leading-none text-black/70 hover:text-black"
              >
                ×
              </button>

              {selected.cover_image_url && (
                <div className="relative w-full aspect-[16/10] bg-black/5">
                  <Image
                    src={selected.cover_image_url}
                    alt={selected.title}
                    fill
                    sizes="280px"
                    className="object-cover rounded-t-2xl"
                  />
                </div>
              )}

              <div className="p-4 space-y-2">
                <h4
                  className="font-display font-medium tracking-[-0.01em]"
                  style={{ fontSize: '1.125rem', lineHeight: '1.2' }}
                >
                  {selected.title}
                </h4>
                <div className="text-xs text-black/55">
                  {formatLocation(selected.location)}
                  {selected.cuisine ? `  ·  ${formatCuisine(selected.cuisine)}` : ''}
                </div>
                <div
                  className="font-display font-medium pt-1"
                  style={{ fontSize: '1rem' }}
                >
                  {formatPrice(selected.asking_price_cents)} asking
                </div>
                <Link
                  href={`/buy/${selected.slug}`}
                  className="font-body block w-full text-center rounded-full text-white font-medium px-4 py-2.5 mt-3 hover:opacity-90 transition-opacity"
                  style={{ background: 'var(--color-brand)', fontSize: '0.9375rem' }}
                >
                  View Listing →
                </Link>
              </div>
            </div>
          </Popup>
        )}
      </MapboxMap>
    </div>
  )
}
