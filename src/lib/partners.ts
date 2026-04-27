import { PARTNERS, type Partner } from '@/data/partners'

export type { Partner }

type GetPartnersOpts = {
  specialty?: string
  sort?: 'newest' | 'az' | 'za' | 'featured'
  page?: number
  perPage?: number
}

export async function getPartners(opts: GetPartnersOpts = {}): Promise<{ rows: Partner[]; totalCount: number; totalPages: number }> {
  const { specialty, sort = 'featured', page = 1, perPage = 12 } = opts

  let rows = PARTNERS.slice()
  if (specialty) rows = rows.filter(p => p.specialty === specialty)

  switch (sort) {
    case 'az':
      rows.sort((a, b) => a.full_name.localeCompare(b.full_name))
      break
    case 'za':
      rows.sort((a, b) => b.full_name.localeCompare(a.full_name))
      break
    case 'featured':
      rows.sort((a, b) => Number(b.featured) - Number(a.featured))
      break
    case 'newest':
      // No created_at on the type yet — preserve source order, which represents newest first by convention.
      break
  }

  const totalCount = rows.length
  const totalPages = Math.max(1, Math.ceil(totalCount / perPage))
  const start = (page - 1) * perPage
  const paged = rows.slice(start, start + perPage)

  return { rows: paged, totalCount, totalPages }
}

export async function getFeaturedPartners(limit: number): Promise<Partner[]> {
  return PARTNERS.filter(p => p.featured).slice(0, limit)
}
