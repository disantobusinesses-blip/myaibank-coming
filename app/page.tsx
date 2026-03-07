"use client"

import React from "react"

import { useEffect, useState, useCallback } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LegalFooter } from "@/components/legal-footer"
import { ShimmerButton } from "@/components/shimmer-button"
import { AuroraBackground } from "@/components/aurora-background"
import { SplitText } from "@/components/split-text"
import { AnimatedContent } from "@/components/animated-content"
import { CountUp } from "@/components/count-up"
import { useAuth } from "@/contexts/auth-context"
import { getNextRoute, buildRoutingState } from "@/lib/routing"
import { ArrowRight, Sparkles, Shield, TrendingUp, Play } from "lucide-react"

export default function WelcomePage() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const [showFloatingCta, setShowFloatingCta] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || loading) return

    // Check if demo mode is active
    const isDemoMode = typeof window !== "undefined" && 
      (sessionStorage.getItem("myaibank_demo_mode") === "true" ||
       document.cookie.includes("myaibank_demo_mode=true"))

    const state = buildRoutingState({ loading, user, profile, demoMode: isDemoMode })
    const dest = getNextRoute(state, pathname)
    if (dest) router.push(dest)
  }, [user, profile, loading, router, mounted, pathname])

  // Show floating CTA after scrolling ~40% down
  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const denominator = document.documentElement.scrollHeight - window.innerHeight
        const scrollPercent = denominator > 0 ? window.scrollY / denominator : 0
        setShowFloatingCta(scrollPercent >= 0.4)
        ticking = false
      })
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleDemoMode = useCallback(() => {
    try {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("myaibank_demo_mode", "true")
        // Also set a cookie so the middleware can detect demo mode
        document.cookie = "myaibank_demo_mode=true; path=/; max-age=86400; SameSite=Lax"
      }
      router.push("/app/dashboard")
    } catch (error) {
      console.error("Error enabling demo mode:", error)
      // Fallback: try to navigate anyway
      if (typeof window !== "undefined") {
        window.location.href = "/app/dashboard"
      }
    }
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#050508' }}>
        {/* Blank placeholder — logo to be added later */}
        <div className="w-20 h-8 rounded opacity-20 animate-pulse" role="img" aria-label="Logo placeholder" />
      </div>
    )
  }

  return (
    <main className="min-h-screen flex flex-col safe-area-inset relative overflow-hidden" style={{ backgroundColor: '#050508' }}>
      {/* Aurora background */}
      <AuroraBackground className="fixed inset-0" />

      {/* Hero Section */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 max-w-md mx-auto w-full">
        {/* Logo placeholder — blank for now, to be filled in later */}
        <div className="mb-8 w-[140px] h-[60px] logo-placeholder" role="img" aria-label="Logo placeholder" />

        {/* Welcome heading — SplitText animation */}
        <h1 className="font-heading text-3xl text-center mb-3 text-balance text-white leading-tight">
          Welcome to{" "}
          <SplitText
            text="MyAiBank"
            className="text-white"
            charDelay={45}
            startDelay={200}
          />
        </h1>
        <AnimatedContent animation="fade-up" delay={400}>
          <p className="font-body text-center text-base leading-relaxed mb-10 text-pretty" style={{ color: 'rgba(255,255,255,0.65)' }}>
            AI-powered financial insights to help you budget smarter, track spending, and reach your goals.
          </p>
        </AnimatedContent>

        {/* Stats row with CountUp */}
        <AnimatedContent animation="fade-up" delay={500}>
          <div className="flex items-center justify-center gap-8 mb-10 w-full">
            <div className="text-center">
              <div className="font-number text-2xl text-white">
                <CountUp to={500} suffix="+" duration={1600} />
              </div>
              <div className="font-body text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>Transactions</div>
            </div>
            <div className="w-px h-8" style={{ backgroundColor: 'rgba(255,255,255,0.12)' }} />
            <div className="text-center">
              <div className="font-number text-2xl text-white">
                <CountUp to={98} suffix="%" duration={1800} />
              </div>
              <div className="font-body text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>Accuracy</div>
            </div>
            <div className="w-px h-8" style={{ backgroundColor: 'rgba(255,255,255,0.12)' }} />
            <div className="text-center">
              <div className="font-number text-2xl text-white">
                <CountUp to={24} suffix="/7" duration={1400} />
              </div>
              <div className="font-body text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>AI Support</div>
            </div>
          </div>
        </AnimatedContent>

        {/* Features — AnimatedContent on each card */}
        <div className="w-full space-y-4 mb-10">
          <AnimatedContent animation="fade-up" delay={100}>
            <FeatureItem
              icon={<Sparkles className="w-5 h-5 text-[#22c55e]" />}
              title="AI-Powered Insights"
              description="Smart analysis of your spending patterns"
            />
          </AnimatedContent>
          <AnimatedContent animation="fade-up" delay={200}>
            <FeatureItem
              icon={<Shield className="w-5 h-5 text-[#14b8a6]" />}
              title="Bank-Grade Security"
              description="Your data is encrypted and protected"
            />
          </AnimatedContent>
          <AnimatedContent animation="fade-up" delay={300}>
            <FeatureItem
              icon={<TrendingUp className="w-5 h-5 text-[#a78bfa]" />}
              title="Cashflow Forecasting"
              description="Predict your financial future"
            />
          </AnimatedContent>
        </div>

        {/* Primary CTA - Try Demo with shimmer effect */}
        <AnimatedContent animation="fade-up" delay={400} className="w-full mb-4">
          <ShimmerButton
            onClick={handleDemoMode}
            shimmerColor="rgba(139, 92, 246, 0.3)"
            className="w-full h-16 text-lg rounded-2xl font-heading"
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #f0edf5 100%)',
              color: '#0a0a0f',
              boxShadow: '0 4px 24px rgba(139, 92, 246, 0.2), 0 0 40px rgba(139, 92, 246, 0.1)',
              transition: 'transform 220ms ease, box-shadow 220ms ease',
            }}
          >
            <Play className="w-5 h-5" />
            Try the MyAiBank Demo
          </ShimmerButton>
          <p className="font-body text-center text-sm mt-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
            No signup required. See your AI financial dashboard instantly.
          </p>
        </AnimatedContent>

        {/* Secondary CTA Buttons */}
        <AnimatedContent animation="fade-up" delay={500} className="w-full space-y-3">
          <Button
            asChild
            className="w-full h-14 rounded-2xl font-subheading text-base"
            style={{
              backgroundColor: 'rgba(139, 92, 246, 0.25)',
              color: '#ffffff',
              border: '1px solid rgba(139, 92, 246, 0.4)',
            }}
          >
            <Link href="/signup">
              Get Started
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="w-full h-14 rounded-2xl bg-transparent font-body text-base"
            style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)' }}
          >
            <Link href="/login">
              I already have an account
            </Link>
          </Button>
        </AnimatedContent>

        {/* What We Do & Blog Links */}
        <div className="flex items-center gap-4 mt-6">
          <Link
            href="/what-we-do"
            className="font-body text-sm transition-colors underline underline-offset-4"
            style={{ color: 'rgba(255,255,255,0.6)' }}
          >
            Learn what we do
          </Link>
          <Link
            href="/blog"
            className="font-body text-sm transition-colors underline underline-offset-4"
            style={{ color: 'rgba(255,255,255,0.6)' }}
          >
            Blog
          </Link>
        </div>
      </div>

      {/* Legal Footer */}
      <div className="relative z-10">
        <LegalFooter variant="dark" />
      </div>

      {/* Floating Demo CTA - appears after scrolling 40% */}
      {showFloatingCta && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
          style={{ animation: 'fadeInUp 300ms ease forwards' }}
        >
          <ShimmerButton
            onClick={handleDemoMode}
            shimmerColor="rgba(139, 92, 246, 0.3)"
            className="h-12 px-6 rounded-full font-subheading text-sm"
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #f0edf5 100%)',
              color: '#0a0a0f',
              boxShadow: '0 4px 24px rgba(139, 92, 246, 0.3), 0 0 30px rgba(139, 92, 246, 0.15)',
              transition: 'transform 220ms ease, box-shadow 220ms ease',
            }}
          >
            <Play className="w-4 h-4" />
            Try Demo
          </ShimmerButton>
        </div>
      )}
    </main>
  )
}

function FeatureItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div
      className="flex items-start gap-4 p-4 rounded-2xl border"
      style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}
    >
      <div
        className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
      >
        {icon}
      </div>
      <div>
        <h3 className="font-subheading text-white">{title}</h3>
        <p className="font-body text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>{description}</p>
      </div>
    </div>
  )
}

