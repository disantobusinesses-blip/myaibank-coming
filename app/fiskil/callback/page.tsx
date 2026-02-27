"use client"

import { Suspense, useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import Image from "next/image"
import { useAuth } from "@/contexts/auth-context"
import { getNextRoute, buildRoutingState } from "@/lib/routing"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

function FiskilCallbackInner() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { user, profile, loading, updateProfile } = useAuth()
  const [status, setStatus] = useState<"pending" | "success" | "error">("pending")
  const [message, setMessage] = useState<string>("Confirming your bank connection...")
  const [hasRun, setHasRun] = useState(false)

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
    // Wait for auth to finish loading before doing anything
    if (loading) return
    // Prevent double execution
    if (hasRun) return

    const finalize = async () => {
      try {
        if (!user) {
          setStatus("error")
          setMessage("Please log in to finalise your connection.")
          setTimeout(() => router.push("/login"), 1500)
          return
        }

        setMessage("Marking your bank connection...")

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

        setMessage("Fetching your financial data...")

        // Fetch and inject Fiskil data
        const dataRes = await fetch("/api/fiskil-data/inject", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            end_user_id: endUserId,
            user_id: user.id 
          }),
        })

        if (!dataRes.ok) {
          console.error("Failed to inject Fiskil data, but continuing...")
        }

        // Update local auth/profile state
        await updateProfile({
          has_bank_connection: true,
          ...(endUserId ? { fiskil_user_id: endUserId } : {}),
          is_onboarded: true,
        })

        setStatus("success")
        setMessage("Connection confirmed. Redirecting you to your dashboard...")

        // Use routing guard to determine next destination
        const state = buildRoutingState({
          loading: false,
          user,
          profile: {
            ...(profile ?? {}),
            has_bank_connection: true,
            is_onboarded: true,
          },
          demoMode: false,
        })
        const dest = getNextRoute(state, pathname) ?? "/app/dashboard"
        setTimeout(() => router.replace(dest), 900)
      } catch (err: any) {
        setStatus("error")
        setMessage(err?.message || "Unable to confirm your connection.")
        setTimeout(() => router.replace("/onboarding"), 2000)
      }
    }

    setHasRun(true)
    finalize()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading, hasRun, endUserId])

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
            <CheckCircle className="w-8 h-8 text-green-500" />
            <p className="text-sm text-muted-foreground">{message}</p>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center gap-3">
            <XCircle className="w-8 h-8 text-red-500" />
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
