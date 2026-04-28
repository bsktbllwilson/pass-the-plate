import { forwardRef } from 'react'
import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

export type InputTone = 'default' | 'auth'

// font-body is explicit here for safety — Tailwind preflight does set
// `font: inherit` on form controls so the cascade from <body> would also
// work, but pinning the brand font on the primitive is one less invariant
// to remember.
const BASE = 'font-body w-full text-base outline-none transition-colors focus:border-black/40 disabled:opacity-50'

const TONE: Record<InputTone, string> = {
  default: 'rounded-lg border border-black/15 bg-white px-4 py-3',
  auth: 'rounded-full border border-black/15 bg-[var(--color-cream-input)] px-5 py-3',
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & { tone?: InputTone }

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { tone = 'default', className, ...rest },
  ref,
) {
  return (
    <input
      {...rest}
      ref={ref}
      className={twMerge(BASE, TONE[tone], className)}
    />
  )
})

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & { tone?: InputTone }

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { tone = 'default', className, ...rest },
  ref,
) {
  return (
    <textarea
      {...rest}
      ref={ref}
      className={twMerge(BASE, TONE[tone], 'resize-y', className)}
    />
  )
})

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & { tone?: InputTone }

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { tone = 'default', className, children, ...rest },
  ref,
) {
  return (
    <select
      {...rest}
      ref={ref}
      className={twMerge(BASE, TONE[tone], 'appearance-none', className)}
    >
      {children}
    </select>
  )
})
