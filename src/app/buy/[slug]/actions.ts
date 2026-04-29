'use server'

import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { getAdminClient } from '@/lib/supabase/admin'
import {
  sendInquiryNotification,
  sendInquiryToSeller,
  sendInquiryConfirmation,
} from '@/lib/notify'

export type InquiryState = { ok: boolean; error?: string } | null

const Schema = z.object({
  listingId: z.string().uuid(),
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  message: z.string().trim().min(1).max(4000),
})

export async function submitInquiry(
  _prev: InquiryState,
  formData: FormData,
): Promise<InquiryState> {
  const result = Schema.safeParse({
    listingId: formData.get('listingId'),
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
  })
  if (!result.success) {
    return { ok: false, error: 'Please check your name, email, and message.' }
  }

  const input = result.data
  const supabase = await createClient()
  const { data: userResult } = await supabase.auth.getUser()
  const buyerId = userResult.user ? userResult.user.id : null

  const { error: insertError } = await supabase.from('listing_inquiries').insert({
    listing_id: input.listingId,
    buyer_id: buyerId,
    buyer_name: input.name,
    buyer_email: input.email,
    message: input.message,
  })

  if (insertError) {
    console.error('submitInquiry error:', insertError)
    return { ok: false, error: "Sorry, we couldn't send that just now. Please try again." }
  }

  const { data: listing } = await supabase
    .from('listings')
    .select('title, slug, seller_id')
    .eq('id', input.listingId)
    .maybeSingle()

  // Resolve the seller's email via the admin client. Wrapped in try because
  // legacy seed listings have null seller_id, and a missing service-role
  // env var should degrade to "skip the seller email" — never 500 the form.
  let sellerEmail: string | null = null
  if (listing?.seller_id) {
    try {
      const admin = getAdminClient()
      const { data, error } = await admin.auth.admin.getUserById(listing.seller_id)
      if (!error && data?.user?.email) sellerEmail = data.user.email
    } catch (err) {
      console.warn('Inquiry seller email lookup failed:', err)
    }
  }

  // All three notifies run in parallel and are awaited so Vercel doesn't
  // terminate the function before the Resend HTTP call resolves. Each
  // sender swallows its own errors internally, so Promise.all won't reject.
  await Promise.all([
    sendInquiryNotification({
      listingId: input.listingId,
      listingTitle: listing ? listing.title : null,
      listingSlug: listing ? listing.slug : null,
      buyerName: input.name,
      buyerEmail: input.email,
      message: input.message,
      buyerId,
    }),
    sellerEmail && listing?.title && listing?.slug
      ? sendInquiryToSeller({
          sellerEmail,
          listingTitle: listing.title,
          listingSlug: listing.slug,
          buyerName: input.name,
          buyerEmail: input.email,
          message: input.message,
        })
      : Promise.resolve(),
    listing?.title && listing?.slug
      ? sendInquiryConfirmation({
          buyerEmail: input.email,
          buyerName: input.name,
          listingTitle: listing.title,
          listingSlug: listing.slug,
          message: input.message,
        })
      : Promise.resolve(),
  ])

  return { ok: true }
}
