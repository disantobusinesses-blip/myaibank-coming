"use client"

import React, { useEffect, useRef, useState } from "react"

interface CountUpProps {
  /** Target number to count to */
  to: number
  /** Number to start counting from (default 0) */
  from?: number
  /** Duration of the animation in ms (default 2800) */
  duration?: number
  /** Decimal places to show (default 0) — ignored when formatter is provided */
  decimals?: number
  /** Optional suffix string, e.g. "%" or "+" — ignored when formatter is provided */
  suffix?: string
  /** Optional prefix string, e.g. "$" — ignored when formatter is provided */
  prefix?: string
  /** Optional custom formatter, receives the raw current number */
  formatter?: (value: number) => string
  /** CSS class applied to the outer span */
  className?: string
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

/**
 * CountUp — ReactBits-style animated number counter.
 * Counts from `from` to `to` using rAF + easeOutCubic easing.
 * Triggers when the element scrolls into view.
 */
export function CountUp({
  to,
  from = 0,
  duration = 2800,
  decimals = 0,
  suffix = "",
  prefix = "",
  formatter,
  className = "",
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const [value, setValue] = useState(from)
  const [started, setStarted] = useState(false)

  // Start counting when element enters viewport
  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Run the counting animation
  useEffect(() => {
    if (!started) return

    let startTime: number | null = null
    let rafId: number

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = easeOutCubic(progress)
      const current = from + (to - from) * easedProgress
      setValue(current)
      if (progress < 1) {
        rafId = requestAnimationFrame(step)
      }
    }

    rafId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafId)
  }, [started, from, to, duration])

  const display = formatter ? formatter(value) : `${prefix}${value.toFixed(decimals)}${suffix}`

  return (
    <span ref={ref} className={`count-up ${className}`}>
      {display}
    </span>
  )
}
