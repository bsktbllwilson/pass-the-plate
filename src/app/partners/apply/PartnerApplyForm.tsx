'use client'
import { useActionState } from 'react'
import { Button, Field, Input, Select, Textarea } from '@/components/ui'
import { submitPartnerApplication, type ApplyState } from './actions'

const SPECIALTIES: { value: string; label: string }[] = [
  { value: 'sba_lender', label: 'SBA Lender' },
  { value: 'immigration_attorney', label: 'Immigration Attorney' },
  { value: 'bilingual_broker', label: 'Bilingual Business Broker' },
  { value: 'business_broker', label: 'Business Broker' },
  { value: 'business_attorney', label: 'Business Attorney' },
  { value: 'cpa', label: 'CPA / Accountant' },
  { value: 'other', label: 'Other' },
]

export default function PartnerApplyForm() {
  const [state, action, pending] = useActionState<ApplyState, FormData>(submitPartnerApplication, null)

  if (state?.ok) {
    return (
      <div className="rounded-2xl bg-white border border-black/10 p-8">
        <h2 className="font-display font-medium mb-3" style={{ fontSize: '2rem' }}>
          Application received
        </h2>
        <p
          className="font-body"
          style={{ fontSize: '1.0625rem', lineHeight: '1.6', color: 'rgba(0,0,0,0.7)' }}
        >
          Thanks for applying — we&apos;ll review and get back within five business days.
        </p>
      </div>
    )
  }

  return (
    <form action={action} className="rounded-2xl bg-white border border-black/10 p-8 space-y-4">
      <Field label="Full Name" htmlFor="name" required>
        <Input id="name" name="name" type="text" required maxLength={120} />
      </Field>
      <Field label="Email" htmlFor="email" required>
        <Input id="email" name="email" type="email" required maxLength={254} />
      </Field>
      <Field label="Phone" htmlFor="phone">
        <Input id="phone" name="phone" type="tel" maxLength={30} placeholder="(optional)" />
      </Field>
      <Field label="Company" htmlFor="company" required>
        <Input id="company" name="company" type="text" required maxLength={120} />
      </Field>
      <Field label="Specialty" htmlFor="specialty" required>
        <Select id="specialty" name="specialty" required defaultValue="">
          <option value="" disabled>Choose a specialty…</option>
          {SPECIALTIES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </Select>
      </Field>
      <Field label="Website" htmlFor="website">
        <Input id="website" name="website" type="url" maxLength={254} placeholder="https://… (optional)" />
      </Field>
      <Field
        label="What do you bring to Pass The Plate?"
        htmlFor="pitch"
        required
        helper="(20–4000 characters)"
      >
        <Textarea
          id="pitch"
          name="pitch"
          rows={6}
          required
          minLength={20}
          maxLength={4000}
          placeholder="Tell us about your experience with Asian F&B businesses, the languages you speak, and how you'd help our buyers and sellers."
        />
      </Field>
      {state && !state.ok && state.message && (
        <p className="font-body text-sm text-red-600">{state.message}</p>
      )}
      <Button type="submit" disabled={pending} fullWidth>
        {pending ? 'Sending…' : 'Submit Application →'}
      </Button>
    </form>
  )
}
