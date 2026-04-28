import { createClient } from '@/lib/supabase/server'

export type InquiryStatus = 'pending' | 'accepted' | 'rejected'

export type InquiryWithListing = {
  id: string
  status: string | null
  message: string | null
  buyer_name: string | null
  created_at: string | null
  listing: {
    id: string
    title: string
    slug: string
    location: string | null
    cuisine: string | null
    cover_image_url: string | null
  } | null
}

/**
 * Returns the inquiries the current authenticated user has submitted, newest
 * first. RLS ensures we only see rows where buyer_id = auth.uid(); callers
 * MUST be invoked from a route already gated by requireUser().
 */
export async function getMyInquiries(): Promise<InquiryWithListing[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('listing_inquiries')
    .select(
      'id, status, message, buyer_name, created_at, listings(id, title, slug, location, cuisine, cover_image_url)',
    )
    .order('created_at', { ascending: false, nullsFirst: false })
  if (error) {
    console.error('getMyInquiries error:', error)
    return []
  }
  // PostgREST returns embedded foreign-key reads as arrays even for many-to-one.
  // Flatten to a single nullable listing here so consumers don't have to.
  return (data ?? []).map((row) => {
    const listings = row.listings
    const listing = Array.isArray(listings) ? listings[0] ?? null : listings
    return {
      id: row.id,
      status: row.status,
      message: row.message,
      buyer_name: row.buyer_name,
      created_at: row.created_at,
      listing,
    }
  })
}
