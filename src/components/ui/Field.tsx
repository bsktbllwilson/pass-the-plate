import type { ReactNode } from 'react'

type FieldProps = {
  label: ReactNode
  htmlFor?: string
  required?: boolean
  helper?: ReactNode
  error?: ReactNode
  children: ReactNode
  /** Use 'auth' for the cream-tinted auth-form label style. */
  tone?: 'default' | 'auth'
}

export function Field({ label, htmlFor, required, helper, error, children, tone = 'default' }: FieldProps) {
  const labelClass =
    tone === 'auth'
      ? 'font-body block text-sm font-medium mb-2 text-black/70'
      : 'font-body block text-sm font-medium mb-2'
  return (
    <div>
      <label htmlFor={htmlFor} className={labelClass}>
        {label}
        {required && <span style={{ color: 'var(--color-brand)' }}> *</span>}
        {helper && <span className="text-black/40 font-normal"> {helper}</span>}
      </label>
      {children}
      {error && (
        <p className="font-body mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}
