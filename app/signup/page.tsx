"use client"

import React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { LegalFooter } from "@/components/legal-footer"
import { LegalModal } from "@/components/legal-modal"
import { useAuth } from "@/contexts/auth-context"
import { ArrowLeft, Loader2 } from "lucide-react"
import { SplitText } from "@/components/split-text"
import { AnimatedContent } from "@/components/animated-content"

export default function SignupPage() {
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [termsOpen, setTermsOpen] = useState(false)
  const [privacyOpen, setPrivacyOpen] = useState(false)
  const { signInWithGoogle } = useAuth()
  const router = useRouter()

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back()
    } else {
      router.push("/")
    }
  }

  const handleGoogleSignUp = async () => {
    if (!agreedToTerms) {
      setError("You must agree to the Terms of Use and Privacy Policy")
      return
    }

    setError("")
    setIsLoading(true)
    
    const { error: googleError } = await signInWithGoogle()
    
    if (googleError) {
      setError(googleError.message || "Google sign-up failed")
      setIsLoading(false)
    }
    // Note: Google OAuth redirects, so no need to push router on success
  }

  return (
    <main className="min-h-screen flex flex-col bg-background safe-area-inset">
      <div className="flex-1 flex flex-col px-6 py-8 max-w-md mx-auto w-full">
        {/* Back Button */}
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="h-10 w-24 rounded opacity-20" role="img" aria-label="Logo placeholder" />
        </div>

        {/* Header */}
        <AnimatedContent animation="fade-up" delay={80}>
          <h1 className="text-2xl font-bold text-foreground text-center mb-2">
            <SplitText text="Create your account" charDelay={40} />
          </h1>
          <p className="text-muted-foreground text-center mb-8">
            Start your financial journey with MyAiBank
          </p>
        </AnimatedContent>

        {/* Google Sign Up */}
        <AnimatedContent animation="fade-up" delay={140}>
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleSignUp}
            disabled={isLoading}
            className="w-full h-12 rounded-xl border-border bg-transparent hover:bg-secondary mb-6"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : (
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            )}
            Sign Up with Google
          </Button>

          {/* Terms Checkbox */}
          <div className="flex items-start gap-3 pt-4 pb-4">
            <Checkbox
              id="terms"
              checked={agreedToTerms}
              onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
              className="mt-0.5"
            />
            <label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
              I agree to the{" "}
              <button
                type="button"
                onClick={() => setTermsOpen(true)}
                className="text-foreground underline underline-offset-2 hover:text-muted-foreground"
              >
                Terms of Use
              </button>{" "}
              and{" "}
              <button
                type="button"
                onClick={() => setPrivacyOpen(true)}
                className="text-foreground underline underline-offset-2 hover:text-muted-foreground"
              >
                Privacy Policy
              </button>
            </label>
          </div>

          {error && (
            <div className="mb-6 text-center">
              <p className="text-sm text-destructive">{error}</p>
              {error.toLowerCase().includes("not available") && (
                <p className="text-xs text-muted-foreground mt-1">
                  If this problem persists, please{" "}
                  <a href="mailto:support@myaibank.ai" className="underline">
                    contact support
                  </a>
                  .
                </p>
              )}
            </div>
          )}

          {/* Sign In Link */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-foreground hover:underline font-medium"
            >
              Sign in with Google
            </Link>
          </p>
        </AnimatedContent>
      </div>

      <LegalFooter />

      <LegalModal type="terms" open={termsOpen} onOpenChange={setTermsOpen} />
      <LegalModal type="privacy" open={privacyOpen} onOpenChange={setPrivacyOpen} />
    </main>
  )
}
