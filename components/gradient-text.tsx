"use client"

import React from "react"

/**
 * GradientText - Inspired by ReactBits GradientText
 * Renders text with an animated gradient effect.
 * Pure CSS animation, no external dependencies.
 */
export function GradientText({
  children,
  className = "",
  colors = ["#8b5cf6", "#a78bfa", "#c4b5fd", "#a78bfa", "#8b5cf6"],
  speed = 6,
}: {
  children: React.ReactNode
  className?: string
  colors?: string[]
  speed?: number
}) {
  return (
    <span
      className={`gradient-text-animated inline-block ${className}`}
      style={{
        backgroundImage: `linear-gradient(90deg, ${colors.join(", ")})`,
        backgroundSize: "300% 100%",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        WebkitTextFillColor: "transparent",
        animationDuration: `${speed}s`,
      }}
    >
      {children}
    </span>
  )
}
