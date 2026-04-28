'use client'

import { useActionState } from 'react'
import { submitInquiry, type InquiryState } from './actions'

export default function InquiryForm({ listingId, listingTitle }: { listingId: string; listingTitle: string }) {
  const [state, formAction, isPending] = useActionState<InquiryState, FormData>(submitInquiry, null)

  if (state?.ok) {
    return (
      <div className="rounded-2xl border border-black/10 bg-white p-6">
        <h3 className="font-medium mb-2" style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>Inquiry sent</h3>
        <p style={{ fontFamily: 'var(--font-body)', color: 'rgba(0,0,0,0.7)' }}>
          Thanks — we&apos;ll forward your message about <strong>{listingTitle}</strong> to the seller.
        </p>
      </div>
    )
  }

  return (
    <form action={formAction} className="rounded-2xl border border-black/10 bg-white p-6">
      <h3 className="font-medium mb-4" style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>Inquire about this business</h3>
      <input type="hidden" name="listingId" value={listingId} />
      <div className="space-y-3">
        <input
          type="text"
          name="name"
          required
          maxLength={120}
          placeholder="Your name"
          className="w-full px-4 py-3 rounded-lg border border-black/15 bg-white outline-none focus:border-black/40"
          style={{ fontFamily: 'var(--font-body)', fontSize: '1rem' }}
        />
        <input
          type="email"
          name="email"
          required
          maxLength={254}
          placeholder="Email"
          className="w-full px-4 py-3 rounded-lg border border-black/15 bg-white outline-none focus:border-black/40"
          style={{ fontFamily: 'var(--font-body)', fontSize: '1rem' }}
        />
        <textarea
          name="message"
          required
          maxLength={4000}
          placeholder="What would you like to know about this business?"
          rows={4}
          className="w-full px-4 py-3 rounded-lg border border-black/15 bg-white outline-none focus:border-black/40 resize-y"
          style={{ fontFamily: 'var(--font-body)', fontSize: '1rem' }}
        />
        {state?.error && (
          <p className="text-sm" style={{ color: 'rgb(230,78,33)', fontFamily: 'var(--font-body)' }}>
            {state.error}
          </p>
        )}
        <button
          type="submit"
          disabled={isPending}
          className="w-full py-3 rounded-full text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          style={{ background: 'rgb(230,78,33)', fontFamily: 'var(--font-body)', fontSize: '1rem' }}
        >
          {isPending ? 'Sending…' : 'Send Inquiry →'}
        </button>
      </div>
    </form>
  )
}
