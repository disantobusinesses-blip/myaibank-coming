"use client"

import React from "react"

interface AuroraBackgroundProps {
  className?: string
}

/**
 * Aurora background — CSS-only animated aurora effect.
 * Colours: deep black (#050508) base with subtle brand-purple aurora blobs.
 * Matches existing colour tokens: --background, --primary (#1F0051), --accent (#2d1b69).
 */
export function AuroraBackground({ className = "" }: AuroraBackgroundProps) {
  return (
    <div
      aria-hidden="true"
      className={`aurora-bg ${className}`}
    >
      <div className="aurora-blob aurora-blob-1" />
      <div className="aurora-blob aurora-blob-2" />
      <div className="aurora-blob aurora-blob-3" />
    </div>
  )
}
