"use client"

import React, { useEffect, useRef, useState } from "react"

interface AnimatedContentProps {
  children: React.ReactNode
  className?: string
  /** Animation type */
  animation?: "fade-up" | "fade-in" | "fade-left" | "fade-right"
  /** Delay in ms before the animation starts */
  delay?: number
  /** IntersectionObserver threshold (0–1) */
  threshold?: number
}

/**
 * AnimatedContent — ReactBits-style animated entrance component.
 * Uses IntersectionObserver to trigger a fade + translate animation
 * when the element scrolls into view.
 */
export function AnimatedContent({
  children,
  className = "",
  animation = "fade-up",
  delay = 0,
  threshold = 0.15,
}: AnimatedContentProps) {
  const ref = useRef<HTMLDivElement>(null)
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
      { threshold }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return (
    <div
      ref={ref}
      className={`animated-content animated-content--${animation} ${visible ? "animated-content--visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}
