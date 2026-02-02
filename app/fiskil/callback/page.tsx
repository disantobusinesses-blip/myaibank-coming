"use client"

import { Suspense, useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { useAuth } from "@/contexts/auth-context"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

function FiskilCallbackInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, updateProfile } = useAuth()
  const [status, setStatus] = useState<"pending" | "success" | "error">("pending")
  const [message, setMessage] = useState<string>("Confirming your bank connection...")

  const endUserId = useMemo(() => {
    // Accept common variations
    return (
      searchParams.get("end_user_id") ||
      searchParams.get("endUserId") ||
      searchParams.get("userId") ||
      null
    )
  }, [searchParams])

  useEffect(() => {
    const finalize = async () => {
      try {
        if (!user) {
          setStatus("error")
          setMessage("Please log in to finalise your connection.")
          setTimeout(() => router.push("/login"), 1500)
          return
        }

        // Mark bank connected in DB (store end_user_id)
        const res = await fetch("/api/mark-bank-connected", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ end_user_id: endUserId }),
        })

        if (!res.ok) {
          const text = await res.text()
          throw new Error(text || "Unable to update bank connection")
        }

        // Update local auth/profile state (optional but helps UI immediately)
        await updateProfile({
          has_bank_connection: true,
          ...(endUserId ? { fiskil_user_id: endUserId } : {}),
          is_onboarded: true,
        })

        setStatus("success")
        setMessage("Connection confirmed. Redirecting you to your dashboard...")
        setTimeout(() => router.replace("/app/dashboard"), 900)
      } catch (err: any) {
        setStatus("error")
        setMessage(err?.message || "Unable to confirm your connection.")
        setTimeout(() => router.replace("/onboarding"), 2000)
      }
    }

    finalize()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, endUserId])

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm text-center">
        <div className="flex justify-center mb-6">
          <Image src="/logo.jpeg" alt="MyAiBank" width={72} height={72} className="rounded-2xl" />
        </div>

        {status === "pending" && (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-7 h-7 animate-spin" />
            <p className="text-sm text-muted-foreground">{message}</p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center gap-3">
            <CheckCircle className="w-8 h-8" />
            <p className="text-sm text-muted-foreground">{message}</p>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center gap-3">
            <XCircle className="w-8 h-8" />
            <p className="text-sm text-muted-foreground">{message}</p>
          </div>
        )}
      </div>
    </main>
  )
}

export default function FiskilCallbackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading…</div>}>
      <FiskilCallbackInner />
    </Suspense>
  )
}
