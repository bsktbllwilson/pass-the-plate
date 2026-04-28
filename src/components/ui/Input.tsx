import { forwardRef } from 'react'
import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

export type InputTone = 'default' | 'auth'

const BASE = 'w-full text-base outline-none transition-colors focus:border-black/40 disabled:opacity-50'

const TONE: Record<InputTone, string> = {
  default: 'rounded-lg border border-black/15 bg-white px-4 py-3',
  auth: 'rounded-full border border-black/15 bg-[var(--color-cream-input)] px-5 py-3',
}

const FONT_STYLE = { fontFamily: 'var(--font-body)' } as const

type InputProps = InputHTMLAttributes<HTMLInputElement> & { tone?: InputTone }

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { tone = 'default', className, style, ...rest },
  ref,
) {
  return (
    <input
      {...rest}
      ref={ref}
      className={twMerge(BASE, TONE[tone], className)}
      style={{ ...FONT_STYLE, ...style }}
    />
  )
})

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & { tone?: InputTone }

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { tone = 'default', className, style, ...rest },
  ref,
) {
  return (
    <textarea
      {...rest}
      ref={ref}
      className={twMerge(BASE, TONE[tone], 'resize-y', className)}
      style={{ ...FONT_STYLE, ...style }}
    />
  )
})

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & { tone?: InputTone }

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { tone = 'default', className, style, children, ...rest },
  ref,
) {
  return (
    <select
      {...rest}
      ref={ref}
      className={twMerge(BASE, TONE[tone], 'appearance-none', className)}
      style={{ ...FONT_STYLE, ...style }}
    >
      {children}
    </select>
  )
})
