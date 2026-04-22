import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { SiteFooter } from "@/components/site-footer"
import { MotionFadeIn } from "@/components/motion-fade-in"
import { CreditCard, Brain, Send, PiggyBank, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Features | MyAiBank — A card, an AI, instant transfers, smart savings",
  description:
    "The MyAiWallet Visa card, an AI financial assistant trained by financial advisors, PayID transfers under 10 seconds, and AI-powered smart savings. Four features, built properly.",
  alternates: { canonical: "/features" },
  openGraph: {
    title: "Features | MyAiBank",
    description:
      "Everything you need. Nothing you don't. We built four things and built them properly.",
    url: "/features",
    type: "website",
    siteName: "MyAiBank",
    locale: "en_AU",
  },
}

const FEATURES = [
  {
    icon: CreditCard,
    heading: "MyAiWallet Visa Card",
    body:
      "A physical and virtual Visa debit card issued under Shaype's Australian financial services licence. Tap anywhere Visa is accepted globally. Add to Apple Pay or Google Pay instantly. No annual fee. No foreign transaction fees on the roadmap. Your card is live in your phone within 60 seconds of signup.",
    pill: "Physical card shipping Q3 2026",
  },
  {
    icon: Brain,
    heading: "AI Financial Assistant",
    body:
      "Ask anything about your money in plain English and get a real answer in seconds. How much did I spend on dining last month? Am I on track to save my house deposit? What subscriptions am I paying for that I don't use? Our assistant is trained on financial advisor methodology — not scraped from Reddit. It knows your spending, your patterns, and your goals.",
    pill: "Trained by financial advisors",
  },
  {
    icon: Send,
    heading: "PayID Transfers",
    body:
      "Send money to any Australian bank account using just a phone number or email address. Transfers settle in under 10 seconds via Australia's New Payments Platform. No BSB lookup. No waiting until business hours. Send at midnight on a Sunday and it arrives in seconds.",
    pill: "NPP — Under 10 seconds",
  },
  {
    icon: PiggyBank,
    heading: "Smart Savings",
    body:
      "On every payday, our AI analyses your upcoming bills, your current balance, and your savings goal. It tells you the exact amount you can move to savings without creating a shortfall. One tap. Done. No spreadsheet, no willpower, no forgetting.",
    pill: "Powered by Claude AI",
  },
]

export default function FeaturesPage() {
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
              ["What We Do", "/what-we-do"],
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
      <section className="relative px-4 sm:px-6 lg:px-10 pt-20 sm:pt-28 pb-14 sm:pb-20 text-center overflow-hidden">
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
            Features
          </p>
          <h1
            className="font-bold text-white mb-5"
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", lineHeight: 1.1 }}
          >
            Everything you need.{" "}
            <span
              style={{
                background: "linear-gradient(135deg,#3b82f6,#60a5fa)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Nothing you don&apos;t.
            </span>
          </h1>
          <p
            className="text-base sm:text-lg max-w-2xl mx-auto"
            style={{ color: "rgba(255,255,255,0.65)" }}
          >
            We built four things and built them properly.
          </p>
        </MotionFadeIn>
      </section>

      {/* Feature deep-dives */}
      <section
        className="px-4 sm:px-6 lg:px-10 py-10 sm:py-16"
        style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">
          {FEATURES.map(({ icon: Icon, heading, body, pill }, i) => (
            <MotionFadeIn
              key={heading}
              delay={i * 0.08}
              className="p-7 sm:p-10 rounded-3xl bg-[#111827] border border-[#1e293b]"
            >
              <div className="flex items-start gap-5 sm:gap-7 flex-col sm:flex-row">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "rgba(59,130,246,0.15)",
                    border: "1px solid rgba(59,130,246,0.3)",
                  }}
                >
                  <Icon className="w-7 h-7" style={{ color: "#3b82f6" }} />
                </div>
                <div className="flex-1">
                  <h2
                    className="font-bold text-white mb-3"
                    style={{ fontSize: "clamp(1.5rem, 3.2vw, 2rem)" }}
                  >
                    {heading}
                  </h2>
                  <p
                    className="text-sm sm:text-base leading-relaxed mb-5"
                    style={{ color: "rgba(255,255,255,0.65)" }}
                  >
                    {body}
                  </p>
                  <span
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium px-4 py-2 rounded-full"
                    style={{
                      background: "rgba(59,130,246,0.12)",
                      border: "1px solid rgba(59,130,246,0.3)",
                      color: "#93c5fd",
                    }}
                  >
                    {pill}
                  </span>
                </div>
              </div>
            </MotionFadeIn>
          ))}
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
