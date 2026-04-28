import 'server-only'
import { Resend } from 'resend'

export type InquiryNotificationPayload = {
  listingId: string
  listingTitle: string | null
  listingSlug: string | null
  buyerName: string
  buyerEmail: string
  message: string
  buyerId: string | null
}

let cached: Resend | null = null

function getResend(): Resend | null {
  if (cached) return cached
  const key = process.env.RESEND_API_KEY
  if (!key) return null
  cached = new Resend(key)
  return cached
}

export async function sendInquiryNotification(p: InquiryNotificationPayload): Promise<void> {
  const client = getResend()
  const to = process.env.INQUIRY_NOTIFICATION_TO
  const from = process.env.INQUIRY_NOTIFICATION_FROM
  if (!client || !to || !from) {
    console.warn('Inquiry notification skipped: Resend env vars missing')
    return
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  const titleLine = p.listingTitle ?? '(listing title unavailable)'
  const linkLine = p.listingSlug ? `${baseUrl}/buy/${p.listingSlug}` : '(no link)'
  const subject = `New inquiry: ${titleLine}`
  const text = [
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
  ].join('\n')

  try {
    const { emails } = client
    const { error } = await emails.send({ from, to, subject, text })
    if (error) {
      console.error('Inquiry notification send error:', error)
    }
  } catch (err) {
    console.error('Inquiry notification threw:', err)
  }
}
