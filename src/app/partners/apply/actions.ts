'use server'

import { z } from 'zod'
import { getAnonClient } from '@/lib/supabase/anon'
import { sendPartnerApplicationNotification } from '@/lib/notify'

export type ApplyState = { ok: boolean; message?: string } | null

const SPECIALTIES = [
  'sba_lender',
  'immigration_attorney',
  'bilingual_broker',
  'cpa',
  'business_attorney',
  'business_broker',
  'other',
] as const

const Schema = z.object({
  name: z.string().trim().min(1, 'Please enter your name.').max(120),
  email: z.string().trim().toLowerCase().email('Please enter a valid email.').max(254),
  phone: z.string().trim().min(1).max(30).optional().nullable(),
  company: z.string().trim().min(1, 'Please enter your company.').max(120),
  specialty: z.enum(SPECIALTIES, { message: 'Please pick a specialty.' }),
  website: z
    .string()
    .trim()
    .min(1)
    .max(254)
    .optional()
    .nullable(),
  pitch: z
    .string()
    .trim()
    .min(20, 'Tell us a bit more — at least 20 characters.')
    .max(4000, 'Pitch is too long.'),
})

function nullable(value: FormDataEntryValue | null): string | null {
  if (value === null) return null
  const s = String(value).trim()
  return s ? s : null
}

export async function submitPartnerApplication(
  _prev: ApplyState,
  formData: FormData,
): Promise<ApplyState> {
  const result = Schema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    phone: nullable(formData.get('phone')),
    company: formData.get('company'),
    specialty: formData.get('specialty'),
    website: nullable(formData.get('website')),
    pitch: formData.get('pitch'),
  })

  if (!result.success) {
    const first = result.error.issues[0]?.message ?? 'Please check your inputs.'
    return { ok: false, message: first }
  }

  const input = result.data
  const supabase = getAnonClient()
  const { error } = await supabase.from('partner_applications').insert({
    name: input.name,
    email: input.email,
    phone: input.phone ?? null,
    company: input.company,
    specialty: input.specialty,
    website: input.website ?? null,
    pitch: input.pitch,
  })

  if (error) {
    console.error('submitPartnerApplication error:', error)
    return { ok: false, message: "Sorry, we couldn't send that just now. Please try again." }
  }

  void sendPartnerApplicationNotification({
    name: input.name,
    email: input.email,
    phone: input.phone ?? null,
    company: input.company,
    specialty: input.specialty,
    website: input.website ?? null,
    pitch: input.pitch,
  })

  return { ok: true }
}
