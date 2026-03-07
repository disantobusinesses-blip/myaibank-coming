"use client"

import React from "react"

import { useEffect, useState, useCallback } from "react"
import { useRouter, usePathname } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LegalFooter } from "@/components/legal-footer"
import { ShimmerButton } from "@/components/shimmer-button"
import { GradientText } from "@/components/gradient-text"
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
        <div className="animate-pulse">
          <Image
            src="/mab-logo-white.svg"
            alt="MyAiBank"
            width={80}
            height={34}
            className="opacity-80"
          />
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen flex flex-col safe-area-inset relative overflow-hidden" style={{ backgroundColor: '#050508' }}>
      {/* Hero Section */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 max-w-md mx-auto w-full">
        {/* Logo with subtle purple glow */}
        <div
          className="mb-8 pulse-glow rounded-2xl p-6"
          style={{
            background: 'rgba(139, 92, 246, 0.06)',
          }}
        >
          <Image
            src="/mab-logo-white.svg"
            alt="MyAiBank"
            width={140}
            height={60}
            priority
          />
        </div>

        {/* Welcome Text with gradient effect */}
        <h1 className="text-3xl font-bold text-center mb-3 text-balance text-white">
          Welcome to <GradientText>MyAiBank</GradientText>
        </h1>
        <p className="text-center text-base leading-relaxed mb-10 text-pretty" style={{ color: 'rgba(255,255,255,0.65)' }}>
          AI-powered financial insights to help you budget smarter, track spending, and reach your goals.
        </p>

        {/* Features */}
        <div className="w-full space-y-4 mb-10">
          <FeatureItem
            icon={<Sparkles className="w-5 h-5 text-[#22c55e]" />}
            title="AI-Powered Insights"
            description="Smart analysis of your spending patterns"
          />
          <FeatureItem
            icon={<Shield className="w-5 h-5 text-[#14b8a6]" />}
            title="Bank-Grade Security"
            description="Your data is encrypted and protected"
          />
          <FeatureItem
            icon={<TrendingUp className="w-5 h-5 text-[#a78bfa]" />}
            title="Cashflow Forecasting"
            description="Predict your financial future"
          />
        </div>

        {/* Primary CTA - Try Demo with shimmer effect */}
        <div className="w-full mb-4">
          <ShimmerButton
            onClick={handleDemoMode}
            shimmerColor="rgba(139, 92, 246, 0.3)"
            className="w-full h-16 text-lg font-bold rounded-2xl"
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
          <p className="text-center text-sm mt-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
            No signup required. See your AI financial dashboard instantly.
          </p>
        </div>

        {/* Secondary CTA Buttons */}
        <div className="w-full space-y-3">
          <Button
            asChild
            className="w-full h-14 text-base font-semibold rounded-2xl"
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
            className="w-full h-14 text-base font-medium rounded-2xl bg-transparent"
            style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)' }}
          >
            <Link href="/login">
              I already have an account
            </Link>
          </Button>
        </div>

        {/* What We Do & Blog Links */}
        <div className="flex items-center gap-4 mt-6">
          <Link
            href="/what-we-do"
            className="text-sm transition-colors underline underline-offset-4"
            style={{ color: 'rgba(255,255,255,0.6)' }}
          >
            Learn what we do
          </Link>
          <Link
            href="/blog"
            className="text-sm transition-colors underline underline-offset-4"
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
            className="h-12 px-6 text-sm font-semibold rounded-full"
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
        <h3 className="font-medium text-white">{title}</h3>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>{description}</p>
      </div>
    </div>
  )
}
