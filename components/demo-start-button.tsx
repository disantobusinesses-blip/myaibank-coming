"use client"

import { useCallback } from "react"
import { useRouter } from "next/navigation"

interface DemoStartButtonProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

/**
 * A client component that safely sets the demo-mode cookie / sessionStorage
 * before navigating to the dashboard. Safe to use inside server-component pages.
 */
export function DemoStartButton({ children, className, style }: DemoStartButtonProps) {
  const router = useRouter()

  const handleClick = useCallback(() => {
    try {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("myaibank_demo_mode", "true")
        document.cookie = "myaibank_demo_mode=true; path=/; max-age=86400; SameSite=Lax"
      }
      router.push("/app/dashboard")
    } catch {
      if (typeof window !== "undefined") window.location.href = "/app/dashboard"
    }
  }, [router])

  return (
    <button type="button" onClick={handleClick} className={className} style={style}>
      {children}
    </button>
  )
}
