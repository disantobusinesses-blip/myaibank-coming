"use client"

import { useState } from "react"
import { LegalModal } from "./legal-modal"

export function LegalFooter() {
  const [termsOpen, setTermsOpen] = useState(false)
  const [privacyOpen, setPrivacyOpen] = useState(false)

  return (
    <>
      <footer className="py-4 px-4 text-center text-xs text-muted-foreground">
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setTermsOpen(true)}
            className="hover:text-foreground transition-colors underline underline-offset-2"
          >
            Terms of Use
          </button>
          <span>|</span>
          <button
            onClick={() => setPrivacyOpen(true)}
            className="hover:text-foreground transition-colors underline underline-offset-2"
          >
            Privacy Policy
          </button>
        </div>
        <p className="mt-2">
          ABN 38 693 023 371 | support@myaibank.ai
        </p>
      </footer>

      <LegalModal type="terms" open={termsOpen} onOpenChange={setTermsOpen} />
      <LegalModal type="privacy" open={privacyOpen} onOpenChange={setPrivacyOpen} />
    </>
  )
}
