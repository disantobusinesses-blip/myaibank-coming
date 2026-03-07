"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Mail, ArrowLeft } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <main className="min-h-screen flex flex-col bg-background safe-area-inset">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 max-w-md mx-auto w-full">
        {/* Logo */}
        <div className="h-10 w-24 rounded opacity-20" role="img" aria-label="Logo placeholder" />

        {/* Icon */}
        <div className="w-16 h-16 rounded-full bg-[#1F0051]/20 flex items-center justify-center mb-6">
          <Mail className="w-8 h-8 text-[#1F0051]" />
        </div>

        {/* Content */}
        <h1 className="text-2xl font-bold text-foreground text-center mb-3">
          Check your email
        </h1>
        <p className="text-muted-foreground text-center mb-8 leading-relaxed">
          We sent you a confirmation link. Please check your email and click the link to verify your account.
        </p>

        {/* Back to login */}
        <Link href="/login" className="w-full">
          <Button
            variant="outline"
            className="w-full h-12 rounded-xl border-border bg-transparent hover:bg-secondary"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sign In
          </Button>
        </Link>
      </div>
    </main>
  )
}
