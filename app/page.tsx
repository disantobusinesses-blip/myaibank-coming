"use client"

import React from "react"

import { useEffect, useState, useCallback } from "react"
import { useRouter, usePathname } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LegalFooter } from "@/components/legal-footer"
import { useAuth } from "@/contexts/auth-context"
import { getNextRoute, buildRoutingState } from "@/lib/routing"
import { ArrowRight, Sparkles, Shield, TrendingUp, Play } from "lucide-react"
import FloatingLines from "@/components/FloatingLines"

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
    const handleScroll = () => {
      const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)
      setShowFloatingCta(scrollPercent >= 0.4)
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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse">
          <Image
            src="/logo.jpeg"
            alt="MyAiBank"
            width={80}
            height={80}
            className="rounded-2xl"
          />
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen flex flex-col safe-area-inset relative overflow-hidden bg-white">
      {/* Animated background - thin subtle purple lines on white */}
      <div className="absolute inset-0 z-0">
        <FloatingLines
          linesGradient={['#180D27', '#180D27', '#2d1b69']}
          enabledWaves={['middle']}
          lineCount={[5]}
          lineDistance={[6]}
          animationSpeed={0.3}
          interactive={false}
          bendRadius={4.0}
          bendStrength={-0.2}
          parallax={false}
          parallaxStrength={0}
          mixBlendMode="normal"
        />
      </div>

      {/* Hero Section */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 max-w-md mx-auto w-full">
        {/* Logo */}
        <div className="mb-8 rounded-3xl" style={{ boxShadow: '0 0 40px rgba(24, 13, 39, 0.15)' }}>
          <Image
            src="/logo.jpeg"
            alt="MyAiBank"
            width={100}
            height={100}
            className="rounded-3xl"
            priority
          />
        </div>

        {/* Welcome Text */}
        <h1 className="text-3xl font-bold text-center mb-3 text-balance" style={{ color: '#180D27' }}>
          Welcome to MyAiBank
        </h1>
        <p className="text-center text-base leading-relaxed mb-10 text-pretty" style={{ color: '#555' }}>
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
            icon={<TrendingUp className="w-5 h-5 text-[#8b5cf6]" />}
            title="Cashflow Forecasting"
            description="Predict your financial future"
          />
        </div>

        {/* Primary CTA - Try Demo (most visually prominent) */}
        <div className="w-full mb-4">
          <button
            onClick={handleDemoMode}
            className="try-demo-btn w-full h-16 text-lg font-bold rounded-2xl text-white flex items-center justify-center gap-2"
            style={{
              background: 'linear-gradient(135deg, #180D27 0%, #2d1b69 50%, #180D27 100%)',
              boxShadow: '0 4px 20px rgba(24, 13, 39, 0.3)',
              transition: 'transform 220ms ease, box-shadow 220ms ease',
            }}
          >
            <Play className="w-5 h-5" />
            Try the MyAiBank Demo
          </button>
          <p className="text-center text-sm mt-2" style={{ color: '#888' }}>
            No signup required. See your AI financial dashboard instantly.
          </p>
        </div>

        {/* Secondary CTA Buttons */}
        <div className="w-full space-y-3">
          <Button
            asChild
            className="w-full h-14 text-base font-semibold rounded-2xl text-white"
            style={{ backgroundColor: '#180D27' }}
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
            style={{ borderColor: '#ddd', color: '#180D27' }}
          >
            <Link href="/login">
              I already have an account
            </Link>
          </Button>
        </div>

        {/* What We Do Link */}
        <Link
          href="/what-we-do"
          className="mt-6 text-sm transition-colors underline underline-offset-4"
          style={{ color: '#180D27' }}
        >
          Learn what we do
        </Link>
      </div>

      {/* Legal Footer */}
      <div className="relative z-10">
        <LegalFooter />
      </div>

      {/* Floating Demo CTA - appears after scrolling 40% */}
      {showFloatingCta && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
          style={{ animation: 'fadeInUp 300ms ease forwards' }}
        >
          <button
            onClick={handleDemoMode}
            className="try-demo-btn h-12 px-6 text-sm font-semibold rounded-full text-white flex items-center gap-2"
            style={{
              background: 'linear-gradient(135deg, #180D27 0%, #2d1b69 50%, #180D27 100%)',
              boxShadow: '0 4px 24px rgba(24, 13, 39, 0.4)',
              transition: 'transform 220ms ease, box-shadow 220ms ease',
            }}
          >
            <Play className="w-4 h-4" />
            Try Demo
          </button>
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
    <div className="flex items-start gap-4 p-4 rounded-2xl border" style={{ backgroundColor: '#fff', borderColor: '#e5e5e5' }}>
      <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#f5f5f5' }}>
        {icon}
      </div>
      <div>
        <h3 className="font-medium" style={{ color: '#180D27' }}>{title}</h3>
        <p className="text-sm" style={{ color: '#666' }}>{description}</p>
      </div>
    </div>
  )
}
