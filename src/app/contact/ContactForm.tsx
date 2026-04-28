'use client'
import { useActionState } from 'react'
import { submitContact, type ContactState } from './actions'
import { Button, Field, Input, Select, Textarea } from '@/components/ui'

const TOPICS = [
  'Buying a Business',
  'Selling a Business',
  'Membership',
  'Partnership',
  'Press',
  'Other',
]

export default function ContactForm() {
  const [state, action, pending] = useActionState<ContactState, FormData>(submitContact, null)

  if (state?.ok) {
    return (
      <div className="rounded-2xl bg-white border border-black/10 p-8">
        <h2 className="font-display font-medium mb-3" style={{ fontSize: '1.875rem' }}>
          Message sent
        </h2>
        <p style={{ fontSize: '1.0625rem', lineHeight: '1.6', color: 'rgba(0,0,0,0.7)' }}>
          Thanks — we&apos;ll be in touch within one business day.
        </p>
      </div>
    )
  }

  return (
    <form action={action} className="rounded-2xl bg-white border border-black/10 p-8 space-y-4">
      <Field label="Full Name" htmlFor="name" required>
        <Input id="name" name="name" type="text" required />
      </Field>
      <Field label="Email" htmlFor="email" required>
        <Input id="email" name="email" type="email" required />
      </Field>
      <Field label="Topic" htmlFor="topic" required>
        <Select id="topic" name="topic" required defaultValue="">
          <option value="" disabled>Choose a topic…</option>
          {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
        </Select>
      </Field>
      <Field label="Message" htmlFor="message" required>
        <Textarea id="message" name="message" rows={6} required />
      </Field>
      {state && !state.ok && state.message && (
        <p className="font-body text-sm text-red-600">
          {state.message}
        </p>
      )}
      <Button type="submit" disabled={pending} fullWidth>
        {pending ? 'Sending…' : 'Send Message →'}
      </Button>
    </form>
  )
}
