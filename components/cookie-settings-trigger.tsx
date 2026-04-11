"use client"

import type { CSSProperties, ReactNode } from "react"

interface CookieSettingsTriggerProps {
  className?: string
  style?: CSSProperties
  children?: ReactNode
}

export function CookieSettingsTrigger({
  className,
  style,
  children = "Cookie Preferences",
}: CookieSettingsTriggerProps) {
  function open() {
    window.dispatchEvent(new CustomEvent("openCookieSettings"))
  }

  return (
    <button type="button" onClick={open} className={className} style={style}>
      {children}
    </button>
  )
}
