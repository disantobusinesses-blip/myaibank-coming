"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { getNextRoute, buildRoutingState, ROUTES } from "@/lib/routing"
import { CheckCircle, ArrowRight, Loader2 } from "lucide-react"

function SubscriptionSuccessInner() {
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying")
  const [countdown, setCountdown] = useState(5)
  const { user, profile, loading, updateProfile } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")

  // Derive the next destination via the routing guard
  const getDestination = () => {
    const state = buildRoutingState({
      loading: false,
      user,
      profile: {
        ...(profile ?? {}),
        // After verification, subscription is active/trialing
        subscription_status: "trialing",
      },
      demoMode: false,
    })
    return getNextRoute(state, pathname) ?? ROUTES.ONBOARDING
  }

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    const verify = async () => {
      if (!sessionId) {
        // No session_id — treat as a mock/free-plan success for backwards compat
        await updateProfile({
          subscription_status: "trialing",
          subscription_plan: "pro",
        })
        setStatus("success")
        return
      }

      try {
        const res = await fetch("/api/subscription/activate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        })

        if (!res.ok) {
          throw new Error("Verification failed")
        }

        const data = await res.json()

        // Update local profile state
        await updateProfile({
          subscription_status: data.subscription?.status ?? "trialing",
          subscription_plan: data.subscription?.plan ?? "pro",
        })

        setStatus("success")
      } catch (err) {
        console.error("Error verifying subscription:", err)
        // Still mark as success — the webhook will update the DB
        await updateProfile({
          subscription_status: "trialing",
          subscription_plan: "pro",
        })
        setStatus("success")
      }
    }

    verify()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  // Countdown timer for auto-redirect
  useEffect(() => {
    if (status !== "success") return

    const dest = getDestination()
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          router.push(dest)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, router])

  if (status === "verifying") {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-background px-6 safe-area-inset">
        <div className="max-w-md w-full text-center">
          <Loader2 className="w-10 h-10 animate-spin text-[#1F0051] mx-auto mb-4" />
          <p className="text-muted-foreground">Confirming your subscription…</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background px-6 safe-area-inset">
      <div className="max-w-md w-full text-center">
        {/* Success Icon */}
        <div className="mb-6 relative">
          <div className="w-24 h-24 rounded-full bg-[#22c55e]/20 flex items-center justify-center mx-auto glow-success">
            <CheckCircle className="w-12 h-12 text-[#22c55e]" />
          </div>
        </div>

        {/* Logo */}
        <div className="mb-6">
          <Image
            src="/mab-logo-white.svg"
            alt="MyAiBank"
            width={80}
            height={34}
            className="mx-auto"
          />
        </div>

        {/* Text */}
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Free trial started!
        </h1>
        <p className="text-muted-foreground mb-8">
          Your 7-day free trial is active. Let&apos;s connect your bank account to get started.
        </p>

        {/* Countdown */}
        <p className="text-sm text-muted-foreground mb-6">
          Redirecting in {countdown} seconds...
        </p>

        {/* Continue Button */}
        <Button
          onClick={() => router.push(getDestination())}
          className="w-full h-14 rounded-2xl bg-[#1F0051] hover:bg-[#2d0075] text-white font-semibold"
        >
          Continue to Bank Connection
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </main>
  )
}

export default function SubscriptionSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <Loader2 className="w-8 h-8 animate-spin text-[#1F0051]" />
        </div>
      }
    >
      <SubscriptionSuccessInner />
    </Suspense>
  )
}
