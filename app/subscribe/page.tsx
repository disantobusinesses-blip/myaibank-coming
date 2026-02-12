"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { LegalFooter } from "@/components/legal-footer"
import { useAuth } from "@/contexts/auth-context"
import { getNextRoute, buildRoutingState } from "@/lib/routing"
import { Check, Sparkles, Loader2, Shield } from "lucide-react"

const plans = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Get started with basic features",
    features: [
      "Connect 1 bank account",
      "Basic transaction tracking",
      "Monthly spending summary",
      "Email support",
    ],
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$9.99",
    period: "per month",
    description: "Everything you need to manage your finances",
    features: [
      "Connect unlimited bank accounts",
      "AI-powered insights",
      "Cashflow forecasting",
      "Subscription tracking",
      "Budget autopilot",
      "Custom reports",
      "Priority support",
    ],
    popular: true,
    trial: true,
  },
  {
    id: "business",
    name: "Business",
    price: "$29.99",
    period: "per month",
    description: "For serious financial management",
    features: [
      "Everything in Pro",
      "Portfolio tracking",
      "Investment analytics",
      "Multi-currency support",
      "API access",
      "Dedicated support",
    ],
    popular: false,
  },
]

export default function SubscribePage() {
  const [selectedPlan, setSelectedPlan] = useState("pro")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { user, profile } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const handleContinue = async () => {
    setIsLoading(true)
    setError("")
    
    if (selectedPlan === "free") {
      // Free plan — route via guard (likely onboarding)
      const state = buildRoutingState({
        loading: false,
        user,
        profile: {
          ...(profile ?? {}),
          subscription_status: "active",
        },
        demoMode: false,
      })
      const dest = getNextRoute(state, pathname) ?? "/onboarding"
      router.push(dest)
      return
    }

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

  const selectedPlanData = plans.find((p) => p.id === selectedPlan)

  return (
    <main className="min-h-screen flex flex-col bg-background safe-area-inset">
      <div className="flex-1 px-4 py-8 max-w-lg mx-auto w-full">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image
            src="/logo.jpeg"
            alt="MyAiBank"
            width={60}
            height={60}
            className="rounded-xl"
          />
        </div>

        {/* Header */}
        <h1 className="text-2xl font-bold text-foreground text-center mb-2">
          Choose your plan
        </h1>
        <p className="text-muted-foreground text-center mb-8">
          Select the plan that works best for you
        </p>

        {/* Plans */}
        <div className="space-y-4 mb-8">
          {plans.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`w-full p-4 rounded-2xl border text-left transition-all ${
                selectedPlan === plan.id
                  ? "border-[#1F0051] bg-[#1F0051]/10"
                  : "border-border bg-card hover:border-muted-foreground/50"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">{plan.name}</h3>
                    {plan.popular && (
                      <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-[#1F0051] text-white flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Popular
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedPlan === plan.id
                      ? "border-[#1F0051] bg-[#1F0051]"
                      : "border-muted-foreground"
                  }`}
                >
                  {selectedPlan === plan.id && (
                    <Check className="w-3 h-3 text-white" />
                  )}
                </div>
              </div>

              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-2xl font-bold text-foreground">{plan.price}</span>
                <span className="text-sm text-muted-foreground">/{plan.period}</span>
              </div>

              <ul className="space-y-2">
                {plan.features.slice(0, 4).map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-[#22c55e]" />
                    {feature}
                  </li>
                ))}
                {plan.features.length > 4 && (
                  <li className="text-sm text-muted-foreground pl-6">
                    +{plan.features.length - 4} more features
                  </li>
                )}
              </ul>
            </button>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* Continue Button */}
        <Button
          onClick={handleContinue}
          disabled={isLoading}
          className="w-full h-14 rounded-2xl bg-[#1F0051] hover:bg-[#2d0075] text-white font-semibold text-base"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : selectedPlan === "free" ? (
            "Continue with Free"
          ) : (
            "Start 7-day free trial"
          )}
        </Button>

        {/* Trial copy */}
        {selectedPlanData && selectedPlanData.id !== "free" && (
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Shield className="w-3.5 h-3.5" />
            <span>Card required. No charge today. Cancel anytime before day 7.</span>
          </div>
        )}
      </div>

      <LegalFooter />
    </main>
  )
}
