"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { useAuth } from "@/contexts/auth-context"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import { Suspense } from "react"

function FiskilCallbackContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user, updateProfile } = useAuth()
  const [connectionStatus, setConnectionStatus] = useState<"success" | "error" | "pending">("pending")

  // Fiskil callback parameters
  const status = searchParams.get("status")
  const code = searchParams.get("code") // Auth code from Fiskil
  const error = searchParams.get("error")
  const errorDescription = searchParams.get("error_description")

  useEffect(() => {
    const handleCallback = async () => {
      // Check for explicit error from Fiskil
      if (error || status === "error") {
        console.error("Fiskil error:", error, errorDescription)
        setConnectionStatus("error")
        setTimeout(() => router.push("/onboarding"), 3000)
        return
      }

      // Success case - either explicit status=success or presence of code
      if (status === "success" || code) {
        try {
          // Mark bank as connected via API
          const response = await fetch("/api/mark-bank-connected", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: user?.id,
              authCode: code,
            }),
          })

          if (response.ok) {
            // Update local profile state
            await updateProfile({
              has_bank_connection: true,
              is_onboarded: true,
            })
            setConnectionStatus("success")
            setTimeout(() => router.push("/app/dashboard"), 2000)
          } else {
            throw new Error("Failed to mark bank connected")
          }
        } catch (err) {
          console.error("Error completing bank connection:", err)
          setConnectionStatus("error")
          setTimeout(() => router.push("/onboarding"), 3000)
        }
      }
    }

    handleCallback()
  }, [status, code, error, errorDescription, user, router, updateProfile])

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background px-6 safe-area-inset">
      <div className="max-w-md w-full text-center">
        {connectionStatus === "success" ? (
          <>
            <div className="w-24 h-24 rounded-full bg-[#22c55e]/20 flex items-center justify-center mx-auto mb-6 glow-success">
              <CheckCircle className="w-12 h-12 text-[#22c55e]" />
            </div>
            <Image
              src="/logo.jpeg"
              alt="MyAiBank"
              width={60}
              height={60}
              className="rounded-xl mx-auto mb-6"
            />
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Bank Connected Successfully!
            </h1>
            <p className="text-muted-foreground">
              Your accounts are now linked. Taking you to your dashboard...
            </p>
          </>
        ) : connectionStatus === "error" ? (
          <>
            <div className="w-24 h-24 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-12 h-12 text-destructive" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Connection Failed
            </h1>
            <p className="text-muted-foreground">
              {errorDescription || "There was an issue connecting your bank. Returning to setup..."}
            </p>
          </>
        ) : (
          <>
            <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-12 h-12 text-muted-foreground animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Processing...
            </h1>
            <p className="text-muted-foreground">
              Please wait while we complete your bank connection.
            </p>
          </>
        )}
      </div>
    </main>
  )
}

export default function FiskilCallbackPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
      </main>
    }>
      <FiskilCallbackContent />
    </Suspense>
  )
}
