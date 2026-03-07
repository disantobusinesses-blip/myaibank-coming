"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LegalFooter } from "@/components/legal-footer"
import { useAuth } from "@/contexts/auth-context"
import { Check, Sparkles, Loader2, Shield } from "lucide-react"

const features = [
  "Connect unlimited bank accounts",
  "AI-powered insights",
  "Cashflow forecasting",
  "Subscription tracking",
  "Budget autopilot",
  "Custom reports",
  "Priority support",
]

export default function SubscribePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { user } = useAuth()
  const router = useRouter()

  const handleStartTrial = async () => {
    setIsLoading(true)
    setError("")

    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          email: user?.email,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to start checkout")
      }

      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error("No checkout URL returned")
      }
    } catch (err) {
      console.error("Checkout error:", err)
      setError(err instanceof Error ? err.message : "Something went wrong")
      setIsLoading(false)
    }
  }

  if (!user) {
    router.push("/login")
    return null
  }

  return (
    <main className="min-h-screen flex flex-col bg-background safe-area-inset">
      <div className="flex-1 px-4 py-8 max-w-lg mx-auto w-full">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="h-10 w-24 rounded opacity-20" aria-hidden="true" style={{ backgroundColor: 'rgba(139,92,246,0.4)' }} />
        </div>

        {/* Header */}
        <h1 className="text-2xl font-bold text-foreground text-center mb-2">
          Start your free trial
        </h1>
        <p className="text-muted-foreground text-center mb-8">
          Try MyAiBank free for 7 days, then $14.99/month
        </p>

        {/* Plan card */}
        <div className="p-5 rounded-2xl border border-[#1F0051] bg-[#1F0051]/10 mb-8">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-foreground">Pro</h3>
            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-[#1F0051] text-white flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              7-day free trial
            </span>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Everything you need to manage your finances
          </p>

          <div className="flex items-baseline gap-1 mb-4">
            <span className="text-2xl font-bold text-foreground">$14.99</span>
            <span className="text-sm text-muted-foreground">/month</span>
          </div>

          <ul className="space-y-2">
            {features.map((feature, idx) => (
              <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="w-4 h-4 text-[#22c55e] flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* CTA Button */}
        <Button
          onClick={handleStartTrial}
          disabled={isLoading}
          className="w-full h-14 rounded-2xl bg-[#1F0051] hover:bg-[#2d0075] text-white font-semibold text-base"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            "Start 7-day free trial"
          )}
        </Button>

        {/* Trial copy */}
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Shield className="w-3.5 h-3.5" />
          <span>Card required. No charge today. Cancel anytime before day 7.</span>
        </div>
      </div>

      <LegalFooter />
    </main>
  )
}
