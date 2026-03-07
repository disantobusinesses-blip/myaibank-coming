"use client"

import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertCircle, ArrowLeft } from "lucide-react"

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  const getErrorMessage = () => {
    switch (error) {
      case "access_denied":
        return "Access was denied. You may have cancelled the sign-in process."
      case "configuration":
        return "The authentication system is not properly configured. Please contact support."
      case "server_error":
        return "A server error occurred. Please try again later."
      default:
        return "Something went wrong during authentication. Please try again or contact support if the problem persists."
    }
  }

  return (
    <main className="min-h-screen flex flex-col bg-background safe-area-inset">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 max-w-md mx-auto w-full">
        {/* Logo */}
        <div className="h-10 w-24 rounded opacity-20" aria-hidden="true" style={{ backgroundColor: 'rgba(139,92,246,0.4)' }} />

        {/* Icon */}
        <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mb-6">
          <AlertCircle className="w-8 h-8 text-destructive" />
        </div>

        {/* Content */}
        <h1 className="text-2xl font-bold text-foreground text-center mb-3">
          Authentication Error
        </h1>
        <p className="text-muted-foreground text-center mb-8 leading-relaxed">
          {getErrorMessage()}
        </p>

        {/* Back to login */}
        <Link href="/login" className="w-full">
          <Button className="w-full h-12 rounded-xl bg-[#1F0051] hover:bg-[#2d0075] text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sign In
          </Button>
        </Link>
      </div>
    </main>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <AuthErrorContent />
    </Suspense>
  )
}
