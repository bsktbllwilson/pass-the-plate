'use server'

import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

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

  const supabase = await createClient()
  const { data: userResult } = await supabase.auth.getUser()
  const buyerId = userResult.user ? userResult.user.id : null

  const { error } = await supabase.from('listing_inquiries').insert({
    listing_id: result.data.listingId,
    buyer_id: buyerId,
    buyer_name: result.data.name,
    buyer_email: result.data.email,
    message: result.data.message,
  })

  if (error) {
    console.error('submitInquiry error:', error)
    return { ok: false, error: "Sorry, we couldn't send that just now. Please try again." }
  }

  return { ok: true }
}
