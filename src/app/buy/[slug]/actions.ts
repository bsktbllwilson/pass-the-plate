'use server'

import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { sendInquiryNotification } from '@/lib/notify'

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
    .select('title, slug')
    .eq('id', input.listingId)
    .maybeSingle()

  void sendInquiryNotification({
    listingId: input.listingId,
    listingTitle: listing ? listing.title : null,
    listingSlug: listing ? listing.slug : null,
    buyerName: input.name,
    buyerEmail: input.email,
    message: input.message,
    buyerId,
  })

  return { ok: true }
}
