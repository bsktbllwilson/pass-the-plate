'use client'

import { useActionState } from 'react'
import { submitInquiry, type InquiryState } from './actions'
import { Button, Input, Textarea } from '@/components/ui'

export default function InquiryForm({ listingId, listingTitle }: { listingId: string; listingTitle: string }) {
  const [state, formAction, isPending] = useActionState<InquiryState, FormData>(submitInquiry, null)

  if (state?.ok) {
    return (
      <div className="rounded-2xl border border-black/10 bg-white p-6">
        <h3 className="font-display font-medium mb-2" style={{ fontSize: '1.5rem' }}>Inquiry sent</h3>
        <p style={{ color: 'rgba(0,0,0,0.7)' }}>
          Thanks — we&apos;ll forward your message about <strong>{listingTitle}</strong> to the seller.
        </p>
      </div>
    )
  }

  return (
    <form action={formAction} className="rounded-2xl border border-black/10 bg-white p-6">
      <h3 className="font-display font-medium mb-4" style={{ fontSize: '1.5rem' }}>Inquire about this business</h3>
      <input type="hidden" name="listingId" value={listingId} />
      <div className="space-y-3">
        <Input
          type="text"
          name="name"
          required
          maxLength={120}
          placeholder="Your name"
        />
        <Input
          type="email"
          name="email"
          required
          maxLength={254}
          placeholder="Email"
        />
        <Textarea
          name="message"
          required
          maxLength={4000}
          placeholder="What would you like to know about this business?"
          rows={4}
        />
        {state?.error && (
          <p className="text-sm" style={{ color: 'var(--color-brand)' }}>
            {state.error}
          </p>
        )}
        <Button type="submit" disabled={isPending} fullWidth>
          {isPending ? 'Sending…' : 'Send Inquiry →'}
        </Button>
      </div>
    </form>
  )
}
