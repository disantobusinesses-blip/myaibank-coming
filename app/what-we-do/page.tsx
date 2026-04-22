import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { SiteFooter } from "@/components/site-footer"
import { MotionFadeIn } from "@/components/motion-fade-in"
import { ArrowRight, CreditCard, Brain, ShieldCheck } from "lucide-react"

export const metadata: Metadata = {
  title: "What We Do | MyAiBank — A premium card, an AI that gets money, zero fees",
  description:
    "MyAiBank gives every Australian access to a premium Visa card, an AI financial assistant trained by financial advisors, and a platform with zero hidden fees.",
  keywords:
    "MyAiBank, AI money manager, MyAiWallet card, AI financial assistant Australia, no fee debit card Australia",
  alternates: { canonical: "/what-we-do" },
  openGraph: {
    title: "What We Do | MyAiBank",
    description:
      "A premium card, an AI that actually understands your money, and zero hidden fees. That is the whole product.",
    url: "/what-we-do",
    type: "website",
    siteName: "MyAiBank",
    locale: "en_AU",
  },
}

const MISSION_COLUMNS = [
  {
    icon: CreditCard,
    heading: "Affordable Premium Card",
    body:
      "The MyAiWallet Visa card gives every Australian access to a premium debit card with zero monthly fees. No minimum balance. No credit check. Just a card that works.",
  },
  {
    icon: Brain,
    heading: "AI Trained by Financial Advisors",
    body:
      "Our AI financial assistant is not a generic chatbot. It is trained on real financial advice methodology so it gives you the kind of guidance you would pay a human advisor for — free, in seconds.",
  },
  {
    icon: ShieldCheck,
    heading: "No Surprises. Ever.",
    body:
      "No hidden fees. No premium tiers that lock away basic features. No subscription required to send money. We charge nothing until we earn your trust.",
  },
]

const VALUES = [
  {
    heading: "Your money is yours.",
    body:
      "We hold nothing, gate nothing, and charge nothing you did not explicitly agree to.",
  },
  {
    heading: "AI should serve people, not impress them.",
    body:
      "Our AI gives you specific, actionable answers. Not generic budgeting tips. Not upsells disguised as insights.",
  },
  {
    heading: "Simple is harder to build.",
    body:
      "We deliberately removed features that would confuse rather than help. Every screen we ship has a purpose.",
  },
  {
    heading: "Financial access is not a luxury.",
    body:
      "Premium financial tools have always been reserved for the wealthy. We are changing that.",
  },
]

export default function WhatWeDoPage() {
  return (
    <main className="min-h-screen flex flex-col bg-[#0a0f1e] text-white">
      <header
        className="sticky top-0 z-50"
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          backgroundColor: "rgba(10,15,30,0.92)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-3 sm:py-4 flex items-center justify-between">
          <Link href="/">
            <Image
              src="/MABtransparent.png"
              alt="MyAiBank"
              width={80}
              height={32}
              className="object-contain w-16 h-auto sm:w-20"
            />
          </Link>
          <nav className="hidden sm:flex items-center gap-5 lg:gap-8">
            {[
              ["Features", "/features"],
              ["Pricing", "/pricing"],
              ["Security", "/security"],
              ["Blog", "/blog"],
            ].map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="text-sm hover:text-white transition-colors"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                {label}
              </Link>
            ))}
          </nav>
          <Link
            href="/#waitlist"
            className="h-9 px-4 rounded-full text-xs sm:text-sm font-semibold hover:scale-105 transition-all inline-flex items-center"
            style={{
              background: "linear-gradient(135deg,#3b82f6,#1d4ed8)",
              color: "#fff",
            }}
          >
            Join Waitlist
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative px-4 sm:px-6 lg:px-10 pt-20 sm:pt-28 pb-16 sm:pb-24 text-center overflow-hidden">
        <div
          aria-hidden
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[320px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse, rgba(59,130,246,0.16), transparent 70%)",
          }}
        />
        <MotionFadeIn className="relative max-w-3xl mx-auto">
          <p
            className="text-xs sm:text-sm font-semibold uppercase tracking-widest mb-3"
            style={{ color: "#3b82f6" }}
          >
            What we do
          </p>
          <h1
            className="font-bold text-white mb-5"
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", lineHeight: 1.1 }}
          >
            We built what we wished existed.
          </h1>
          <p
            className="text-base sm:text-lg max-w-2xl mx-auto"
            style={{ color: "rgba(255,255,255,0.65)" }}
          >
            A premium card, an AI that actually understands your money, and zero hidden fees. That is the whole product.
          </p>
        </MotionFadeIn>
      </section>

      {/* Mission */}
      <section
        className="px-4 sm:px-6 lg:px-10 py-16 sm:py-24"
        style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="max-w-6xl mx-auto">
          <MotionFadeIn className="text-center mb-12 sm:mb-16">
            <h2
              className="font-bold text-white"
              style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)" }}
            >
              Our Mission
            </h2>
          </MotionFadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {MISSION_COLUMNS.map(({ icon: Icon, heading, body }, i) => (
              <MotionFadeIn
                key={heading}
                delay={i * 0.1}
                className="p-6 sm:p-8 rounded-3xl bg-[#111827] border border-[#1e293b] h-full"
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                  style={{
                    background: "rgba(59,130,246,0.15)",
                    border: "1px solid rgba(59,130,246,0.3)",
                  }}
                >
                  <Icon className="w-6 h-6" style={{ color: "#3b82f6" }} />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">{heading}</h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "rgba(255,255,255,0.6)" }}
                >
                  {body}
                </p>
              </MotionFadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section
        className="px-4 sm:px-6 lg:px-10 py-16 sm:py-24"
        style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="max-w-5xl mx-auto">
          <MotionFadeIn className="text-center mb-12 sm:mb-16">
            <p
              className="text-xs sm:text-sm font-semibold uppercase tracking-widest mb-3"
              style={{ color: "#3b82f6" }}
            >
              Values
            </p>
            <h2
              className="font-bold text-white"
              style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)" }}
            >
              What We Actually Believe
            </h2>
          </MotionFadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            {VALUES.map(({ heading, body }, i) => (
              <MotionFadeIn
                key={heading}
                delay={i * 0.1}
                className="p-6 sm:p-8 rounded-3xl bg-[#111827] border border-[#1e293b]"
              >
                <div className="h-px bg-gradient-to-r from-blue-500/50 to-transparent mb-5" />
                <h3 className="text-lg sm:text-xl font-bold text-white mb-3">
                  {heading}
                </h3>
                <p
                  className="text-sm sm:text-base leading-relaxed"
                  style={{ color: "rgba(255,255,255,0.6)" }}
                >
                  {body}
                </p>
              </MotionFadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="px-4 sm:px-6 lg:px-10 py-20 sm:py-28"
        style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
      >
        <MotionFadeIn className="max-w-2xl mx-auto text-center">
          <h2
            className="font-bold text-white mb-4"
            style={{ fontSize: "clamp(1.5rem, 4vw, 2.25rem)" }}
          >
            Join the waitlist. No credit card. No commitment.
          </h2>
          <p
            className="text-sm sm:text-base mb-8"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            Be first to the MyAiWallet card when it launches in Australia.
          </p>
          <Link
            href="/#waitlist"
            className="inline-flex items-center gap-2 h-12 sm:h-14 px-6 sm:px-8 rounded-2xl text-sm sm:text-base font-semibold transition-all hover:scale-105"
            style={{
              background: "linear-gradient(135deg,#3b82f6,#1d4ed8)",
              color: "#fff",
              boxShadow: "0 4px 32px rgba(59,130,246,0.35)",
            }}
          >
            Join the Waitlist <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
        </MotionFadeIn>
      </section>

      <SiteFooter variant="dark" />
    </main>
  )
}
