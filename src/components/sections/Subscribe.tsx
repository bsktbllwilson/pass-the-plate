'use client'
import { useActionState } from 'react'
import { Button } from '@/components/ui'
import { subscribeNewsletter, type SubscribeState } from '@/app/actions/newsletter'

export default function Subscribe() {
  const [state, action, pending] = useActionState<SubscribeState, FormData>(subscribeNewsletter, null)

  return (
    <section className="px-4 py-12">
      <div className="mx-auto rounded-[80px] px-8 md:px-16 py-16 flex flex-col md:flex-row items-center md:items-start gap-10" style={{ background: 'var(--color-brand)', maxWidth: '1540px' }}>
        <div className="flex-1">
          <h2 className="font-display font-medium tracking-[-0.01em]" style={{ fontSize: '2.1875rem', lineHeight: '1', color: '#000' }}>Find Your Next Big Deal</h2>
        </div>
        <div className="flex-shrink-0 w-full md:w-[480px]">
          <p className="mb-4 leading-7" style={{ fontSize: '1.125rem', color: '#000' }}>Get in touch with our advisor for a complimentary consultation on your next venture.</p>
          {state?.ok ? (
            <div className="px-8 py-4 rounded-full text-center font-medium text-white" style={{ background: '#000' }}>Thanks — we&apos;ll be in touch!</div>
          ) : (
            <form action={action} className="flex gap-3 flex-col sm:flex-row">
              <input type="hidden" name="source" value="homepage" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                required
                className="flex-1 rounded-full px-7 py-4 text-lg font-medium outline-none border border-gray-200"
                style={{ color: '#000' }}
              />
              <Button type="submit" variant="dark" size="lg" shape="rounded" disabled={pending}>
                {pending ? 'Submitting…' : 'Get In Touch →'}
              </Button>
            </form>
          )}
          {state?.error && (
            <p className="mt-3 text-sm font-medium" style={{ color: '#000' }}>
              {state.error}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
