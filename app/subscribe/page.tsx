"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LegalFooter } from "@/components/legal-footer"
import { useAuth } from "@/contexts/auth-context"
import { Loader2 } from "lucide-react"

// This page now auto-activates free accounts and redirects to onboarding
// Stripe subscription flow has been removed for the first 500 users

export default function SubscribePage() {
  const [isActivating, setIsActivating] = useState(true)
  const [error, setError] = useState("")
  const { user, updateProfile } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    const activateFreeAccount = async () => {
      try {
        const res = await fetch("/api/activate-free-account", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id }),
        })

        const data = await res.json()

        if (data.success) {
          await updateProfile({
            subscription_status: data.subscription_status ?? "active",
            subscription_plan: data.subscription_plan ?? "free_early_adopter",
          })
          // Redirect to onboarding
          router.push("/onboarding")
        } else if (data.limitReached) {
          setError("Free account limit has been reached. Please check back later.")
          setIsActivating(false)
        } else {
          throw new Error(data.error || "Failed to activate account")
        }
      } catch (err) {
        console.error("Activation error:", err)
        setError(err instanceof Error ? err.message : "Something went wrong")
        setIsActivating(false)
      }
    }

    activateFreeAccount()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  if (!user) {
    return null
  }

  return (
    <main className="min-h-screen flex flex-col bg-background safe-area-inset">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 max-w-lg mx-auto w-full">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="h-10 w-24 rounded opacity-20" role="img" aria-label="Logo placeholder" />
        </div>

        {isActivating ? (
          <>
            <Loader2 className="w-10 h-10 animate-spin text-[#1F0051] mb-4" />
            <p className="text-muted-foreground text-center">
              Setting up your account...
            </p>
          </>
        ) : error ? (
          <div className="text-center">
            <h1 className="text-xl font-bold text-foreground mb-2">
              Account Setup Issue
            </h1>
            <p className="text-muted-foreground mb-4">{error}</p>
          </div>
        ) : null}
      </div>

      <LegalFooter />
    </main>
  )
}
