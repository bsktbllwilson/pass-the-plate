export type Testimonial = {
  id: string
  quote: string
  name: string
  role: string
  city: string
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'helen-park',
    quote:
      'We had serious buyer conversations in our first week. Pass The Plate brought in people who actually understood hospitality deals.',
    name: 'Helen Park',
    role: 'Bakery Owner',
    city: 'Brooklyn, NY',
  },
  {
    id: 'jin-wei-chen',
    quote:
      'I listed in Mandarin from my phone. Sold in 90 days. Could not have done this on the English-only sites.',
    name: 'Jin Wei Chen',
    role: 'Restaurant Owner',
    city: 'Flushing, NY',
  },
  {
    id: 'minh-tran',
    quote:
      'The valuation walk-through made the asking price defensible. Two of our three serious buyers came pre-qualified through their SBA partner.',
    name: 'Minh Tran',
    role: 'Pho House Operator',
    city: 'Sunset Park, NY',
  },
  {
    id: 'sora-kim',
    quote:
      'Twelve years of receipts, all reviewed by an advisor who spoke Korean. The diligence checklist alone saved me weeks of back-and-forth.',
    name: 'Sora Kim',
    role: 'Cafe Owner',
    city: 'Long Island City, NY',
  },
]
