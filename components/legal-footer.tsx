"use client"

import Link from "next/link"
import Image from "next/image"
import { CookieSettingsTrigger } from "@/components/cookie-settings-trigger"

export function LegalFooter({ variant = "light" }: { variant?: "light" | "dark" }) {
  const textColor = variant === "dark" ? 'rgba(255,255,255,0.45)' : undefined
  const hoverClass = variant === "dark" ? "hover:text-white" : "hover:text-foreground"

  return (
    <footer
      className="py-4 px-4 text-center text-xs"
      style={variant === "dark" ? { color: textColor } : undefined}
    >
      {/* MAB Logo */}
      <div className="flex justify-center mb-3">
        <Image
          src="/MABtransparent.png"
          alt="MAB logo"
          width={48}
          height={20}
          className={variant === "light" ? "invert" : ""}
          style={{ objectFit: "contain" }}
        />
      </div>
      <div className={`flex items-center justify-center gap-4 ${variant === "light" ? "text-muted-foreground" : ""}`}>
        <Link
          href="/terms"
          className={`${hoverClass} transition-colors underline underline-offset-2`}
        >
          Terms of Use
        </Link>
        <span>|</span>
        <Link
          href="/privacy"
          className={`${hoverClass} transition-colors underline underline-offset-2`}
        >
          Privacy Policy
        </Link>
        <span>|</span>
        <CookieSettingsTrigger
          className={`${hoverClass} transition-colors underline underline-offset-2 text-xs`}
          style={variant === "dark" ? { color: textColor } : undefined}
        />
      </div>
      <p className={`mt-2 ${variant === "light" ? "text-muted-foreground" : ""}`}>
        ABN 38 693 023 371 | support@myaibank.ai
      </p>
      <p className="mt-2" style={{ color: variant === "dark" ? 'rgba(255,255,255,0.35)' : '#999' }}>
        Built by{" "}
        <a
          href="https://intelligentaisystem.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
          style={{ color: variant === "dark" ? 'rgba(255,255,255,0.35)' : '#999' }}
        >
          Intelligent AI Systems
        </a>
      </p>
    </footer>
  )
}

