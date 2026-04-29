'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

type Props = {
  /** Full value string, e.g. "$240B+", "70%", "30% Lower", "$0 Upfront". */
  value: string
  /** Number to animate from. Defaults to 0 (count up). Set higher than the
   *  parsed target to count down (e.g. from=2500 with value="$0 Upfront"). */
  from?: number
  /** Animation duration in ms; default 1500. */
  duration?: number
}

// Captures the first run of digits (with optional decimal). Anything before
// the digits is rendered as a static prefix; anything after as a static
// suffix. Examples:
//   "$240B+"     -> ["$",  "240", "B+"]
//   "70%"        -> ["",   "70",  "%"]
//   "30% Lower"  -> ["",   "30",  "% Lower"]
//   "$0 Upfront" -> ["$",  "0",   " Upfront"]
const NUMBER_RE = /^([^\d]*)(\d+(?:\.\d+)?)(.*)$/

/**
 * Animates the numeric portion of a stat from `from` (default 0) to its
 * target value when the element first scrolls into view. Counts up by
 * default; pass `from > target` to count down. Prefix/suffix text stays
 * static.
 *
 * - SSR renders the final value (no hydration mismatch / flicker for users
 *   with JS disabled).
 * - On mount, useEffect resets to `from` once and starts an IntersectionObserver.
 *   Animation triggers exactly once, when the element enters the viewport.
 * - Honors prefers-reduced-motion: skips animation, just renders the target.
 * - Strings without digits ("Verified Buyers" etc.) render unchanged.
 */
export default function AnimatedStat({ value, from = 0, duration = 1500 }: Props) {
  const ref = useRef<HTMLSpanElement>(null)

  const match = useMemo(() => value.match(NUMBER_RE), [value])
  const target = match ? parseFloat(match[2] ?? '0') : 0
  const [current, setCurrent] = useState(target)

  useEffect(() => {
    if (!match) return
    if (typeof window === 'undefined') return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCurrent(target)
      return
    }

    const el = ref.current
    if (!el) return

    let triggered = false
    let raf: number | null = null

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry?.isIntersecting || triggered) return
        triggered = true
        observer.disconnect()

        // Snap to `from` the moment we start, then ease to target.
        setCurrent(from)
        const start = performance.now()
        const tick = (now: number) => {
          const elapsed = now - start
          const progress = Math.min(elapsed / duration, 1)
          // ease-out cubic — fast at first, slows toward the target
          const eased = 1 - Math.pow(1 - progress, 3)
          setCurrent(from + (target - from) * eased)
          if (progress < 1) {
            raf = requestAnimationFrame(tick)
          } else {
            setCurrent(target)
          }
        }
        raf = requestAnimationFrame(tick)
      },
      { threshold: 0.3 },
    )

    observer.observe(el)
    return () => {
      observer.disconnect()
      if (raf !== null) cancelAnimationFrame(raf)
    }
  }, [match, target, from, duration])

  if (!match) return <>{value}</>

  const prefix = match[1] ?? ''
  const numStr = match[2] ?? '0'
  const suffix = match[3] ?? ''
  const decimals = numStr.includes('.') ? (numStr.split('.')[1]?.length ?? 0) : 0
  const display =
    decimals > 0
      ? current.toFixed(decimals)
      : Math.floor(current).toLocaleString('en-US')

  return (
    <span ref={ref}>
      {prefix}
      {display}
      {suffix}
    </span>
  )
}
