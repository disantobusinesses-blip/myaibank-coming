"use client"

import React, { useEffect, useRef, useState } from "react"

interface SplitTextProps {
  /** The text to animate */
  text: string
  /** CSS class applied to the outer wrapper span */
  className?: string
  /** Delay (ms) between each character */
  charDelay?: number
  /** Animation delay before the first character starts (ms) */
  startDelay?: number
}

/**
 * SplitText — ReactBits-style text animation.
 * Splits the text into individual character <span>s and staggers a
 * fade-up animation on each one using IntersectionObserver.
 */
export function SplitText({
  text,
  className = "",
  charDelay = 30,
  startDelay = 0,
}: SplitTextProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const chars = text.split("")

  return (
    <span ref={ref} className={`split-text-wrapper ${className}`} aria-label={text}>
      {chars.map((char, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="split-char"
          style={{
            animationDelay: `${startDelay + i * charDelay}ms`,
            animationPlayState: visible ? "running" : "paused",
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  )
}
