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
  sm: 'px-5 py-2.5 text-[15px]',
  md: 'px-7 py-3 text-[15px]',
  lg: 'px-8 py-4 text-[15px]',
}

const SHAPE: Record<ButtonShape, string> = {
  pill: 'rounded-full',
  rounded: 'rounded-3xl',
}

// Variant classes encode both default and hover colors so the hover flip
// works without inline-style (style={{ ... }} can't express :hover).
// Primary and dark/secondary follow the founder's CTA spec; inverse is
// kept for special inverse-on-brand contexts (e.g. Subscribe form).
const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary:
    'bg-[#E64E21] text-white hover:bg-white hover:text-black',
  inverse:
    'bg-[var(--color-cream-soft)] text-[var(--color-brand)] hover:bg-[var(--color-brand)] hover:text-[var(--color-cream-soft)]',
  dark:
    'bg-black text-[#F8F3DE] hover:bg-[#F8F3DE] hover:text-black',
}

const BASE =
  'group inline-flex items-center justify-center gap-2 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed'

function classes({ variant = 'primary', size = 'md', shape = 'pill', fullWidth }: StyleArgs, extra?: string) {
  return twMerge(BASE, VARIANT_CLASS[variant], SIZE[size], SHAPE[shape], fullWidth && 'w-full', extra)
}

// Strip a trailing "→" or "->" from string labels so callers don't have
// to know about the new arrow-on-hover convention. Non-string children
// pass through untouched.
function stripTrailingArrow(children: ReactNode): ReactNode {
  if (typeof children !== 'string') return children
  return children.replace(/\s*(?:→|->)\s*$/, '')
}

function HoverArrow() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="opacity-0 group-hover:opacity-100 transition-opacity ml-1 -mr-1 flex-shrink-0"
    >
      <path
        d="M4 12H20M20 12L14 6M20 12L14 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & StyleArgs & { children: ReactNode }

export function Button({ variant, size, shape, fullWidth, className, style, children, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={classes({ variant, size, shape, fullWidth }, className)}
      style={style as CSSProperties | undefined}
    >
      <span>{stripTrailingArrow(children)}</span>
      <HoverArrow />
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
  const inner = (
    <>
      <span>{stripTrailingArrow(children)}</span>
      <HoverArrow />
    </>
  )
  if (external) {
    return (
      <a {...rest} href={href} className={c} style={style} target={rest.target ?? '_blank'} rel={rest.rel ?? 'noopener noreferrer'}>
        {inner}
      </a>
    )
  }
  return (
    <Link {...rest} href={href} className={c} style={style}>
      {inner}
    </Link>
  )
}
