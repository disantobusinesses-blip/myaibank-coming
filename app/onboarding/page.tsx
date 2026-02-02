"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { LegalFooter } from "@/components/legal-footer"
import { useAuth } from "@/contexts/auth-context"
import { Building2, Shield, Loader2, ArrowRight, CheckCircle, AlertCircle } from "lucide-react"

// ENV VARS needed:
// - FISKIL_BASE_URL
// - FISKIL_CLIENT_ID
// - FISKIL_CLIENT_SECRET

export default function OnboardingPage() {
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState("")
  const { user, updateProfile } = useAuth()
  const router = useRouter()

  const handleConnectBank = async () => {
    setIsConnecting(true)
    setError("")
    
    try {
      // Call API to create Fiskil consent session
      const response = await fetch("/api/create-consent-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to create consent session")
      }

      const data = await response.json()
      
      // Redirect to Fiskil auth URL for bank consent
      if (data.auth_url) {
        window.location.href = data.auth_url
      } else {
        throw new Error("No auth URL returned")
      }
    } catch (err) {
      console.error("Bank connection error:", err)
      setError(err instanceof Error ? err.message : "Failed to connect bank")
      setIsConnecting(false)
    }
  }

  const handleSkip = async () => {
    await updateProfile({
      is_onboarded: true,
    })
    router.push("/app/dashboard")
  }

  if (!user) {
    router.push("/login")
    return null
  }

  if (isConnected) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-background px-6 safe-area-inset">
        <div className="max-w-md w-full text-center">
          <div className="w-24 h-24 rounded-full bg-[#22c55e]/20 flex items-center justify-center mx-auto mb-6 glow-success">
            <CheckCircle className="w-12 h-12 text-[#22c55e]" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Bank Connected!
          </h1>
          <p className="text-muted-foreground">
            Taking you to your dashboard...
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex flex-col bg-background safe-area-inset">
      <div className="flex-1 flex flex-col px-6 py-8 max-w-md mx-auto w-full">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image
            src="/logo.jpeg"
            alt="MyAiBank"
            width={72}
            height={72}
            className="rounded-2xl"
          />
        </div>

        {/* Header */}
        <h1 className="text-2xl font-bold text-foreground text-center mb-2">
          Connect your bank
        </h1>
        <p className="text-muted-foreground text-center mb-8">
          Securely link your accounts to get personalized insights
        </p>

        {/* Benefits */}
        <div className="space-y-4 mb-8">
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-card border border-border">
            <div className="w-10 h-10 rounded-xl bg-[#14b8a6]/20 flex items-center justify-center flex-shrink-0">
              <Building2 className="w-5 h-5 text-[#14b8a6]" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">Automatic tracking</h3>
              <p className="text-sm text-muted-foreground">
                We&apos;ll automatically categorize your transactions and detect subscriptions
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
                We use Fiskil&apos;s secure open banking connection. We never see your login credentials.
              </p>
            </div>
          </div>
        </div>

        {/* Supported Banks Note */}
        <div className="text-center mb-8">
          <p className="text-sm text-muted-foreground">
            Supports all major Australian banks including CBA, ANZ, Westpac, NAB, and more.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* Connect Button */}
        <Button
          onClick={handleConnectBank}
          disabled={isConnecting}
          className="w-full h-14 rounded-2xl bg-[#1F0051] hover:bg-[#2d0075] text-white font-semibold text-base"
        >
          {isConnecting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Connecting...
            </>
          ) : (
            <>
              Connect Bank Account
              <ArrowRight className="w-5 h-5 ml-2" />
            </>
          )}
        </Button>

        {/* Skip Button */}
        <button
          onClick={handleSkip}
          className="mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
        >
          Skip for now
        </button>
      </div>

      <LegalFooter />
    </main>
  )
}
