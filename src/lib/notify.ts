// Email notifier shared by every form action that needs to ping a human
// after a successful DB write. Inquiry / contact / newsletter all funnel
// through sendBrandEmail and degrade to a no-op + warn when env vars
// aren't set, so dev and CI environments don't need a real Resend key.
import 'server-only'
import { Resend } from 'resend'

let cached: Resend | null = null

function getResend(): Resend | null {
  if (cached) return cached
  const key = process.env.RESEND_API_KEY
  if (!key) return null
  cached = new Resend(key)
  return cached
}

function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
}

type SendArgs = {
  subject: string
  text: string
  /** Override the default to: address (e.g. partner-only inbox). */
  to?: string
  /** Reply-to header (defaults to absent). */
  replyTo?: string
}

async function sendBrandEmail({ subject, text, to, replyTo }: SendArgs): Promise<void> {
  const client = getResend()
  const from = process.env.NOTIFY_FROM_EMAIL
  const defaultTo = process.env.NOTIFY_TO_EMAIL
  const recipient = to ?? defaultTo
  if (!client || !from || !recipient) {
    console.warn('Notifier skipped: RESEND_API_KEY / NOTIFY_FROM_EMAIL / NOTIFY_TO_EMAIL not set')
    return
  }

  try {
    const { error } = await client.emails.send({
      from,
      to: recipient,
      subject,
      text,
      ...(replyTo ? { replyTo } : {}),
    })
    if (error) {
      console.error('Notifier send error:', error)
    }
  } catch (err) {
    console.error('Notifier threw:', err)
  }
}

// ── Listing inquiries ────────────────────────────────────────────────

export type InquiryNotificationPayload = {
  listingId: string
  listingTitle: string | null
  listingSlug: string | null
  buyerName: string
  buyerEmail: string
  message: string
  buyerId: string | null
}

export async function sendInquiryNotification(p: InquiryNotificationPayload): Promise<void> {
  const titleLine = p.listingTitle ?? '(listing title unavailable)'
  const linkLine = p.listingSlug ? `${siteUrl()}/buy/${p.listingSlug}` : '(no link)'
  await sendBrandEmail({
    subject: `New inquiry: ${titleLine}`,
    replyTo: p.buyerEmail,
    text: [
      'New inquiry on Pass The Plate.',
      '',
      `Listing: ${titleLine}`,
      `Link: ${linkLine}`,
      `Listing ID: ${p.listingId}`,
      '',
      `From: ${p.buyerName} <${p.buyerEmail}>`,
      `Buyer ID: ${p.buyerId ?? '(anonymous)'}`,
      '',
      'Message:',
      p.message,
    ].join('\n'),
  })
}

// Email sent to the seller (listing owner). replyTo points at the buyer
// so the seller hits Reply and goes straight to them — Pass The Plate
// stays out of the conversation past the handoff. Falls back to a no-op
// if we couldn't resolve a seller email upstream.
export type InquiryToSellerPayload = {
  sellerEmail: string
  listingTitle: string
  listingSlug: string
  buyerName: string
  buyerEmail: string
  message: string
}

export async function sendInquiryToSeller(p: InquiryToSellerPayload): Promise<void> {
  const link = `${siteUrl()}/buy/${p.listingSlug}`
  await sendBrandEmail({
    to: p.sellerEmail,
    replyTo: p.buyerEmail,
    subject: `New inquiry on your listing: ${p.listingTitle}`,
    text: [
      'A buyer is interested in your Pass The Plate listing.',
      '',
      `Listing: ${p.listingTitle}`,
      `Link: ${link}`,
      '',
      `From: ${p.buyerName} <${p.buyerEmail}>`,
      '',
      'Message:',
      p.message,
      '',
      'Reply directly to this email to respond to the buyer.',
      '— Pass The Plate',
    ].join('\n'),
  })
}

// Confirmation email sent to the buyer right after they submit. Closes
// the loop visually ("we got it, we passed it on") and gives them a
// thread to reply into if they have follow-ups.
export type InquiryConfirmationPayload = {
  buyerEmail: string
  buyerName: string
  listingTitle: string
  listingSlug: string
  message: string
}

export async function sendInquiryConfirmation(p: InquiryConfirmationPayload): Promise<void> {
  const link = `${siteUrl()}/buy/${p.listingSlug}`
  await sendBrandEmail({
    to: p.buyerEmail,
    subject: `We've received your inquiry on ${p.listingTitle}`,
    text: [
      `Hi ${p.buyerName},`,
      '',
      `Thanks for reaching out about ${p.listingTitle} on Pass The Plate. We've forwarded your message to the seller — they typically respond within 1–2 business days.`,
      '',
      `Listing: ${p.listingTitle}`,
      `Link: ${link}`,
      '',
      'Your message:',
      p.message,
      '',
      'If you have follow-up questions, just reply to this email.',
      '— Pass The Plate',
    ].join('\n'),
  })
}

// ── Contact form ─────────────────────────────────────────────────────

export type ContactNotificationPayload = {
  name: string
  email: string
  topic: string | null
  message: string
}

export async function sendContactNotification(p: ContactNotificationPayload): Promise<void> {
  const topicLine = p.topic ?? '(no topic)'
  await sendBrandEmail({
    subject: `Contact form (${topicLine}): ${p.name}`,
    replyTo: p.email,
    text: [
      'New /contact submission on Pass The Plate.',
      '',
      `From: ${p.name} <${p.email}>`,
      `Topic: ${topicLine}`,
      '',
      'Message:',
      p.message,
    ].join('\n'),
  })
}

// ── Newsletter ───────────────────────────────────────────────────────

export type NewsletterNotificationPayload = {
  email: string
  source: string | null
}

export async function sendNewsletterNotification(p: NewsletterNotificationPayload): Promise<void> {
  await sendBrandEmail({
    subject: `Newsletter signup (${p.source ?? 'unknown source'})`,
    text: [
      'New newsletter subscriber on Pass The Plate.',
      '',
      `Email: ${p.email}`,
      `Source: ${p.source ?? '(unknown)'}`,
    ].join('\n'),
  })
}

// ── Seller listing drafts ────────────────────────────────────────────

export type DraftListingNotificationPayload = {
  title: string
  slug: string
  sellerId: string
  sellerEmail: string | null
  industry: string
  cuisine: string
  location: string
  askingPriceCents: number
}

export async function sendDraftListingNotification(
  p: DraftListingNotificationPayload,
): Promise<void> {
  const askingDollars = `$${Math.round(p.askingPriceCents / 100).toLocaleString('en-US')}`
  await sendBrandEmail({
    subject: `New listing draft: ${p.title}`,
    replyTo: p.sellerEmail ?? undefined,
    text: [
      'A seller submitted a new listing draft on Pass The Plate.',
      'Review the draft in the admin queue (service-role read) before promoting to active.',
      '',
      `Title: ${p.title}`,
      `Slug: ${p.slug}`,
      `Asking: ${askingDollars}`,
      `Industry: ${p.industry}`,
      `Cuisine: ${p.cuisine}`,
      `Location: ${p.location}`,
      '',
      `Seller ID: ${p.sellerId}`,
      `Seller email: ${p.sellerEmail ?? '(unavailable)'}`,
    ].join('\n'),
  })
}

// ── Seller listing updates (edit) ────────────────────────────────────

export type ListingUpdateNotificationPayload = {
  title: string
  slug: string
  status: string
  sellerId: string
  sellerEmail: string | null
  askingPriceCents: number
}

export async function sendListingUpdateNotification(
  p: ListingUpdateNotificationPayload,
): Promise<void> {
  const askingDollars = `$${Math.round(p.askingPriceCents / 100).toLocaleString('en-US')}`
  await sendBrandEmail({
    subject: `Listing updated: ${p.title} (${p.slug})`,
    replyTo: p.sellerEmail ?? undefined,
    text: [
      'A seller edited their Pass The Plate listing.',
      '',
      `Title: ${p.title}`,
      `Slug: ${p.slug}`,
      `Status: ${p.status}`,
      `Asking: ${askingDollars}`,
      '',
      `Seller ID: ${p.sellerId}`,
      `Seller email: ${p.sellerEmail ?? '(unavailable)'}`,
      '',
      `Public link: ${siteUrl()}/buy/${p.slug}`,
    ].join('\n'),
  })
}

// ── Partner applications ─────────────────────────────────────────────

export type PartnerApplicationNotificationPayload = {
  name: string
  email: string
  phone: string | null
  company: string
  specialty: string
  website: string | null
  pitch: string
}

export async function sendPartnerApplicationNotification(
  p: PartnerApplicationNotificationPayload,
): Promise<void> {
  await sendBrandEmail({
    subject: `Partner application: ${p.company} (${p.specialty})`,
    replyTo: p.email,
    text: [
      'New partner application on Pass The Plate.',
      '',
      `Name: ${p.name}`,
      `Email: ${p.email}`,
      `Phone: ${p.phone ?? '(not provided)'}`,
      `Company: ${p.company}`,
      `Specialty: ${p.specialty}`,
      `Website: ${p.website ?? '(not provided)'}`,
      '',
      'Pitch:',
      p.pitch,
    ].join('\n'),
  })
}
