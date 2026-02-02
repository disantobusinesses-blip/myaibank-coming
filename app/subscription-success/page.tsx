"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { CheckCircle, ArrowRight } from "lucide-react"

export default function SubscriptionSuccessPage() {
  const [countdown, setCountdown] = useState(5)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          router.push("/onboarding")
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [user, router])

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
            src="/logo.jpeg"
            alt="MyAiBank"
            width={60}
            height={60}
            className="rounded-xl mx-auto"
          />
        </div>

        {/* Text */}
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Subscription Activated!
        </h1>
        <p className="text-muted-foreground mb-8">
          Thank you for subscribing to MyAiBank. Let&apos;s connect your bank account to get started.
        </p>

        {/* Countdown */}
        <p className="text-sm text-muted-foreground mb-6">
          Redirecting in {countdown} seconds...
        </p>

        {/* Continue Button */}
        <Button
          onClick={() => router.push("/onboarding")}
          className="w-full h-14 rounded-2xl bg-[#1F0051] hover:bg-[#2d0075] text-white font-semibold"
        >
          Continue to Bank Connection
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </main>
  )
}
