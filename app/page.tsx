"use client"

import React, { useEffect, useState, useCallback, useMemo, useRef } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { createClient } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { SiteFooter } from "@/components/site-footer"
import { ShimmerButton } from "@/components/shimmer-button"
import { AuroraBackground } from "@/components/aurora-background"
import { CountUp } from "@/components/count-up"
import { CountdownTimer } from "@/components/ui/countdown-timer"
import { useAuth } from "@/contexts/auth-context"
import { getNextRoute, buildRoutingState } from "@/lib/routing"
import {
  ArrowRight, Shield, TrendingUp,
  Brain, CreditCard, Lock, Zap, Send,
  ChevronRight, CheckCircle, Menu, X, PiggyBank,
  Globe, Clock,
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
    excerpt: "One number summarising income, expenses, savings rate, and debt, updated every sync.",
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

// ── Newsletter Supabase client (lazy singleton) ────────────────────────────────
let _newsletterClient: ReturnType<typeof createClient> | null = null
function getNewsletterClient() {
  if (!_newsletterClient) {
    _newsletterClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  return _newsletterClient
}

// ── Section data ──────────────────────────────────────────────────────────────

const FEATURES = [
  { icon: Send,       color: "#3b82f6", title: "Send and Receive Money",    desc: "Instant transfers via PayID. Send to any Australian bank in seconds." },
  { icon: CreditCard, color: "#3b82f6", title: "MyAiWallet Visa Card",      desc: "A Visa debit card that lives in your phone. Physical card coming soon." },
  { icon: Brain,      color: "#3b82f6", title: "AI Financial Assistant",    desc: "Ask anything about your money. Get real answers, not generic tips." },
  { icon: PiggyBank,  color: "#3b82f6", title: "Smart Savings",             desc: "AI analyses your pay cycle and automatically moves money to savings at the right time." },
]

const STEPS = [
  { n: "01", color: "#3b82f6", title: "Create your account",           desc: "Sign up in under 60 seconds. No paperwork." },
  { n: "02", color: "#3b82f6", title: "Get your virtual card",         desc: "Instant Visa virtual card issued to your phone." },
  { n: "03", color: "#3b82f6", title: "Add money and start spending",  desc: "Deposit via PayID, send to anyone, spend anywhere Visa is accepted." },
]

const TRUST_BADGES = [
  { label: "Visa",                subtext: "Card issuing" },
  { label: "Shaype",              subtext: "Licensed BaaS partner" },
  { label: "PayID and NPP",       subtext: "Real-time payments" },
  { label: "256-bit Encryption",  subtext: "Bank-grade security" },
]

const AI_FEATURE_CARDS = [
  { src: "/videos/feature-1.mp4" },
  { src: "/videos/feature-2.mp4" },
]

// ── Stats bar animated count (self-contained, uses IntersectionObserver) ─────
function AnimatedCount({
  target,
  suffix = "",
  formatThousands = false,
  duration = 2000,
}: {
  target: number
  suffix?: string
  formatThousands?: boolean
  duration?: number
}) {
  const ref = useRef<HTMLSpanElement | null>(null)
  const [value, setValue] = useState(0)
  const startedRef = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const start = () => {
      if (startedRef.current) return
      startedRef.current = true
      const startTime = performance.now()
      const step = (now: number) => {
        const elapsed = now - startTime
        const t = Math.min(1, elapsed / duration)
        // easeOutCubic
        const eased = 1 - Math.pow(1 - t, 3)
        setValue(Math.round(eased * target))
        if (t < 1) requestAnimationFrame(step)
      }
      requestAnimationFrame(step)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            start()
            observer.disconnect()
            break
          }
        }
      },
      { threshold: 0.2 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [target, duration])

  const formatted = formatThousands ? value.toLocaleString() : value.toString()

  return <span ref={ref}>{formatted}{suffix}</span>
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

  // Newsletter state
  const [waitlistCount,  setWaitlistCount]  = useState<number | null>(null)
  const [waitlistName,   setWaitlistName]   = useState("")
  const [waitlistEmail,  setWaitlistEmail]  = useState("")
  const [submitting,     setSubmitting]     = useState(false)
  const [submitted,      setSubmitted]      = useState(false)
  const [alreadyOnList,  setAlreadyOnList]  = useState(false)
  const [submitError,    setSubmitError]    = useState("")

  const effectiveLoading = useMemo(() => loading && !loadingTimedOut, [loading, loadingTimedOut])

  // Fetch live blog posts from Supabase
  useEffect(() => {
    void getBlogClient()
      .from("myaibank_posts")
      .select("slug, title, description")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(5)
      .then(({ data }) => {
        if (data && data.length > 0) {
          setFeaturedBlogs(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (data as any[]).map((post, i) => ({
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
  }, [])

  // Fetch waitlist count on load
  useEffect(() => {
    void getNewsletterClient()
      .from("myaibank_newsletter_signups")
      .select("*", { count: "exact", head: true })
      .then(({ count }) => {
        if (typeof count === "number") setWaitlistCount(count)
      })
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
    setMobileMenuOpen(false)
  }, [pathname])

  useEffect(() => {
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

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: "smooth" })
    setMobileMenuOpen(false)
  }, [])

  const handleWaitlistSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!waitlistEmail) return
    setSubmitting(true)
    setSubmitError("")
    setAlreadyOnList(false)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (getNewsletterClient() as any)
      .from("myaibank_newsletter_signups")
      .insert({
        email:  waitlistEmail.trim().toLowerCase(),
        name:   waitlistName.trim() || null,
        source: "homepage_waitlist",
      })

    setSubmitting(false)

    if (!error) {
      setSubmitted(true)
      setWaitlistCount(prev => (prev !== null ? prev + 1 : prev))
    } else if (error.code === "23505") {
      // unique constraint violation
      setAlreadyOnList(true)
    } else {
      setSubmitError("Something went wrong. Please try again.")
    }
  }, [waitlistEmail, waitlistName])

  const navLinks = [
    ["Features", "/features"],
    ["Pricing",  "/pricing"],
    ["Blog",     "/blog"],
    ["Security", "/security"],
  ]

  return (
    <main className="min-h-screen flex flex-col" style={{ backgroundColor: "#0a0f1e", color: "#fff" }}>

      {/* Loading overlay */}
      {effectiveLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "#0a0f1e" }} aria-hidden="true">
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
          backgroundColor: navScrolled ? "rgba(10,15,30,0.88)"              : "transparent",
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
              onClick={() => scrollTo("waitlist")}
              shimmerColor="rgba(59,130,246,0.4)"
              className="h-9 px-5 rounded-full text-sm font-medium"
              style={{ background: "linear-gradient(135deg,#3b82f6,#1d4ed8)", color: "#fff" }}
            >
              Join the Waitlist
            </ShimmerButton>
          </div>

          {/* Mobile: Join Waitlist + hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <ShimmerButton
              onClick={() => scrollTo("waitlist")}
              shimmerColor="rgba(59,130,246,0.4)"
              className="h-9 px-4 rounded-full text-xs font-medium"
              style={{ background: "linear-gradient(135deg,#3b82f6,#1d4ed8)", color: "#fff" }}
            >
              Join Waitlist
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
            style={{ backgroundColor: "rgba(10,15,30,0.97)", backdropFilter: "blur(16px)" }}
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
              <Button
                onClick={() => scrollTo("waitlist")}
                className="w-full h-14 rounded-2xl text-base font-semibold"
                style={{ background: "linear-gradient(135deg,#3b82f6,#1d4ed8)", color: "#fff" }}
              >
                Join the Waitlist <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* ── SECTION 1: HERO ──────────────────────────────────────────────── */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6 pt-20 pb-16 overflow-hidden">
        <video
          src="/videos/heroSectionVideo.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover -z-10 pointer-events-none"
        />
        <div className="w-full max-w-4xl mx-auto">

          {/* Headline */}
          <h1 className="font-heading font-bold leading-tight mb-6 sm:mb-8 text-white"
            style={{ fontSize: "clamp(2.25rem, 7vw, 4.5rem)" }}>
            Your money.{" "}
            <span style={{ background: "linear-gradient(135deg,#3b82f6,#60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Smarter. Faster.
            </span>
          </h1>

          {/* Subheadline — left-aligned box, below headline */}
          <div className="w-full max-w-md sm:max-w-lg mx-auto sm:mx-0 mb-8 sm:mb-10 text-left">
            <div
              className="p-5 sm:p-6 rounded-2xl bg-[#111827]/80 border border-[#1e293b] backdrop-blur-sm"
            >
              <p className="text-base sm:text-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>
                Send money, hold a balance, spend with your MyAiWallet Visa card — with an AI trained by financial advisors to understand your needs.
              </p>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-16 w-full">
            <ShimmerButton
              onClick={() => scrollTo("waitlist")}
              shimmerColor="rgba(59,130,246,0.3)"
              className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-8 rounded-2xl text-sm sm:text-base font-semibold"
              style={{ background: "linear-gradient(135deg,#3b82f6,#1d4ed8)", color: "#fff", boxShadow: "0 4px 32px rgba(59,130,246,0.35)" }}
            >
              Join the Waitlist
            </ShimmerButton>
            <Button
              onClick={() => scrollTo("features")}
              className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-8 rounded-2xl text-sm sm:text-base font-semibold"
              style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff" }}
            >
              See How It Works
              <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </div>

        </div>
      </section>

      {/* ── STATS BAR ───────────────────────────────────────────────────── */}
      <motion.section
        className="relative z-10 bg-[#111827] py-14 px-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-center items-center gap-8 sm:gap-0">
          <div className="flex flex-col items-center px-10 md:px-16">
            <div className="text-4xl md:text-5xl font-black text-blue-400 tabular-nums">
              {waitlistCount !== null
                ? <AnimatedCount target={waitlistCount} suffix="+" formatThousands />
                : <span>—</span>
              }
            </div>
            <div className="text-sm text-[#94a3b8] mt-2 text-center">
              Australians on the waitlist
            </div>
          </div>
          <div className="hidden sm:block w-px h-12 bg-[#1e293b] self-center" />
          <div className="flex flex-col items-center px-10 md:px-16">
            <div className="text-4xl md:text-5xl font-black text-blue-400 tabular-nums">
              $0
            </div>
            <div className="text-sm text-[#94a3b8] mt-2 text-center">
              monthly fees at launch
            </div>
          </div>
          <div className="hidden sm:block w-px h-12 bg-[#1e293b] self-center" />
          <div className="flex flex-col items-center px-10 md:px-16">
            <div className="text-4xl md:text-5xl font-black text-blue-400 tabular-nums">
              <AnimatedCount target={60} suffix="s" />
            </div>
            <div className="text-sm text-[#94a3b8] mt-2 text-center">
              to get your virtual card
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── SECTION 2: LAUNCH COUNTDOWN ──────────────────────────────────── */}
      <section className="relative z-10 py-16 sm:py-20 px-4 sm:px-6" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-2xl mx-auto text-center">
          <div
            className="p-8 sm:p-12 rounded-3xl"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(59,130,246,0.25)" }}
          >
            <p className="text-xs sm:text-sm font-semibold mb-3 uppercase tracking-widest" style={{ color: "#3b82f6" }}>
              Coming Soon
            </p>
            <h2 className="font-bold text-white mb-6" style={{ fontSize: "clamp(1.5rem, 5vw, 2.5rem)" }}>
              Australian Launch — Coming Soon
            </h2>
            <CountdownTimer targetDate="2026-09-01T00:00:00+10:00" />
          </div>
        </div>
      </section>

      {/* ── SECTION 3: FEATURES ──────────────────────────────────────────── */}
      <section id="features" className="relative z-10 py-20 sm:py-28 px-4 sm:px-6" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="font-bold text-white" style={{ fontSize: "clamp(1.75rem, 5vw, 3rem)" }}>
              One app. Everything your money needs.
            </h2>
          </div>

          {/* 2×2 grid */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            {FEATURES.map(({ icon: Icon, color, title, desc }, index) => (
              <motion.div
                key={title}
                className="group p-6 sm:p-8 rounded-3xl bg-[#111827] border border-[#1e293b] hover:border-blue-500/30 transition-colors duration-300"
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="h-px bg-gradient-to-r from-blue-500/50 to-transparent mb-6" />
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center mb-4 sm:mb-5" style={{ background: `${color}22` }}>
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" style={{ color }} />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-2">{title}</h3>
                <p className="text-xs sm:text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── SECTION 4: CARD RELEASE ───────────────────────────────────────── */}
      <section className="relative z-10 py-20 sm:py-28 px-4 sm:px-6"
        style={{ background: "rgba(10,15,30,0.8)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-6xl mx-auto text-center mb-10 sm:mb-14">
          <h2 className="font-bold text-white mb-3" style={{ fontSize: "clamp(1.75rem, 5vw, 3rem)" }}>
            Introducing the MyAiWallet Card
          </h2>
          <p className="text-sm sm:text-base" style={{ color: "rgba(255,255,255,0.55)" }}>
            Australia&apos;s first AI-powered Visa debit card. Powered by Shaype.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left column: image with radial glow */}
          <motion.div
            className="relative flex justify-center"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div
              aria-hidden="true"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/15 blur-3xl rounded-full -z-10"
            />
            <Image
              src="/images/hero/CardTapAi (1).png"
              alt="MyAiWallet card being tapped"
              width={900}
              height={900}
              className="rounded-2xl w-full object-cover shadow-2xl shadow-blue-500/20"
            />
          </motion.div>

          {/* Right column: benefits */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-500/15 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Instant virtual card</h3>
                  <p className="text-[#94a3b8] text-sm mt-1">Live in 60 seconds. No paperwork, no waiting.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-500/15 flex items-center justify-center flex-shrink-0">
                  <Globe className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Spend anywhere globally</h3>
                  <p className="text-[#94a3b8] text-sm mt-1">Tap anywhere Visa is accepted in 150+ countries.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-500/15 flex items-center justify-center flex-shrink-0">
                  <Brain className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">AI tracks every dollar</h3>
                  <p className="text-[#94a3b8] text-sm mt-1">Real insights, not generic tips. Powered by Claude.</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <span className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400">
                <Clock className="w-4 h-4" />
                Physical card shipping Q3 2026
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── SECTION 4b: LIFESTYLE (cinematic) ─────────────────────────────── */}
      <section className="relative z-10 overflow-hidden min-h-[500px] md:min-h-[600px] flex">
        <Image
          src="/images/hero/AppleWalletCard (1).png"
          alt=""
          fill
          sizes="100vw"
          style={{ objectFit: "cover" }}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0f1e] via-[#0a0f1e]/75 to-[#0a0f1e]/20" />
        <div className="relative flex flex-col justify-center h-full w-full py-20 pl-6 md:pl-16 lg:pl-24 pr-6">
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-5xl font-black text-white max-w-lg leading-tight">
              Built for how Australians actually live.
            </h2>
            <div className="mt-8 space-y-3 text-[#94a3b8] text-lg">
              <p>Morning coffee — tap and go.</p>
              <p>Rent day — send in seconds.</p>
              <p>Pay day — AI moves your savings automatically.</p>
            </div>
            <button
              type="button"
              onClick={() => scrollTo("waitlist")}
              className="mt-8 inline-flex items-center gap-2 text-blue-400 font-semibold text-lg hover:text-blue-300 transition-colors"
            >
              Join the waitlist →
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── SECTION 4c: AI FEATURES VIDEO PANEL ───────────────────────────── */}
      <section className="relative z-10 bg-[#0a0f1e] py-20 sm:py-28 px-4 sm:px-6" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="mx-auto" style={{ maxWidth: "90vw" }}>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-16 text-center">
            Everything your money needs.
          </h2>
          <motion.div
            className="flex flex-col gap-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            {AI_FEATURE_CARDS.map((card, index) => (
              <motion.div
                key={card.src}
                className="w-full rounded-2xl bg-[#111827] border border-[#1e293b] overflow-hidden aspect-video"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── SECTION 5: NEWSLETTER WAITLIST ───────────────────────────────── */}
      <section id="waitlist" className="relative z-10 py-20 sm:py-28 px-4 sm:px-6 overflow-hidden" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.08)_0%,transparent_70%)]" />
        <div className="relative max-w-xl mx-auto text-center">
          <h2 className="font-bold text-white mb-3" style={{ fontSize: "clamp(1.5rem, 5vw, 2.5rem)" }}>
            Get early access to the MyAiWallet card
          </h2>

          {waitlistCount !== null && (
            <p className="text-sm sm:text-base mb-8" style={{ color: "rgba(255,255,255,0.55)" }}>
              Join <span className="text-white font-semibold">{waitlistCount.toLocaleString()}</span> Australians already on the waitlist.
            </p>
          )}
          {waitlistCount === null && (
            <p className="text-sm sm:text-base mb-8" style={{ color: "rgba(255,255,255,0.55)" }}>
              Join Australians already on the waitlist.
            </p>
          )}

          <div className="p-6 sm:p-8 rounded-3xl bg-[#111827] border border-blue-500/25">
            {submitted ? (
              <p className="text-base sm:text-lg font-semibold text-white py-4">
                You&apos;re on the list. We&apos;ll be in touch.
              </p>
            ) : alreadyOnList ? (
              <p className="text-base sm:text-lg font-semibold text-white py-4">
                You&apos;re already on the list.
              </p>
            ) : (
              <form onSubmit={handleWaitlistSubmit} className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Your name"
                  value={waitlistName}
                  onChange={e => setWaitlistName(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl text-sm bg-white text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-blue-500"
                  autoComplete="name"
                />
                <input
                  type="email"
                  placeholder="Your email address"
                  value={waitlistEmail}
                  onChange={e => setWaitlistEmail(e.target.value)}
                  required
                  className="w-full h-12 px-4 rounded-xl text-sm bg-white text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-blue-500"
                  autoComplete="email"
                />
                {submitError && (
                  <p className="text-xs" style={{ color: "#f87171" }}>{submitError}</p>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-12 rounded-xl text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-50"
                  style={{ background: "linear-gradient(135deg,#3b82f6,#1d4ed8)", color: "#fff" }}
                >
                  {submitting ? "Joining…" : "Join the Waitlist"}
                </button>
              </form>
            )}

            <div className="flex justify-center gap-3 flex-wrap mt-5 pt-5 border-t border-[#1e293b]">
              <span className="text-[#94a3b8] text-xs flex items-center gap-1.5">
                <CheckCircle className="w-3 h-3 text-blue-400" />
                No credit card required
              </span>
              <span className="text-[#94a3b8] text-xs flex items-center gap-1.5">
                <CheckCircle className="w-3 h-3 text-blue-400" />
                Cancel anytime
              </span>
              <span className="text-[#94a3b8] text-xs flex items-center gap-1.5">
                <CheckCircle className="w-3 h-3 text-blue-400" />
                Launching Q3 2026
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 6: HOW IT WORKS ──────────────────────────────────────── */}
      <section className="relative z-10 py-20 sm:py-28 px-4 sm:px-6" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <p className="text-xs sm:text-sm font-semibold mb-2 sm:mb-3 uppercase tracking-widest" style={{ color: "#3b82f6" }}>Simple Setup</p>
            <h2 className="font-bold text-white" style={{ fontSize: "clamp(1.75rem, 5vw, 3rem)" }}>Up and running in minutes</h2>
          </div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 lg:gap-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            {STEPS.map(({ n, color, title, desc }, index) => (
              <motion.div
                key={n}
                className="relative p-6 sm:p-8 rounded-3xl bg-[#111827] border border-[#1e293b]"
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: index * 0.15 }}
              >
                <div className="text-5xl sm:text-6xl font-bold mb-4 sm:mb-6 leading-none" style={{ color, opacity: 0.22 }}>{n}</div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-2">{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>{desc}</p>
                <div className="absolute top-6 right-6 w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── SECTION 7: TRUST ─────────────────────────────────────────────── */}
      <section className="relative z-10 py-14 sm:py-20 px-4 sm:px-6"
        style={{ background: "rgba(59,130,246,0.05)", borderTop: "1px solid rgba(59,130,246,0.15)", borderBottom: "1px solid rgba(59,130,246,0.15)" }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="font-bold text-white text-center mb-8 sm:mb-12" style={{ fontSize: "clamp(1.25rem, 4vw, 2rem)" }}>
            Built on regulated Australian infrastructure
          </h2>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center mb-8 sm:mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            {TRUST_BADGES.map(({ label, subtext }) => (
              <div key={label} className="flex flex-col items-center gap-2 sm:gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center"
                  style={{ background: "rgba(59,130,246,0.18)", border: "1px solid rgba(59,130,246,0.3)" }}>
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: "#3b82f6" }} />
                </div>
                <div>
                  <p className="font-semibold text-white text-xs sm:text-sm">{label}</p>
                  <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>{subtext}</p>
                </div>
              </div>
            ))}
          </motion.div>

          <p className="text-center text-xs max-w-2xl mx-auto leading-relaxed" style={{ color: "rgba(255,255,255,0.35)" }}>
            MyAiBank is a financial technology platform operated by AI Capital Holdings Pty Ltd (ACN 693 023 371). Accounts and payment services are provided by … (…). MyAiBank is not an Authorised Deposit-taking Institution.
          </p>
        </div>
      </section>

      {/* ── SECTION 8: BLOG ──────────────────────────────────────────────── */}
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

      {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
      <div className="relative z-10">
        <SiteFooter variant="dark" />
      </div>

    </main>
  )
}
