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
