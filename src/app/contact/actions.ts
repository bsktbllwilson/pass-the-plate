'use server'

import { z } from 'zod'
import { getAnonClient } from '@/lib/supabase/anon'

export type ContactState = { ok: boolean; message?: string } | null

const Schema = z.object({
  name: z.string().trim().min(1, 'Please enter your name.').max(120),
  email: z.string().trim().toLowerCase().email('Please enter a valid email.').max(254),
  topic: z.string().trim().min(1).max(80).optional().nullable(),
  message: z.string().trim().min(1, 'Please add a message.').max(4000),
})

export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const result = Schema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    topic: formData.get('topic'),
    message: formData.get('message'),
  })

  if (!result.success) {
    const first = result.error.issues[0]?.message ?? 'Please check your inputs.'
    return { ok: false, message: first }
  }

  const supabase = getAnonClient()
  const { error } = await supabase.from('contact_messages').insert({
    name: result.data.name,
    email: result.data.email,
    topic: result.data.topic ?? null,
    message: result.data.message,
  })

  if (error) {
    console.error('submitContact error:', error)
    return { ok: false, message: "Sorry, we couldn't send that just now. Please try again." }
  }

  return { ok: true }
}
