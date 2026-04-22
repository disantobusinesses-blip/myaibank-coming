"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LegalFooter } from "@/components/legal-footer"
import { useAuth } from "@/contexts/auth-context"
import { Sparkles, Shield, Loader2, ArrowRight } from "lucide-react"

export default function OnboardingPage() {
  const [isFinishing, setIsFinishing] = useState(false)
  const { user, profile, updateProfile } = useAuth()
  const router = useRouter()

  const handleContinue = async () => {
    setIsFinishing(true)
    if (!profile?.is_onboarded) {
      await updateProfile({
        is_onboarded: true,
      })
    }
    router.push("/app/dashboard")
  }

  if (!user) {
    router.push("/login")
    return null
  }

  return (
    <main className="min-h-screen flex flex-col bg-background safe-area-inset">
      <div className="flex-1 flex flex-col px-6 py-8 max-w-md mx-auto w-full">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="h-10 w-24 rounded opacity-20" role="img" aria-label="Logo placeholder" />
        </div>

        {/* Header */}
        <h1 className="text-2xl font-bold text-foreground text-center mb-2">
          Welcome to MyAiBank
        </h1>
        <p className="text-muted-foreground text-center mb-8">
          You&apos;re all set. Bank connections will be available soon.
        </p>

        {/* Benefits */}
        <div className="space-y-4 mb-8">
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-card border border-border">
            <div className="w-10 h-10 rounded-xl bg-[#14b8a6]/20 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-[#14b8a6]" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">AI insights, ready to go</h3>
              <p className="text-sm text-muted-foreground">
                Explore your dashboard and try the AI assistant right away with demo data.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-card border border-border">
            <div className="w-10 h-10 rounded-xl bg-[#22c55e]/20 flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-[#22c55e]" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">Bank-grade security</h3>
              <p className="text-sm text-muted-foreground">
                Secure open banking integration is coming soon. We will never see your login credentials.
              </p>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <Button
          onClick={handleContinue}
          disabled={isFinishing}
          className="w-full h-14 rounded-2xl bg-[#1F0051] hover:bg-[#2d0075] text-white font-semibold text-base"
        >
          {isFinishing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Loading...
            </>
          ) : (
            <>
              Continue to Dashboard
              <ArrowRight className="w-5 h-5 ml-2" />
            </>
          )}
        </Button>
      </div>

      <LegalFooter />
    </main>
  )
}
