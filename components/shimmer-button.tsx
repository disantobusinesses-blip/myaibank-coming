"use client"

import React from "react"

/**
 * ShimmerButton - Inspired by ReactBits StarBorder/ShinyButton
 * A premium button with an animated shimmer highlight effect.
 * Pure CSS animation, no external dependencies.
 */
export function ShimmerButton({
  children,
  className = "",
  shimmerColor = "rgba(139, 92, 246, 0.4)",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  shimmerColor?: string
}) {
  return (
    <button
      className={`shimmer-btn relative overflow-hidden ${className}`}
      {...props}
    >
      <span
        className="shimmer-btn__highlight absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(120deg, transparent 30%, ${shimmerColor} 50%, transparent 70%)`,
          backgroundSize: "200% 100%",
        }}
      />
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </button>
  )
}
