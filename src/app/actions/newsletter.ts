'use server'

import { z } from 'zod'
import { getAnonClient } from '@/lib/supabase/anon'
import { sendNewsletterNotification } from '@/lib/notify'

export type SubscribeState = { ok: boolean; error?: string } | null

const Schema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  source: z.string().trim().max(50).optional().nullable(),
})

export async function subscribeNewsletter(
  _prev: SubscribeState,
  formData: FormData,
): Promise<SubscribeState> {
  const result = Schema.safeParse({
    email: formData.get('email'),
    source: formData.get('source'),
  })
  if (!result.success) {
    return { ok: false, error: 'Please enter a valid email.' }
  }

  const supabase = getAnonClient()
  // Idempotent insert: ignore the unique-violation on email so we never tell
  // the caller "this email was already subscribed" — that would be a
  // membership oracle for anyone curious whether a given address is on file.
  // .select() returns the inserted rows (empty array for duplicates), which
  // we use server-side only to avoid notifying on already-subscribed emails.
  const { data, error } = await supabase
    .from('newsletter_subscribers')
    .upsert(
      { email: result.data.email, source: result.data.source ?? null },
      { onConflict: 'email', ignoreDuplicates: true },
    )
    .select()

  if (error) {
    console.error('subscribeNewsletter error:', error)
    // Same generic ack — don't leak DB-level failures to the form either.
    return { ok: true }
  }

  const isNewSignup = (data?.length ?? 0) > 0
  if (isNewSignup) {
    void sendNewsletterNotification({
      email: result.data.email,
      source: result.data.source ?? null,
    })
  }

  return { ok: true }
}
