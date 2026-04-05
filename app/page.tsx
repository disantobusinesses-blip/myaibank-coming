"use client"

import React, { useEffect, useState, useCallback, useMemo, useRef } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { SiteFooter } from "@/components/site-footer"
import { ShimmerButton } from "@/components/shimmer-button"
import { AuroraBackground } from "@/components/aurora-background"
import { CountUp } from "@/components/count-up"
import { useAuth } from "@/contexts/auth-context"
import { getNextRoute, buildRoutingState } from "@/lib/routing"
import {
  ArrowRight, Sparkles, Shield, TrendingUp, Play,
  Brain, CreditCard, Bell, PieChart, Lock, Zap,
  ChevronRight, Star, CheckCircle,
} from "lucide-react"

// ─── Blog posts shown on the homepage ───────────────────────────────────────
const FEATURED_BLOGS = [
  {
    slug: "ai-spending-insights",
    category: "AI Insights",
    categoryColor: "#8b5cf6",
    title: "How AI Analyses Your Spending Patterns",
    excerpt: "Discover how machine learning categorises every transaction and surfaces opportunities to save money automatically.",
    readTime: "4 min read",
  },
  {
    slug: "ai-future-balance-forecasting",
    category: "Cash Flow",
    categoryColor: "#22c55e",
    title: "Predicting Your Future Balance with AI",
    excerpt: "See how MyAiBank uses 12 months of transaction history to forecast your cash position 30, 60, and 90 days ahead.",
    readTime: "5 min read",
  },
  {
    slug: "subscription-detection",
    category: "Smart Detection",
    categoryColor: "#14b8a6",
    title: "Never Miss a Subscription Charge Again",
    excerpt: "Our AI automatically detects recurring payments and alerts you before they hit — so you stay in control of your commitments.",
    readTime: "3 min read",
  },
  {
    slug: "financial-health-score",
    category: "Health Score",
    categoryColor: "#f59e0b",
    title: "Understanding Your Financial Health Score",
    excerpt: "A single number that summarises your income, expenses, savings rate, and debt position — updated every time your bank data syncs.",
    readTime: "4 min read",
  },
  {
    slug: "save-for-house-deposit-faster-australia",
    category: "Goals",
    categoryColor: "#ec4899",
    title: "How to Save for a House Deposit Faster in Australia",
    excerpt: "Practical strategies backed by real data on how Australians can accelerate their path to homeownership.",
    readTime: "6 min read",
  },
]

const FEATURES = [
  {
    icon: Brain,
    color: "#8b5cf6",
    title: "AI Financial Copilot",
    description: "Ask anything about your finances in plain English. Get instant, personalised answers powered by GPT-4.",
  },
  {
    icon: TrendingUp,
    color: "#22c55e",
    title: "Cash Flow Forecasting",
    description: "30, 60, and 90-day projections built from 12 months of your real transaction history.",
  },
  {
    icon: PieChart,
    color: "#14b8a6",
    title: "Automatic Categorisation",
    description: "Every transaction is categorised instantly — groceries, entertainment, utilities, investments — no manual tagging.",
  },
  {
    icon: Bell,
    color: "#f59e0b",
    title: "Subscription Detection",
    description: "Automatically surfaces recurring charges and flags ones you may have forgotten about.",
  },
  {
    icon: CreditCard,
    color: "#ec4899",
    title: "Multi-Account View",
    description: "Link all your Australian bank accounts and see your complete financial picture in one dashboard.",
  },
  {
    icon: Shield,
    color: "#6366f1",
    title: "Bank-Grade Security",
    description: "CDR-compliant open banking. Read-only access. Your credentials never touch our servers.",
  },
]

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Connect Your Bank",
    description: "Securely link your Australian bank accounts in under 60 seconds using CDR open banking — no credentials stored.",
    color: "#8b5cf6",
  },
  {
    step: "02",
    title: "AI Analyses Your Data",
    description: "Our engine processes your transaction history, categorises spending, detects subscriptions, and builds your forecast.",
    color: "#22c55e",
  },
  {
    step: "03",
    title: "Get Personalised Insights",
    description: "See your financial health score, cash flow forecast, spending breakdown, and AI recommendations — all in one place.",
    color: "#14b8a6",
  },
]

// ────────────────────────────────────────────────────────────────────────────

export default function WelcomePage() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const [showFloatingCta, setShowFloatingCta] = useState(false)
  const [navScrolled, setNavScrolled] = useState(false)
  const [loadingTimedOut, setLoadingTimedOut] = useState(false)

  const effectiveLoading = useMemo(() => loading && !loadingTimedOut, [loading, loadingTimedOut])

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!loading) { setLoadingTimedOut(false); return }
    const id = setTimeout(() => setLoadingTimedOut(true), 6000)
    return () => clearTimeout(id)
  }, [loading])

  useEffect(() => {
    if (!mounted || effectiveLoading) return
    const isDemoMode =
      typeof window !== "undefined" &&
      (sessionStorage.getItem("myaibank_demo_mode") === "true" ||
        document.cookie.includes("myaibank_demo_mode=true"))
    const state = buildRoutingState({ loading: effectiveLoading, user, profile, demoMode: isDemoMode })
    const dest = getNextRoute(state, pathname)
    if (dest) router.replace(dest)
  }, [user, profile, effectiveLoading, router, mounted, pathname])

  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const denominator = document.documentElement.scrollHeight - window.innerHeight
        const scrollY = window.scrollY
        setShowFloatingCta(denominator > 0 ? scrollY / denominator >= 0.35 : false)
        setNavScrolled(scrollY > 60)
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
        document.cookie = "myaibank_demo_mode=true; path=/; max-age=86400; SameSite=Lax"
      }
      router.push("/app/dashboard")
    } catch {
      if (typeof window !== "undefined") window.location.href = "/app/dashboard"
    }
  }, [router])

  return (
    <main className="min-h-screen flex flex-col" style={{ backgroundColor: "#050508", color: "#fff" }}>
      {/* Loading overlay */}
      {effectiveLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "#050508" }} aria-hidden="true">
          <div className="animate-pulse">
            <Image src="/MABtransparent.png" alt="" width={80} height={32} className="object-contain opacity-40" />
          </div>
        </div>
      )}

      {/* Aurora */}
      <AuroraBackground className="fixed inset-0 pointer-events-none" />

      {/* ── STICKY NAV ─────────────────────────────────────────────────────── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          borderBottom: navScrolled ? "1px solid rgba(255,255,255,0.08)" : "1px solid transparent",
          backdropFilter: navScrolled ? "blur(20px)" : "none",
          backgroundColor: navScrolled ? "rgba(5,5,8,0.85)" : "transparent",
        }}
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" aria-label="MyAiBank home">
            <Image src="/MABtransparent.png" alt="MyAiBank" width={90} height={36} className="object-contain" priority />
          </Link>
          <div className="hidden md:flex items-center gap-8">
            {[["Features", "/features"], ["Pricing", "/pricing"], ["Blog", "/blog"], ["Security", "/security"]].map(([label, href]) => (
              <Link key={href} href={href} className="text-sm transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.6)" }}>
                {label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden md:block text-sm transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.6)" }}>
              Log in
            </Link>
            <ShimmerButton
              onClick={handleDemoMode}
              shimmerColor="rgba(139,92,246,0.4)"
              className="h-9 px-5 rounded-full text-sm font-medium"
              style={{ background: "linear-gradient(135deg,#8b5cf6,#6d28d9)", color: "#fff" }}
            >
              Try Demo
            </ShimmerButton>
          </div>
        </div>
      </nav>

      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24 pb-20">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-sm" style={{ background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.3)", color: "#a78bfa" }}>
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Personal Finance for Australians
          </div>

          <h1 className="font-heading text-5xl md:text-7xl font-bold leading-tight mb-6 text-white">
            Your money,<br />
            <span style={{ background: "linear-gradient(135deg,#8b5cf6,#22c55e)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              understood.
            </span>
          </h1>

          <p className="text-lg md:text-xl leading-relaxed mb-10 max-w-2xl mx-auto" style={{ color: "rgba(255,255,255,0.6)" }}>
            Connect your Australian bank accounts and let AI analyse your finances, forecast your cash flow, and surface insights that actually help you save more.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <ShimmerButton
              onClick={handleDemoMode}
              shimmerColor="rgba(139,92,246,0.3)"
              className="h-14 px-8 rounded-2xl text-base font-semibold"
              style={{ background: "linear-gradient(135deg,#ffffff,#f0edf5)", color: "#0a0a0f", boxShadow: "0 4px 32px rgba(139,92,246,0.25)" }}
            >
              <Play className="w-5 h-5 mr-2" />
              Try the Live Demo
            </ShimmerButton>
            <Button asChild className="h-14 px-8 rounded-2xl text-base font-semibold" style={{ background: "rgba(139,92,246,0.2)", border: "1px solid rgba(139,92,246,0.4)", color: "#fff" }}>
              <Link href="/signup">
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>

          {/* Stats strip */}
          <div className="flex flex-wrap items-center justify-center gap-12">
            {[
              { value: 98, suffix: "%", label: "Categorisation accuracy" },
              { value: 60, suffix: "s", label: "Bank connection time" },
              { value: 24, suffix: "/7", label: "AI insights" },
            ].map(({ value, suffix, label }) => (
              <div key={label} className="text-center">
                <div className="text-4xl font-bold text-white">
                  <CountUp to={value} suffix={suffix} duration={2800} />
                </div>
                <div className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.45)" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────────────── */}
      <section className="relative z-10 py-28 px-6" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold mb-3 uppercase tracking-widest" style={{ color: "#8b5cf6" }}>Simple Setup</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white">Up and running in 3 steps</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map(({ step, title, description, color }) => (
              <div key={step} className="relative p-8 rounded-3xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="text-6xl font-bold mb-6 leading-none" style={{ color, opacity: 0.25 }}>{step}</div>
                <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>{description}</p>
                <div className="absolute top-8 right-8 w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES GRID ─────────────────────────────────────────────────── */}
      <section className="relative z-10 py-28 px-6" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold mb-3 uppercase tracking-widest" style={{ color: "#22c55e" }}>Everything Included</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white">One platform for your whole financial life</h2>
            <p className="text-lg mt-4 max-w-2xl mx-auto" style={{ color: "rgba(255,255,255,0.5)" }}>
              From transaction categorisation to 90-day cash flow forecasting — all powered by AI and updated every time your bank syncs.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, color, title, description }) => (
              <div key={title} className="group p-7 rounded-3xl transition-all duration-300 hover:scale-[1.02]"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5" style={{ background: `${color}22` }}>
                  <Icon className="w-6 h-6" style={{ color }} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECURITY STRIP ────────────────────────────────────────────────── */}
      <section className="relative z-10 py-20 px-6" style={{ background: "rgba(139,92,246,0.07)", borderTop: "1px solid rgba(139,92,246,0.15)", borderBottom: "1px solid rgba(139,92,246,0.15)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { icon: Lock, label: "CDR Compliant", desc: "Australian Consumer Data Right" },
              { icon: Shield, label: "Read-Only Access", desc: "We can never move your money" },
              { icon: Zap, label: "256-bit Encryption", desc: "Bank-grade data protection" },
              { icon: CheckCircle, label: "No Credentials Stored", desc: "Your login never touches us" },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "rgba(139,92,246,0.2)" }}>
                  <Icon className="w-6 h-6" style={{ color: "#a78bfa" }} />
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{label}</p>
                  <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING TEASER ────────────────────────────────────────────────── */}
      <section className="relative z-10 py-28 px-6" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-semibold mb-3 uppercase tracking-widest" style={{ color: "#14b8a6" }}>Pricing</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Start free. Upgrade when ready.</h2>
          <p className="text-lg mb-12" style={{ color: "rgba(255,255,255,0.5)" }}>
            A full-featured demo requires no account. When you&apos;re ready to connect real accounts, plans start at <span className="text-white font-semibold">$14.99 AUD/month</span>.
          </p>
          <div className="grid sm:grid-cols-2 gap-6 mb-10">
            <div className="p-8 rounded-3xl text-left" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <p className="text-xs uppercase tracking-widest mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>Demo</p>
              <div className="text-4xl font-bold text-white mb-2">Free</div>
              <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.5)" }}>No signup required</p>
              {["Full AI dashboard preview", "Sample transaction data", "All features unlocked"].map(f => (
                <div key={f} className="flex items-center gap-3 mb-3">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: "#22c55e" }} />
                  <span className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>{f}</span>
                </div>
              ))}
            </div>
            <div className="p-8 rounded-3xl text-left relative overflow-hidden" style={{ background: "linear-gradient(135deg,rgba(139,92,246,0.2),rgba(109,40,217,0.1))", border: "1px solid rgba(139,92,246,0.4)" }}>
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold" style={{ background: "#8b5cf6", color: "#fff" }}>Popular</div>
              <p className="text-xs uppercase tracking-widest mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>Premium</p>
              <div className="text-4xl font-bold text-white mb-1">$14.99</div>
              <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.5)" }}>per month · billed monthly</p>
              {["Connect real bank accounts", "Live AI insights & forecasting", "Subscription detection", "90-day cash flow forecast"].map(f => (
                <div key={f} className="flex items-center gap-3 mb-3">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: "#22c55e" }} />
                  <span className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>{f}</span>
                </div>
              ))}
            </div>
          </div>
          <Link href="/pricing" className="inline-flex items-center gap-2 text-sm hover:text-white transition-colors" style={{ color: "rgba(255,255,255,0.5)" }}>
            See full pricing <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── BLOG / INSIGHTS ──────────────────────────────────────────────── */}
      <section className="relative z-10 py-28 px-6" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-sm font-semibold mb-3 uppercase tracking-widest" style={{ color: "#f59e0b" }}>Financial Insights</p>
              <h2 className="text-4xl md:text-5xl font-bold text-white">Learn from the blog</h2>
            </div>
            <Link href="/blog" className="hidden md:inline-flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-full transition-all hover:scale-105" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}>
              All posts <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Featured post — large */}
          <Link href={`/blog/${FEATURED_BLOGS[0].slug}`} className="block mb-6 group">
            <div className="p-8 md:p-12 rounded-3xl relative overflow-hidden transition-all duration-300 hover:scale-[1.01]"
              style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.25)", minHeight: "200px" }}>
              <div className="absolute top-0 right-0 w-80 h-80 rounded-full" style={{ background: "radial-gradient(circle,rgba(139,92,246,0.15),transparent 70%)", transform: "translate(30%,-30%)" }} />
              <div className="relative">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4" style={{ background: `${FEATURED_BLOGS[0].categoryColor}22`, color: FEATURED_BLOGS[0].categoryColor, border: `1px solid ${FEATURED_BLOGS[0].categoryColor}44` }}>
                  {FEATURED_BLOGS[0].category}
                </span>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 max-w-2xl">{FEATURED_BLOGS[0].title}</h3>
                <p className="text-base max-w-2xl mb-6" style={{ color: "rgba(255,255,255,0.55)" }}>{FEATURED_BLOGS[0].excerpt}</p>
                <div className="flex items-center gap-3">
                  <span className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>{FEATURED_BLOGS[0].readTime}</span>
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium group-hover:gap-2.5 transition-all" style={{ color: FEATURED_BLOGS[0].categoryColor }}>
                    Read article <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* Remaining posts — 2-column grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURED_BLOGS.slice(1).map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
                <div className="h-full p-6 rounded-2xl transition-all duration-300 hover:scale-[1.02]"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold mb-4" style={{ background: `${post.categoryColor}18`, color: post.categoryColor }}>
                    {post.category}
                  </span>
                  <h3 className="text-base font-bold text-white mb-2 leading-snug">{post.title}</h3>
                  <p className="text-xs leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.45)" }}>{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>{post.readTime}</span>
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: post.categoryColor }} />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8 md:hidden">
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-full" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}>
              All posts <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────────────── */}
      <section className="relative z-10 py-32 px-6" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-8" style={{ background: "rgba(139,92,246,0.2)", border: "1px solid rgba(139,92,246,0.3)" }}>
            <Sparkles className="w-8 h-8" style={{ color: "#a78bfa" }} />
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Take control of your finances today.
          </h2>
          <p className="text-lg mb-10" style={{ color: "rgba(255,255,255,0.5)" }}>
            No credit card required. See your AI financial dashboard in 60 seconds.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <ShimmerButton
              onClick={handleDemoMode}
              shimmerColor="rgba(139,92,246,0.3)"
              className="h-14 px-10 rounded-2xl text-base font-semibold"
              style={{ background: "linear-gradient(135deg,#ffffff,#f0edf5)", color: "#0a0a0f", boxShadow: "0 4px 32px rgba(139,92,246,0.3)" }}
            >
              <Play className="w-5 h-5 mr-2" />
              Try the Live Demo
            </ShimmerButton>
            <Button asChild className="h-14 px-8 rounded-2xl text-base font-semibold" style={{ background: "rgba(139,92,246,0.2)", border: "1px solid rgba(139,92,246,0.4)", color: "#fff" }}>
              <Link href="/signup">Create Free Account <ArrowRight className="ml-2 w-5 h-5" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
      <div className="relative z-10">
        <SiteFooter variant="dark" />
      </div>

      {/* ── FLOATING CTA ───────────────────────────────────────────────────── */}
      {showFloatingCta && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50" style={{ animation: "fadeInUp 300ms ease forwards" }}>
          <ShimmerButton
            onClick={handleDemoMode}
            shimmerColor="rgba(139,92,246,0.4)"
            className="h-12 px-6 rounded-full text-sm font-semibold shadow-2xl"
            style={{ background: "linear-gradient(135deg,#8b5cf6,#6d28d9)", color: "#fff", boxShadow: "0 8px 32px rgba(139,92,246,0.4)" }}
          >
            <Play className="w-4 h-4 mr-1.5" />
            Try Demo — Free
          </ShimmerButton>
        </div>
      )}
    </main>
  )
}
