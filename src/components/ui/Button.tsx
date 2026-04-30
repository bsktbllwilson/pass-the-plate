import type { AnchorHTMLAttributes, ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'
import { Link } from '@/i18n/navigation'

export type ButtonVariant = 'primary' | 'inverse' | 'dark' | 'search'
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

// Variant classes encode default + hover colors. :hover requires
// real CSS (inline style can't express it), so each variant ships
// hover utilities alongside its base color.
//   primary  — homepage / hero / general CTAs
//   inverse  — light pill on dark/branded backgrounds
//   dark     — black pill, used as secondary
//   search   — search-bar submit: brand → black on hover (founder spec
//              calls this out separately from primary)
const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary:
    'bg-[#E64E21] text-white hover:bg-white hover:text-black',
  inverse:
    'bg-[var(--color-cream-soft)] text-[var(--color-brand)] hover:bg-[var(--color-brand)] hover:text-[var(--color-cream-soft)]',
  dark:
    'bg-black text-[#F8F3DE] hover:bg-[#F8F3DE] hover:text-black',
  search:
    'bg-[#E64E21] text-white hover:bg-black hover:text-white',
}

const BASE =
  'cta-btn inline-flex items-center justify-center font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed'

function classes({ variant = 'primary', size = 'md', shape = 'pill', fullWidth }: StyleArgs, extra?: string) {
  return twMerge(BASE, VARIANT_CLASS[variant], SIZE[size], SHAPE[shape], fullWidth && 'w-full', extra)
}

// Strip a trailing "→" or "->" from string labels — the arrow is now
// CSS-driven, so callers don't need to know the convention.
function stripTrailingArrow(children: ReactNode): ReactNode {
  if (typeof children !== 'string') return children
  return children.replace(/\s*(?:→|->)\s*$/, '')
}

function HoverArrow() {
  // Wrapped in a span with class .cta-arrow so the parent .cta-btn CSS
  // can toggle its display on hover/focus. The svg itself just renders
  // the founder's spec'd arrow path.
  return (
    <span className="cta-arrow ml-2 -mr-1 items-center" aria-hidden="true">
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4 12H20M20 12L14 6M20 12L14 18"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
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
