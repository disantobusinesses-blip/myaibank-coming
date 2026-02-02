"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { LegalFooter } from "@/components/legal-footer"
import { useAuth } from "@/contexts/auth-context"
import { Check, Sparkles, Loader2 } from "lucide-react"

// ENV VARS needed:
// - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
// - STRIPE_SECRET_KEY

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
  const { user } = useAuth()
  const router = useRouter()

  const handleContinue = async () => {
    setIsLoading(true)
    
    if (selectedPlan === "free") {
      // Skip payment for free plan
      router.push("/onboarding")
      return
    }

    // In production, this would create a Stripe checkout session
    // For now, simulate and redirect
    try {
      // Simulating Stripe checkout
      await new Promise((resolve) => setTimeout(resolve, 1000))
      router.push("/subscription-success")
    } catch (error) {
      console.error("Checkout error:", error)
    } finally {
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
            "Continue to Payment"
          )}
        </Button>
      </div>

      <LegalFooter />
    </main>
  )
}
