"use client"

import React, { useEffect, useState, useCallback, useMemo } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@supabase/supabase-js"
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
  ChevronRight, CheckCircle, Menu, X,
} from "lucide-react"

// ── Blog helpers ──────────────────────────────────────────────────────────────
const BLOG_COLORS = [
  "#8b5cf6","#22c55e","#14b8a6","#f59e0b",
  "#ec4899","#6366f1","#ef4444","#0ea5e9",
]
const BLOG_CATEGORIES = [
  "AI Insights","Cash Flow","Detection","Budgeting",
  "Health Score","Goals","Debt","Alerts","Savings","Analytics",
]
type BlogPost = {
  slug: string
  category: string
  color: string
  title: string
  excerpt: string
  readTime: string
}

// ── Data ─────────────────────────────────────────────────────────────────────

const FEATURED_BLOGS = [
  {
    slug: "ai-spending-insights",
    category: "AI Insights",
    color: "#8b5cf6",
    title: "How AI Analyses Your Spending Patterns",
    excerpt: "Machine learning categorises every transaction and surfaces opportunities to save money automatically.",
    readTime: "4 min",
  },
  {
    slug: "ai-future-balance-forecasting",
    category: "Cash Flow",
    color: "#22c55e",
    title: "Predicting Your Future Balance with AI",
    excerpt: "See how 12 months of transaction history powers 30, 60, and 90-day cash flow forecasts.",
    readTime: "5 min",
  },
  {
    slug: "subscription-detection",
    category: "Detection",
    color: "#14b8a6",
    title: "Never Miss a Subscription Charge Again",
    excerpt: "Recurring payments are automatically detected and surfaced before they hit your account.",
    readTime: "3 min",
  },
  {
    slug: "financial-health-score",
    category: "Health Score",
    color: "#f59e0b",
    title: "Understanding Your Financial Health Score",
    excerpt: "One number summarising income, expenses, savings rate, and debt — updated every sync.",
    readTime: "4 min",
  },
  {
    slug: "save-for-house-deposit-faster-australia",
    category: "Goals",
    color: "#ec4899",
    title: "Save for a House Deposit Faster",
    excerpt: "Data-backed strategies for Australians looking to accelerate their path to home ownership.",
    readTime: "6 min",
  },
] as BlogPost[]

// ── Supabase blog client (lazy singleton) ─────────────────────────────────────
let _blogClient: ReturnType<typeof createClient> | null = null
function getBlogClient() {
  if (!_blogClient) {
    _blogClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_BLOGS_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_BLOGS_ANON_KEY!
    )
  }
  return _blogClient
}

const FEATURES = [
  { icon: Brain,      color: "#8b5cf6", title: "AI Financial Copilot",     desc: "Ask anything about your finances in plain English and get instant, personalised answers." },
  { icon: TrendingUp, color: "#22c55e", title: "Cash Flow Forecasting",    desc: "30, 60, and 90-day projections built from 12 months of your real transaction history." },
  { icon: PieChart,   color: "#14b8a6", title: "Auto Categorisation",      desc: "Every transaction is sorted instantly — groceries, bills, dining, investments — no tagging needed." },
  { icon: Bell,       color: "#f59e0b", title: "Subscription Detection",   desc: "Recurring charges are automatically surfaced so you never pay for forgotten subscriptions." },
  { icon: CreditCard, color: "#ec4899", title: "Multi-Account View",       desc: "Link all your Australian bank accounts and see your complete picture in one dashboard." },
  { icon: Shield,     color: "#6366f1", title: "Bank-Grade Security",      desc: "CDR-compliant open banking. Read-only. Your credentials never touch our servers." },
]

const STEPS = [
  { n: "01", color: "#8b5cf6", title: "Connect Your Bank",        desc: "Securely link Australian bank accounts in under 60 seconds via CDR open banking — no credentials stored." },
  { n: "02", color: "#22c55e", title: "AI Analyses Your Data",    desc: "Our engine processes your history, categorises spending, detects subscriptions, and builds your forecast." },
  { n: "03", color: "#14b8a6", title: "Get Personalised Insights", desc: "See your health score, cash flow forecast, spending breakdown, and AI recommendations — all in one place." },
]

const TRUST = [
  { icon: Lock,         label: "CDR Compliant",         desc: "Australian Consumer Data Right" },
  { icon: Shield,       label: "Read-Only Access",      desc: "We can never move your money" },
  { icon: Zap,          label: "256-bit Encryption",    desc: "Bank-grade data protection" },
  { icon: CheckCircle,  label: "No Credentials Stored", desc: "Your login never touches us" },
]

// ── BankCarousel ──────────────────────────────────────────────────────────────
const AU_BANKS = [
  "Commonwealth Bank", "Westpac", "ANZ", "NAB", "Macquarie Bank",
  "ING Australia", "Bendigo Bank", "Bank of Queensland",
]

const BANK_LOGOS: Record<string, string> = {
  "Commonwealth Bank": "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/e8fd4372-97f9-456e-8a89-5f706e9b2df0.jpeg",
  "Westpac": "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3191f7f3-c8bc-49df-9c6b-5f47c2a2e136.jpeg",
  "ANZ": "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5c8457b6-deee-4641-a244-c79fd8feaaef.jpeg",
  "NAB": "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/67df0813-90b3-45bc-9a1e-b0b83a12ea2c.jpeg",
  "Macquarie Bank": "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/67df0813-90b3-45bc-9a1e-b0b83a12ea2c.jpeg",
  "ING Australia": "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/f78e453d-ebe2-4765-8edb-5132da8a67dc.jpeg",
  "Bendigo Bank": "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ca6d6b72-329d-41c3-af1b-820f980f225e.jpeg",
  "Bank of Queensland": "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/f21160e0-f6d1-4311-9d65-857bbf7a846c.jpeg",
}

function BankCarousel() {
  // Duplicate for seamless loop
  const items = [...AU_BANKS, ...AU_BANKS]
  return (
    <section className="relative z-10 py-16 sm:py-24 px-0" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-8 sm:mb-12 text-center">
        <p className="text-xs sm:text-sm font-semibold mb-2 sm:mb-3 uppercase tracking-widest" style={{ color: "#14b8a6" }}>Accredited &amp; Connected</p>
        <h2 className="font-bold text-white" style={{ fontSize: "clamp(1.75rem, 5vw, 3rem)" }}>
          Works with your bank
        </h2>
        <p className="mt-3 text-sm sm:text-base max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.45)" }}>
          Connect securely via CDR open banking — no passwords shared.
        </p>
      </div>

      {/* Carousel track — full bleed, edge fades */}
      <div className="relative overflow-hidden"
        style={{
          maskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
        }}
      >
        <div className="bank-ticker-track py-2">
          {items.map((bank, i) => (
            <div
              key={i}
              className="flex-shrink-0 mx-3"
              style={{ width: 148 }}
            >
              <div
                className="rounded-2xl flex flex-col items-center gap-3 p-4"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  transition: "border-color 0.2s",
                }}
              >
                {/* Bank logo image */}
                <img
                  src={BANK_LOGOS[bank]}
                  alt={bank}
                  className="w-full rounded-xl object-contain"
                  style={{ height: 56 }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── LaunchTimeline ────────────────────────────────────────────────────────────
const US_LAUNCH = new Date("2026-05-04T00:00:00Z")

function LaunchTimeline() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    function tick() {
      const diff = Math.max(0, US_LAUNCH.getTime() - Date.now())
      setTimeLeft({
        days:    Math.floor(diff / 86_400_000),
        hours:   Math.floor((diff % 86_400_000) / 3_600_000),
        minutes: Math.floor((diff % 3_600_000)  / 60_000),
        seconds: Math.floor((diff % 60_000)     / 1_000),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  const pad = (n: number) => String(n).padStart(2, "0")

  return (
    <section className="relative z-10 py-14 sm:py-20 px-4 sm:px-6" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">

        {/* ── Australia ── */}
        <div className="relative rounded-3xl overflow-hidden p-6 sm:p-8"
          style={{ background: "linear-gradient(135deg, rgba(20,184,166,0.12) 0%, rgba(34,197,94,0.08) 100%)", border: "1px solid rgba(20,184,166,0.25)" }}>
          {/* Subtle glow blob */}
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full pointer-events-none"
            style={{ background: "rgba(20,184,166,0.18)", filter: "blur(48px)" }} />

          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🇦🇺</span>
              <span className="text-xs sm:text-sm font-bold uppercase tracking-widest" style={{ color: "#14b8a6" }}>Launching Soon</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1">Coming to Australia…then the USA…</h2>
            <p className="text-sm sm:text-base" style={{ color: "rgba(255,255,255,0.55)" }}>
              myaibank.ai is officially launching. Be first in line.
            </p>
          </div>
        </div>

      </div>
    </section>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function WelcomePage() {
  const { user, profile, loading } = useAuth()
  const router    = useRouter()
  const pathname  = usePathname()

  const [mounted,          setMounted]          = useState(false)
  const [mobileMenuOpen,   setMobileMenuOpen]   = useState(false)
  const [navScrolled,      setNavScrolled]      = useState(false)
  const [loadingTimedOut,  setLoadingTimedOut]  = useState(false)
  const [featuredBlogs,    setFeaturedBlogs]    = useState<BlogPost[]>(FEATURED_BLOGS)

  const effectiveLoading = useMemo(() => loading && !loadingTimedOut, [loading, loadingTimedOut])

  // Fetch live blog posts from Supabase so homepage links match the actual slugs
  // used by the blog index page — prevents landing on broken static folder pages.
  useEffect(() => {
    getBlogClient()
      .from("myaibank_posts")
      .select("slug, title, description")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(5)
      .then(({ data }) => {
        if (data && data.length > 0) {
          setFeaturedBlogs(
            data.map((post, i) => ({
              slug:     post.slug as string,
              category: BLOG_CATEGORIES[i % BLOG_CATEGORIES.length],
              color:    BLOG_COLORS[i % BLOG_COLORS.length],
              title:    post.title as string,
              excerpt:  (post.description as string) ?? "",
              readTime: "4 min",
            }))
          )
        }
      })
      .catch(() => { /* keep FEATURED_BLOGS fallback */ })
  }, [])

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
    const dest  = getNextRoute(state, pathname)
    if (dest) router.replace(dest)
  }, [user, profile, effectiveLoading, router, mounted, pathname])

  useEffect(() => {
    // Close mobile menu on route change
    setMobileMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    // Prevent body scroll when mobile menu open
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [mobileMenuOpen])

  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        setNavScrolled(window.scrollY > 60)
        ticking = false
      })
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
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

  const navLinks = [
    ["Features", "/features"],
    ["Pricing",  "/pricing"],
    ["Blog",     "/blog"],
    ["Security", "/security"],
  ]

  return (
    <main className="min-h-screen flex flex-col" style={{ backgroundColor: "#050508", color: "#fff" }}>

      {/* Loading overlay */}
      {effectiveLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "#050508" }} aria-hidden="true">
          <div className="animate-pulse">
            <Image src="/MABtransparent.png" alt="" width={72} height={28} className="object-contain opacity-40" />
          </div>
        </div>
      )}

      <AuroraBackground className="fixed inset-0 pointer-events-none" />

      {/* ── NAV ──────────────────────────────────────────────────────────── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          borderBottom:    navScrolled ? "1px solid rgba(255,255,255,0.08)" : "1px solid transparent",
          backdropFilter:  navScrolled ? "blur(20px)"                       : "none",
          backgroundColor: navScrolled ? "rgba(5,5,8,0.88)"                 : "transparent",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/" aria-label="MyAiBank home" className="flex-shrink-0">
            <Image src="/MABtransparent.png" alt="MyAiBank" width={80} height={32} className="object-contain w-16 h-auto sm:w-20" priority />
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map(([label, href]) => (
              <Link key={href} href={href} className="text-sm transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.6)" }}>
                {label}
              </Link>
            ))}
          </div>

          {/* Desktop right actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="text-sm transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.6)" }}>
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

          {/* Mobile: Try Demo + hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <ShimmerButton
              onClick={handleDemoMode}
              shimmerColor="rgba(139,92,246,0.4)"
              className="h-9 px-4 rounded-full text-xs font-medium"
              style={{ background: "linear-gradient(135deg,#8b5cf6,#6d28d9)", color: "#fff" }}
            >
              Try Demo
            </ShimmerButton>
            <button
              onClick={() => setMobileMenuOpen(o => !o)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              className="w-10 h-10 flex items-center justify-center rounded-xl transition-colors"
              style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
            </button>
          </div>
        </div>

        {/* Mobile menu drawer */}
        {mobileMenuOpen && (
          <div
            className="md:hidden fixed inset-0 top-[57px] z-40 flex flex-col px-4 pt-6 pb-10 gap-2"
            style={{ backgroundColor: "rgba(5,5,8,0.97)", backdropFilter: "blur(16px)" }}
          >
            {navLinks.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-4 px-4 rounded-2xl text-base font-medium transition-colors hover:text-white"
                style={{ color: "rgba(255,255,255,0.7)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}
              >
                {label}
              </Link>
            ))}
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-4 px-4 rounded-2xl text-base font-medium"
              style={{ color: "rgba(255,255,255,0.7)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}
            >
              Log in
            </Link>
            <div className="mt-4">
              <Button asChild className="w-full h-14 rounded-2xl text-base font-semibold" style={{ background: "rgba(139,92,246,0.25)", border: "1px solid rgba(139,92,246,0.4)", color: "#fff" }}>
                <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                  Create Free Account <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6 pt-20 pb-16">
        <div className="w-full max-w-4xl mx-auto">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full mb-6 sm:mb-8 text-xs sm:text-sm"
            style={{ background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.3)", color: "#a78bfa" }}>
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
            AI-Powered Finance for Australians
          </div>

          {/* Headline — fluid: 36px → 72px */}
          <h1 className="font-heading font-bold leading-tight mb-4 sm:mb-6 text-white"
            style={{ fontSize: "clamp(2.25rem, 7vw, 4.5rem)" }}>
            Your money,{" "}
            <span style={{ background: "linear-gradient(135deg,#8b5cf6,#22c55e)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              understood.
            </span>
          </h1>

          <p className="text-base sm:text-lg lg:text-xl leading-relaxed mb-8 sm:mb-10 max-w-xl sm:max-w-2xl mx-auto" style={{ color: "rgba(255,255,255,0.6)" }}>
            Connect your Australian bank accounts and let AI analyse your finances, forecast cash flow, and surface insights that actually help you save more.
          </p>

          {/* CTAs — stacked on mobile, side-by-side on sm+ */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-16 w-full">
            <ShimmerButton
              onClick={handleDemoMode}
              shimmerColor="rgba(139,92,246,0.3)"
              className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-8 rounded-2xl text-sm sm:text-base font-semibold"
              style={{ background: "linear-gradient(135deg,#ffffff,#f0edf5)", color: "#0a0a0f", boxShadow: "0 4px 32px rgba(139,92,246,0.25)" }}
            >
              <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
              Try the Live Demo
            </ShimmerButton>
            <Button asChild className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-8 rounded-2xl text-sm sm:text-base font-semibold"
              style={{ background: "rgba(139,92,246,0.2)", border: "1px solid rgba(139,92,246,0.4)", color: "#fff" }}>
              <Link href="/signup">
                Get Started Free
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
            </Button>
          </div>

          {/* Stats — scrolls horizontally on very small screens */}
          <div className="flex items-center justify-center gap-6 sm:gap-10 lg:gap-16 overflow-x-auto pb-2">
            {[
              { val: 98,  suf: "%",  label: "Categorisation accuracy" },
              { val: 60,  suf: "s",  label: "Bank connection time" },
              { val: 24,  suf: "/7", label: "AI insights" },
            ].map(({ val, suf, label }) => (
              <div key={label} className="text-center flex-shrink-0">
                <div className="font-bold text-white" style={{ fontSize: "clamp(1.75rem, 5vw, 2.5rem)" }}>
                  <CountUp to={val} suffix={suf} duration={2800} />
                </div>
                <div className="text-xs sm:text-sm mt-1 whitespace-nowrap" style={{ color: "rgba(255,255,255,0.45)" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BANK CAROUSEL ────────────────────────────────────────────────── */}
      <BankCarousel />

      {/* ── LAUNCH TIMELINE ──────────────────────────────────────────────── */}
      <LaunchTimeline />

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section className="relative z-10 py-20 sm:py-28 px-4 sm:px-6" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <p className="text-xs sm:text-sm font-semibold mb-2 sm:mb-3 uppercase tracking-widest" style={{ color: "#8b5cf6" }}>Simple Setup</p>
            <h2 className="font-bold text-white" style={{ fontSize: "clamp(1.75rem, 5vw, 3rem)" }}>Up and running in 3 steps</h2>
          </div>

          {/* 1 col → 3 col */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
            {STEPS.map(({ n, color, title, desc }) => (
              <div key={n} className="relative p-6 sm:p-8 rounded-3xl"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="text-5xl sm:text-6xl font-bold mb-4 sm:mb-6 leading-none" style={{ color, opacity: 0.22 }}>{n}</div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-2">{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>{desc}</p>
                <div className="absolute top-6 right-6 w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────────────── */}
      <section className="relative z-10 py-20 sm:py-28 px-4 sm:px-6" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <p className="text-xs sm:text-sm font-semibold mb-2 sm:mb-3 uppercase tracking-widest" style={{ color: "#22c55e" }}>Everything Included</p>
            <h2 className="font-bold text-white mb-3 sm:mb-4" style={{ fontSize: "clamp(1.75rem, 5vw, 3rem)" }}>
              One platform for your whole financial life
            </h2>
            <p className="text-sm sm:text-base lg:text-lg max-w-2xl mx-auto" style={{ color: "rgba(255,255,255,0.5)" }}>
              From categorisation to 90-day cash flow forecasting — all powered by AI, updated every time your bank syncs.
            </p>
          </div>

          {/* 1 col → 2 col → 3 col */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
            {FEATURES.map(({ icon: Icon, color, title, desc }) => (
              <div key={title}
                className="group p-5 sm:p-7 rounded-3xl transition-all duration-300 hover:scale-[1.02]"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center mb-4 sm:mb-5" style={{ background: `${color}22` }}>
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" style={{ color }} />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-2">{title}</h3>
                <p className="text-xs sm:text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST / SECURITY STRIP ───────────────────────────────────────── */}
      <section className="relative z-10 py-14 sm:py-20 px-4 sm:px-6"
        style={{ background: "rgba(139,92,246,0.07)", borderTop: "1px solid rgba(139,92,246,0.15)", borderBottom: "1px solid rgba(139,92,246,0.15)" }}>
        <div className="max-w-6xl mx-auto">
          {/* 2 col on mobile, 4 col on md+ */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
            {TRUST.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex flex-col items-center gap-2 sm:gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center" style={{ background: "rgba(139,92,246,0.2)" }}>
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: "#a78bfa" }} />
                </div>
                <div>
                  <p className="font-semibold text-white text-xs sm:text-sm">{label}</p>
                  <p className="text-xs mt-0.5 hidden sm:block" style={{ color: "rgba(255,255,255,0.45)" }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING TEASER ───────────────────────────────────────────────── */}
      <section className="relative z-10 py-20 sm:py-28 px-4 sm:px-6" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs sm:text-sm font-semibold mb-2 sm:mb-3 uppercase tracking-widest" style={{ color: "#14b8a6" }}>Pricing</p>
          <h2 className="font-bold text-white mb-4 sm:mb-6" style={{ fontSize: "clamp(1.75rem, 5vw, 3rem)" }}>
            Start free. Upgrade when ready.
          </h2>
          <p className="text-sm sm:text-base lg:text-lg mb-8 sm:mb-12 max-w-2xl mx-auto" style={{ color: "rgba(255,255,255,0.5)" }}>
            A full-featured demo needs no account. When you&apos;re ready to connect real accounts, plans start at{" "}
            <span className="text-white font-semibold">$14.99 AUD/month</span>.
          </p>

          {/* Stack on mobile, side-by-side on sm+ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 mb-8 sm:mb-10 text-left">
            {/* Free */}
            <div className="p-6 sm:p-8 rounded-3xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <p className="text-xs uppercase tracking-widest mb-3 sm:mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>Demo</p>
              <div className="text-3xl sm:text-4xl font-bold text-white mb-1">Free</div>
              <p className="text-sm mb-5 sm:mb-6" style={{ color: "rgba(255,255,255,0.5)" }}>No signup required</p>
              {["Full AI dashboard preview", "Sample transaction data", "All features unlocked"].map(f => (
                <div key={f} className="flex items-center gap-3 mb-2 sm:mb-3">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: "#22c55e" }} />
                  <span className="text-xs sm:text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>{f}</span>
                </div>
              ))}
              <ShimmerButton
                onClick={handleDemoMode}
                shimmerColor="rgba(255,255,255,0.2)"
                className="w-full h-12 rounded-2xl text-sm font-semibold mt-4 sm:mt-6"
                style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff" }}
              >
                Try Demo Now
              </ShimmerButton>
            </div>

            {/* Premium */}
            <div className="p-6 sm:p-8 rounded-3xl relative overflow-hidden"
              style={{ background: "linear-gradient(135deg,rgba(139,92,246,0.2),rgba(109,40,217,0.1))", border: "1px solid rgba(139,92,246,0.4)" }}>
              <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: "#8b5cf6", color: "#fff" }}>Popular</div>
              <p className="text-xs uppercase tracking-widest mb-3 sm:mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>Premium</p>
              <div className="text-3xl sm:text-4xl font-bold text-white mb-1">$14.99</div>
              <p className="text-sm mb-5 sm:mb-6" style={{ color: "rgba(255,255,255,0.5)" }}>per month · billed monthly</p>
              {["Connect real bank accounts", "Live AI insights & forecasting", "Subscription detection", "90-day cash flow forecast"].map(f => (
                <div key={f} className="flex items-center gap-3 mb-2 sm:mb-3">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: "#22c55e" }} />
                  <span className="text-xs sm:text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>{f}</span>
                </div>
              ))}
              <Button asChild className="w-full h-12 rounded-2xl text-sm font-semibold mt-4 sm:mt-6"
                style={{ background: "linear-gradient(135deg,#8b5cf6,#6d28d9)", color: "#fff", border: "none" }}>
                <Link href="/signup">Get Started <ArrowRight className="ml-2 w-4 h-4" /></Link>
              </Button>
            </div>
          </div>

          <Link href="/pricing" className="inline-flex items-center gap-1.5 text-xs sm:text-sm hover:text-white transition-colors" style={{ color: "rgba(255,255,255,0.5)" }}>
            See full pricing <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── BLOG ─────────────────────────────────────────────────────────── */}
      <section className="relative z-10 py-20 sm:py-28 px-4 sm:px-6" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-7xl mx-auto">

          {/* Header row */}
          <div className="flex items-end justify-between mb-8 sm:mb-12">
            <div>
              <p className="text-xs sm:text-sm font-semibold mb-2 sm:mb-3 uppercase tracking-widest" style={{ color: "#f59e0b" }}>Financial Insights</p>
              <h2 className="font-bold text-white" style={{ fontSize: "clamp(1.75rem, 5vw, 3rem)" }}>Learn from the blog</h2>
            </div>
            <Link href="/blog"
              className="hidden sm:inline-flex items-center gap-2 text-xs sm:text-sm font-medium px-4 sm:px-5 py-2 sm:py-2.5 rounded-full transition-all hover:scale-105"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}>
              All posts <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Link>
          </div>

          {/* Featured — large card */}
          <Link href={`/blog/${featuredBlogs[0].slug}`} className="block mb-4 sm:mb-5 group">
            <div className="p-6 sm:p-10 lg:p-12 rounded-3xl relative overflow-hidden transition-all duration-300 hover:scale-[1.01]"
              style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.25)" }}>
              <div className="absolute top-0 right-0 w-48 h-48 sm:w-80 sm:h-80 rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle,rgba(139,92,246,0.15),transparent 70%)", transform: "translate(30%,-30%)" }} />
              <div className="relative">
                <span className="inline-block px-2.5 sm:px-3 py-1 rounded-full text-xs font-semibold mb-3 sm:mb-4"
                  style={{ background: `${featuredBlogs[0].color}22`, color: featuredBlogs[0].color, border: `1px solid ${featuredBlogs[0].color}44` }}>
                  {featuredBlogs[0].category}
                </span>
                <h3 className="font-bold text-white mb-2 sm:mb-3 max-w-2xl" style={{ fontSize: "clamp(1.2rem, 4vw, 1.875rem)" }}>
                  {featuredBlogs[0].title}
                </h3>
                <p className="text-sm sm:text-base max-w-2xl mb-4 sm:mb-6" style={{ color: "rgba(255,255,255,0.55)" }}>
                  {featuredBlogs[0].excerpt}
                </p>
                <div className="flex items-center gap-3 sm:gap-4">
                  <span className="text-xs sm:text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>{featuredBlogs[0].readTime} read</span>
                  <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium group-hover:gap-2.5 transition-all" style={{ color: featuredBlogs[0].color }}>
                    Read article <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* Grid: 1 col → 2 col → 4 col */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {featuredBlogs.slice(1).map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
                <div className="h-full p-5 sm:p-6 rounded-2xl transition-all duration-300 hover:scale-[1.02]"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold mb-3 sm:mb-4"
                    style={{ background: `${post.color}18`, color: post.color }}>
                    {post.category}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-white mb-2 leading-snug">{post.title}</h3>
                  <p className="text-xs leading-relaxed mb-3 sm:mb-4" style={{ color: "rgba(255,255,255,0.45)" }}>{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>{post.readTime} read</span>
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: post.color }} />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Mobile-only "All posts" button */}
          <div className="sm:hidden text-center mt-6">
            <Link href="/blog"
              className="inline-flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-full"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}>
              All posts <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────────────── */}
      <section className="relative z-10 py-24 sm:py-32 px-4 sm:px-6" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-3xl flex items-center justify-center mx-auto mb-6 sm:mb-8"
            style={{ background: "rgba(139,92,246,0.2)", border: "1px solid rgba(139,92,246,0.3)" }}>
            <Sparkles className="w-7 h-7 sm:w-8 sm:h-8" style={{ color: "#a78bfa" }} />
          </div>
          <h2 className="font-bold text-white mb-4 sm:mb-6" style={{ fontSize: "clamp(2rem, 6vw, 3.75rem)" }}>
            Take control of your finances today.
          </h2>
          <p className="text-sm sm:text-base lg:text-lg mb-8 sm:mb-10" style={{ color: "rgba(255,255,255,0.5)" }}>
            No credit card required. See your AI financial dashboard in 60 seconds.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <ShimmerButton
              onClick={handleDemoMode}
              shimmerColor="rgba(139,92,246,0.3)"
              className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-10 rounded-2xl text-sm sm:text-base font-semibold"
              style={{ background: "linear-gradient(135deg,#ffffff,#f0edf5)", color: "#0a0a0f", boxShadow: "0 4px 32px rgba(139,92,246,0.3)" }}
            >
              <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
              Try the Live Demo
            </ShimmerButton>
            <Button asChild className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-8 rounded-2xl text-sm sm:text-base font-semibold"
              style={{ background: "rgba(139,92,246,0.2)", border: "1px solid rgba(139,92,246,0.4)", color: "#fff" }}>
              <Link href="/signup">Create Free Account <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
      <div className="relative z-10">
        <SiteFooter variant="dark" />
      </div>

    </main>
  )
}
