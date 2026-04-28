'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { getAdminClient } from '@/lib/supabase/admin'
import { generateUniqueSlug } from '@/lib/slug'
import { sendDraftListingNotification } from '@/lib/notify'

export type CreateListingState =
  | { ok: true; slug: string }
  | { ok: false; message: string }
  | null

const INDUSTRIES = [
  'restaurant',
  'bakery',
  'grocery',
  'manufacturing',
  'catering',
] as const

const CUISINES = [
  'chinese',
  'korean',
  'vietnamese',
  'japanese',
  'thai',
  'pan_asian',
  'other',
] as const

const ASSETS = [
  'walk-in cooler',
  'walk-in freezer',
  'liquor license',
  'patio',
  'POS',
  'hood',
] as const

const URL_LIST_MAX = 6

const Schema = z.object({
  title: z.string().trim().min(5, 'Title must be at least 5 characters.').max(120),
  industry: z.enum(INDUSTRIES, { message: 'Please pick an industry.' }),
  cuisine: z.enum(CUISINES, { message: 'Please pick a cuisine.' }),
  location: z
    .string()
    .trim()
    .min(3, 'Add a location like "Brooklyn, NY".')
    .max(120),
  description: z
    .string()
    .trim()
    .min(100, 'Description should be at least 100 characters so buyers can decide.')
    .max(8000),
  askingPriceCents: z.number().int().positive('Asking price is required.'),
  annualRevenueCents: z.number().int().positive('Annual revenue is required.'),
  annualProfitCents: z.number().int().nonnegative().optional().nullable(),
  yearEstablished: z.number().int().min(1850).max(new Date().getUTCFullYear()).optional().nullable(),
  staffCount: z.number().int().min(0).max(10000).optional().nullable(),
  squareFootage: z.number().int().min(1).max(10_000_000).optional().nullable(),
  assets: z.array(z.enum(ASSETS)).max(ASSETS.length).default([]),
  coverImageUrl: z.string().url().max(2000).optional().nullable(),
  galleryUrls: z.array(z.string().url().max(2000)).max(URL_LIST_MAX).default([]),
})

function dollarsToCents(input: FormDataEntryValue | null): number | null {
  if (input === null) return null
  const raw = String(input).trim()
  if (!raw) return null
  // Strip $, comma, whitespace.
  const clean = raw.replace(/[\s,$]/g, '')
  const n = Number(clean)
  if (!Number.isFinite(n) || n < 0) return null
  return Math.round(n * 100)
}

function maybeInt(input: FormDataEntryValue | null): number | null {
  if (input === null) return null
  const raw = String(input).trim()
  if (!raw) return null
  const n = Number(raw)
  if (!Number.isFinite(n)) return null
  return Math.round(n)
}

function stringList(input: FormDataEntryValue | FormDataEntryValue[] | null): string[] {
  if (input === null) return []
  if (Array.isArray(input)) return input.map((v) => String(v).trim()).filter(Boolean)
  const s = String(input).trim()
  return s ? [s] : []
}

export async function createListing(
  _prev: CreateListingState,
  formData: FormData,
): Promise<CreateListingState> {
  const parsed = Schema.safeParse({
    title: formData.get('title'),
    industry: formData.get('industry'),
    cuisine: formData.get('cuisine'),
    location: formData.get('location'),
    description: formData.get('description'),
    askingPriceCents: dollarsToCents(formData.get('askingPrice')),
    annualRevenueCents: dollarsToCents(formData.get('annualRevenue')),
    annualProfitCents: dollarsToCents(formData.get('annualProfit')),
    yearEstablished: maybeInt(formData.get('yearEstablished')),
    staffCount: maybeInt(formData.get('staffCount')),
    squareFootage: maybeInt(formData.get('squareFootage')),
    assets: stringList(formData.getAll('assets')),
    coverImageUrl: formData.get('coverImageUrl') || null,
    galleryUrls: stringList(formData.getAll('galleryUrls')),
  })

  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message ?? 'Please check your inputs.'
    return { ok: false, message: first }
  }

  const supabase = await createClient()
  const { data: userResult } = await supabase.auth.getUser()
  if (!userResult.user) {
    return { ok: false, message: 'You must be signed in to create a listing.' }
  }
  const sellerId = userResult.user.id

  // Slug dedupe must see every listing regardless of status / owner, so
  // we use the service-role admin client. The actual INSERT goes through
  // the SSR client so RLS still validates seller_id = auth.uid().
  const admin = getAdminClient()
  const slug = await generateUniqueSlug(parsed.data.title, async (s) => {
    const { data } = await admin
      .from('listings')
      .select('id')
      .eq('slug', s)
      .maybeSingle()
    return data !== null
  })

  const insert = {
    slug,
    title: parsed.data.title,
    description: parsed.data.description,
    industry: parsed.data.industry,
    cuisine: parsed.data.cuisine,
    location: parsed.data.location,
    asking_price_cents: parsed.data.askingPriceCents,
    annual_revenue_cents: parsed.data.annualRevenueCents,
    annual_profit_cents: parsed.data.annualProfitCents ?? null,
    year_established: parsed.data.yearEstablished ?? null,
    staff_count: parsed.data.staffCount ?? null,
    square_footage: parsed.data.squareFootage ?? null,
    cover_image_url: parsed.data.coverImageUrl ?? null,
    gallery_urls: parsed.data.galleryUrls,
    assets: parsed.data.assets,
    seller_id: sellerId,
    status: 'draft' as const,
  }

  const { error } = await supabase.from('listings').insert(insert)
  if (error) {
    console.error('createListing insert error:', error)
    return {
      ok: false,
      message: "Sorry, we couldn't save that draft. Please try again.",
    }
  }

  // Await the notifier instead of void-firing it. On Vercel, server actions
  // that return immediately can have the function instance terminated before
  // a backgrounded Promise reaches the network. The other notifiers (inquiry,
  // contact, partner application) tend to win that race, but the draft path
  // returns fast enough to lose it. Costs ~200-500ms on the form submit.
  await sendDraftListingNotification({
    title: parsed.data.title,
    slug,
    sellerId,
    sellerEmail: userResult.user.email ?? null,
    industry: parsed.data.industry,
    cuisine: parsed.data.cuisine,
    location: parsed.data.location,
    askingPriceCents: parsed.data.askingPriceCents,
  })

  revalidatePath('/account')
  return { ok: true, slug }
}
