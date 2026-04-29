// Hardcoded geocoding lookup for the seed listings.
// Coordinates are [longitude, latitude] in Mapbox order.
//
// This is a stopgap until either:
//   (a) listings get persisted lat/lng columns from a real geocoder
//       (Mapbox Geocoding, Google Places, etc.), or
//   (b) sellers pick locations from a constrained set of pre-geocoded
//       neighborhoods at /sell/new submission time.
//
// Keys MUST match the canonical `location` text exactly as the seed +
// any future free-form seller submissions store it. Today every active
// seed listing uses the `{Neighborhood}, {Borough}, NY` shape.
//
// When a listing has a location not in this map, getCoordsForLocation
// returns null and the map silently skips that pin (with a server
// console.warn so missing entries surface in logs).
export const NEIGHBORHOOD_COORDS: Record<string, [number, number]> = {
  'Flushing, Queens, NY': [-73.8333, 40.7677],
  'Chinatown, Manhattan, NY': [-73.9970, 40.7158],
  'Elmhurst, Queens, NY': [-73.8800, 40.7373],
  'Long Island City, Queens, NY': [-73.9442, 40.7447],
  'Lower East Side, Manhattan, NY': [-73.9870, 40.7150],
  'Sunset Park, Brooklyn, NY': [-74.0030, 40.6450],
  'Williamsburg, Brooklyn, NY': [-73.9571, 40.7081],
  'Midtown East, Manhattan, NY': [-73.9700, 40.7549],
}

export function getCoordsForLocation(location: string): [number, number] | null {
  const direct = NEIGHBORHOOD_COORDS[location]
  if (direct) return direct
  console.warn(`[geocode-nyc] no coords for location "${location}"`)
  return null
}
