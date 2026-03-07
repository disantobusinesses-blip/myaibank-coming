"use client"

import { useState } from "react"
import Image from "next/image"
import { LegalModal } from "./legal-modal"

export function LegalFooter({ variant = "light" }: { variant?: "light" | "dark" }) {
  const [termsOpen, setTermsOpen] = useState(false)
  const [privacyOpen, setPrivacyOpen] = useState(false)

  const textColor = variant === "dark" ? 'rgba(255,255,255,0.45)' : undefined
  const hoverClass = variant === "dark" ? "hover:text-white" : "hover:text-foreground"

  return (
    <>
      <footer
        className="py-4 px-4 text-center text-xs"
        style={variant === "dark" ? { color: textColor } : undefined}
      >
        {/* MAB Logo */}
        <div className="flex justify-center mb-3">
          <Image
            src="/mab-logo-white.svg"
            alt="MAB"
            width={48}
            height={20}
            style={variant === "light" ? { filter: "invert(1)" } : { opacity: 0.5 }}
          />
        </div>
        <div className={`flex items-center justify-center gap-4 ${variant === "light" ? "text-muted-foreground" : ""}`}>
          <button
            onClick={() => setTermsOpen(true)}
            className={`${hoverClass} transition-colors underline underline-offset-2`}
          >
            Terms of Use
          </button>
          <span>|</span>
          <button
            onClick={() => setPrivacyOpen(true)}
            className={`${hoverClass} transition-colors underline underline-offset-2`}
          >
            Privacy Policy
          </button>
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

      <LegalModal type="terms" open={termsOpen} onOpenChange={setTermsOpen} />
      <LegalModal type="privacy" open={privacyOpen} onOpenChange={setPrivacyOpen} />
    </>
  )
}
