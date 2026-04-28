'use client'
import { useActionState } from 'react'
import { Button, Input } from '@/components/ui'
import { subscribeNewsletter, type SubscribeState } from '@/app/actions/newsletter'

export default function SubscribeCard() {
  const [state, action, pending] = useActionState<SubscribeState, FormData>(subscribeNewsletter, null)

  return (
    <article className="rounded-2xl overflow-hidden flex flex-col p-8" style={{ background: 'var(--color-yellow)' }}>
      {state?.ok ? (
        <div className="flex flex-col flex-1 justify-center">
          <h3 className="font-display font-medium tracking-[-0.01em] mb-3" style={{ fontSize: '1.75rem', lineHeight: '1.1' }}>
            You&apos;re on the list.
          </h3>
          <p style={{ fontSize: '1rem' }}>
            Watch your inbox — the next guide drops in a few days.
          </p>
        </div>
      ) : (
        <>
          <h3 className="font-display font-medium tracking-[-0.01em] mb-3" style={{ fontSize: '1.75rem', lineHeight: '1.1' }}>
            Subscribe For Weekly Guides
          </h3>
          <p className="mb-5" style={{ fontSize: '1rem' }}>
            Bilingual playbooks for buyers, sellers, and operators delivered every Thursday.
          </p>
          <form action={action} className="mt-auto flex flex-col gap-3">
            <input type="hidden" name="source" value="playbook" />
            <Input
              type="email"
              name="email"
              required
              placeholder="you@email.com"
            />
            <Button type="submit" variant="dark" disabled={pending}>
              {pending ? 'Subscribing…' : 'Subscribe →'}
            </Button>
            {state?.error && (
              <p className="font-body text-sm">{state.error}</p>
            )}
          </form>
        </>
      )}
    </article>
  )
}
