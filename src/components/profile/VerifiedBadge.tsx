type Props = {
  isVerified: boolean | null | undefined
  size?: number
  className?: string
  title?: string
}

export default function VerifiedBadge({ isVerified, size = 24, className, title = 'Verified partner' }: Props) {
  if (!isVerified) return null
  return (
    <span
      role="img"
      aria-label={title}
      title={title}
      className={`inline-flex items-center justify-center rounded-full align-middle ${className ?? ''}`}
      style={{ width: size, height: size, background: '#E8542C' }}
    >
      <svg
        width={Math.round(size * 0.6)}
        height={Math.round(size * 0.6)}
        viewBox="0 0 24 24"
        fill="none"
        stroke="#fff"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polyline points="5 12.5 10 17.5 19 7.5" />
      </svg>
    </span>
  )
}
