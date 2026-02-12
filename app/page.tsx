"use client"

import React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LegalFooter } from "@/components/legal-footer"
import { useAuth } from "@/contexts/auth-context"
import { getNextRoute, buildRoutingState } from "@/lib/routing"
import { ArrowRight, Sparkles, Shield, TrendingUp, Play } from "lucide-react"

export default function WelcomePage() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

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

  const handleDemoMode = () => {
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
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
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
    <main className="min-h-screen flex flex-col bg-background safe-area-inset">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 max-w-md mx-auto w-full">
        {/* Logo */}
        <div className="mb-8 glow-primary rounded-3xl">
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
        <h1 className="text-3xl font-bold text-foreground text-center mb-3 text-balance">
          Welcome to MyAiBank
        </h1>
        <p className="text-muted-foreground text-center text-base leading-relaxed mb-10 text-pretty">
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

        {/* CTA Buttons */}
        <div className="w-full space-y-3">
          <Button
            asChild
            className="w-full h-14 text-base font-semibold rounded-2xl bg-[#1F0051] hover:bg-[#2d0075] text-white"
          >
            <Link href="/signup">
              Get Started
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="w-full h-14 text-base font-medium rounded-2xl border-border bg-transparent hover:bg-secondary text-foreground"
          >
            <Link href="/login">
              I already have an account
            </Link>
          </Button>
          
          {/* Demo Button */}
          <Button
            onClick={handleDemoMode}
            variant="ghost"
            className="w-full h-12 text-base font-medium rounded-2xl text-muted-foreground hover:text-foreground hover:bg-secondary/50"
          >
            <Play className="mr-2 w-4 h-4" />
            Try Demo (No Sign Up Required)
          </Button>
        </div>

        {/* What We Do Link */}
        <Link
          href="/what-we-do"
          className="mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
        >
          Learn what we do
        </Link>
      </div>

      {/* Legal Footer */}
      <LegalFooter />
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
    <div className="flex items-start gap-4 p-4 rounded-2xl bg-card border border-border">
      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
        {icon}
      </div>
      <div>
        <h3 className="font-medium text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}
