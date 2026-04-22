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

  // Build a flat list of tokens (chars + spaces) preserving original indices for stagger
  const chars = text.split("")

  // Group by word so we can wrap each word in a no-break span
  type Token = { char: string; idx: number }
  const wordGroups: Token[][] = []
  let current: Token[] = []
  chars.forEach((char, idx) => {
    if (char === " ") {
      wordGroups.push(current)
      wordGroups.push([{ char: " ", idx }])
      current = []
    } else {
      current.push({ char, idx })
    }
  })
  if (current.length) wordGroups.push(current)

  return (
    <span ref={ref} className={`split-text-wrapper ${className}`} aria-label={text}>
      {wordGroups.map((group, gi) => {
        const isSpace = group.length === 1 && group[0].char === " "
        const inner = group.map(({ char, idx }) => (
          <span
            key={idx}
            aria-hidden="true"
            className="split-char"
            style={{
              animationDelay: `${startDelay + idx * charDelay}ms`,
              animationPlayState: visible ? "running" : "paused",
            }}
          >
            {isSpace ? "\u00A0" : char}
          </span>
        ))
        if (isSpace) return <React.Fragment key={gi}>{inner}</React.Fragment>
        return (
          <span key={gi} style={{ display: "inline-block", whiteSpace: "nowrap" }}>
            {inner}
          </span>
        )
      })}
    </span>
  )
}
