"use client"

import React from "react"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { LegalFooter } from "@/components/legal-footer"
import { DemoStartButton } from "@/components/demo-start-button"
import { useAuth } from "@/contexts/auth-context"
import { Loader2 } from "lucide-react"
import { SplitText } from "@/components/split-text"
import { AnimatedContent } from "@/components/animated-content"

const NAV_LINKS = [
  ["Features", "/features"],
  ["Pricing",  "/pricing"],
  ["Blog",     "/blog"],
  ["Security", "/security"],
]

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { signInWithGoogle } = useAuth()

  const handleGoogleSignIn = async () => {
    setError("")
    setIsLoading(true)
    
    const { error: googleError } = await signInWithGoogle()
    
    if (googleError) {
      setError(googleError.message || "Google sign-in failed")
      setIsLoading(false)
    }
    // Note: Google OAuth redirects, so no need to push router on success
  }

  return (
    <main className="min-h-screen flex flex-col bg-background">

      {/* ── NAV ── */}
      <header
        className="sticky top-0 z-50"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", backgroundColor: "rgba(5,5,8,0.95)", backdropFilter: "blur(12px)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" aria-label="MyAiBank home">
            <Image src="/MABtransparent.png" alt="MyAiBank" width={80} height={32} className="object-contain w-16 h-auto sm:w-20" priority />
          </Link>

          {/* Desktop links */}
          <nav className="hidden sm:flex items-center gap-5 lg:gap-8">
            {NAV_LINKS.map(([label, href]) => (
              <Link key={href} href={href} className="text-sm hover:text-white transition-colors" style={{ color: "rgba(255,255,255,0.55)" }}>
                {label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <DemoStartButton
              className="hidden sm:inline-flex items-center h-9 px-4 rounded-full text-xs sm:text-sm font-medium hover:scale-105 transition-all cursor-pointer"
              style={{ background: "rgba(139,92,246,0.2)", border: "1px solid rgba(139,92,246,0.4)", color: "#fff" }}
            >
              Try Demo
            </DemoStartButton>
            <Link
              href="/signup"
              className="h-9 px-4 rounded-full text-xs sm:text-sm font-semibold hover:scale-105 transition-all"
              style={{ background: "linear-gradient(135deg,#8b5cf6,#6d28d9)", color: "#fff" }}
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* ── FORM ── */}
      <div className="flex-1 flex flex-col px-6 py-12 max-w-md mx-auto w-full">

        {/* Header */}
        <AnimatedContent animation="fade-up" delay={80}>
          <h1 className="text-2xl font-bold text-foreground text-center mb-2">
            <SplitText text="Welcome back" charDelay={45} />
          </h1>
          <p className="text-muted-foreground text-center mb-8">
            Sign in to continue to MyAiBank
          </p>
        </AnimatedContent>

        {/* Google Sign In */}
        <AnimatedContent animation="fade-up" delay={140}>
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full h-12 rounded-xl border-border bg-transparent hover:bg-secondary mb-6"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : (
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" aria-label="Google logo" role="img">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            )}
            Sign In with Google
          </Button>

          {error && (
            <div className="mb-6 text-center">
              <p className="text-sm text-destructive">{error}</p>
              {(error.toLowerCase().includes("not available") || error.toLowerCase().includes("provider")) && (
                <p className="text-xs text-muted-foreground mt-1">
                  Google sign-in may be temporarily unavailable. Please try again later or{" "}
                  <a href="mailto:support@myaibank.ai" className="underline">
                    contact support
                  </a>
                  .
                </p>
              )}
            </div>
          )}

          {/* Sign Up Link */}
          <p className="text-center text-sm text-muted-foreground mt-4">
            {"Don't have an account? "}
            <Link href="/signup" className="text-foreground hover:underline font-medium">
              Sign up with Google
            </Link>
          </p>

          {/* Try Demo */}
          <div className="mt-8 pt-8 border-t border-border text-center">
            <p className="text-sm text-muted-foreground mb-3">Just browsing?</p>
            <DemoStartButton
              className="inline-flex items-center h-10 px-6 rounded-xl text-sm font-medium hover:scale-105 transition-all cursor-pointer"
              style={{ background: "rgba(139,92,246,0.2)", border: "1px solid rgba(139,92,246,0.4)", color: "#fff" }}
            >
              Try the Live Demo
            </DemoStartButton>
          </div>
        </AnimatedContent>
      </div>

      <LegalFooter />
    </main>
  )
}
