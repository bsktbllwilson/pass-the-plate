import Link from 'next/link'
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

export type ButtonVariant = 'primary' | 'inverse' | 'dark'
export type ButtonSize = 'sm' | 'md' | 'lg'
export type ButtonShape = 'pill' | 'rounded'

type StyleArgs = {
  variant?: ButtonVariant
  size?: ButtonSize
  shape?: ButtonShape
  fullWidth?: boolean
}

const SIZE: Record<ButtonSize, string> = {
  sm: 'px-5 py-2.5 text-sm',
  md: 'px-7 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
}

const SHAPE: Record<ButtonShape, string> = {
  pill: 'rounded-full',
  rounded: 'rounded-3xl',
}

const VARIANT_STYLE: Record<ButtonVariant, CSSProperties> = {
  primary: { background: 'var(--color-brand)', color: '#fff' },
  inverse: { background: 'var(--color-cream-soft)', color: 'var(--color-brand)' },
  dark: { background: '#000', color: '#fff' },
}

const BASE = 'inline-flex items-center justify-center gap-2 font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed'

function classes({ size = 'md', shape = 'pill', fullWidth }: StyleArgs, extra?: string) {
  return twMerge(BASE, SIZE[size], SHAPE[shape], fullWidth && 'w-full', extra)
}

function styleFor({ variant = 'primary' }: StyleArgs, extra?: CSSProperties): CSSProperties {
  return { fontFamily: 'var(--font-body)', ...VARIANT_STYLE[variant], ...extra }
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & StyleArgs & { children: ReactNode }

export function Button({ variant, size, shape, fullWidth, className, style, children, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={classes({ variant, size, shape, fullWidth }, className)}
      style={styleFor({ variant }, style)}
    >
      {children}
    </button>
  )
}

type LinkButtonProps = StyleArgs & {
  href: string
  children: ReactNode
  className?: string
  style?: CSSProperties
  external?: boolean
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>

export function LinkButton({ variant, size, shape, fullWidth, className, style, href, external, children, ...rest }: LinkButtonProps) {
  const c = classes({ variant, size, shape, fullWidth }, className)
  const s = styleFor({ variant }, style)
  if (external) {
    return (
      <a {...rest} href={href} className={c} style={s} target={rest.target ?? '_blank'} rel={rest.rel ?? 'noopener noreferrer'}>
        {children}
      </a>
    )
  }
  return (
    <Link {...rest} href={href} className={c} style={s}>
      {children}
    </Link>
  )
}
