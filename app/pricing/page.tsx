import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { SiteFooter } from "@/components/site-footer"
import { MotionFadeIn } from "@/components/motion-fade-in"
import { CheckCircle, X, Sparkles, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Pricing | MyAiBank — $0/month. No fine print.",
  description:
    "MyAiBank is free. No monthly fee, no card fee, no fee to send or receive money via PayID. Compare against big banks and premium fintechs.",
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: "Pricing | MyAiBank",
    description:
      "Honest pricing. No fine print. One plan. Everything included.",
    url: "/pricing",
    type: "website",
    siteName: "MyAiBank",
    locale: "en_AU",
  },
}

type CellValue =
  | { kind: "text"; value: string }
  | { kind: "included" }
  | { kind: "not-offered" }
  | { kind: "premium-only" }

interface Row {
  label: string
  myaibank: CellValue
  bigBanks: CellValue
  premiumFintechs: CellValue
}

const COMPARISON: Row[] = [
  {
    label: "Monthly fee",
    myaibank: { kind: "text", value: "$0" },
    bigBanks: { kind: "text", value: "$5–15 / mo" },
    premiumFintechs: { kind: "text", value: "$14.99–29.99 / mo" },
  },
  {
    label: "Card fee",
    myaibank: { kind: "text", value: "$0" },
    bigBanks: { kind: "text", value: "$0" },
    premiumFintechs: { kind: "text", value: "$0–9.99" },
  },
  {
    label: "AI financial insights",
    myaibank: { kind: "included" },
    bigBanks: { kind: "not-offered" },
    premiumFintechs: { kind: "premium-only" },
  },
  {
    label: "PayID transfers",
    myaibank: { kind: "text", value: "$0" },
    bigBanks: { kind: "text", value: "$0" },
    premiumFintechs: { kind: "text", value: "$0" },
  },
  {
    label: "Subscription detection",
    myaibank: { kind: "included" },
    bigBanks: { kind: "not-offered" },
    premiumFintechs: { kind: "premium-only" },
  },
]

const FAQ = [
  {
    q: "Is there really no monthly fee?",
    a: "Yes. MyAiBank is free to use. We charge no monthly fee, no card fee, and no fee to send or receive money via PayID. We plan to generate revenue through interchange — the small fee merchants pay when you tap your card — not from charging you.",
  },
  {
    q: "When does the physical card arrive?",
    a: "Physical cards are scheduled to ship Q3 2026 to waitlist members first. Virtual cards are available instantly on signup.",
  },
  {
    q: "What happens to my money if MyAiBank closes?",
    a: "Your funds are held by Shaype under Australian financial services law — not by MyAiBank. If MyAiBank ceased operating, your money would remain accessible through Shaype.",
  },
  {
    q: "Is this regulated?",
    a: "Yes. MyAiBank operates as a Corporate Authorised Representative of Hay Limited (AFSL 515459). Card and payment services are issued under Shaype's Australian financial services licence.",
  },
]

function Cell({ value }: { value: CellValue }) {
  switch (value.kind) {
    case "text":
      return (
        <span className="text-sm sm:text-base font-semibold text-white">
          {value.value}
        </span>
      )
    case "included":
      return (
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#3b82f6]">
          <CheckCircle className="w-4 h-4" /> Included
        </span>
      )
    case "not-offered":
      return (
        <span className="inline-flex items-center gap-1.5 text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
          <X className="w-4 h-4" /> Not offered
        </span>
      )
    case "premium-only":
      return (
        <span className="inline-flex items-center gap-1.5 text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
          Premium only
        </span>
      )
  }
}

export default function PricingPage() {
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
              ["Features", "/features"],
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
            Pricing
          </p>
          <h1
            className="font-bold text-white mb-5"
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", lineHeight: 1.1 }}
          >
            Honest pricing. No fine print.
          </h1>
          <p
            className="text-base sm:text-lg max-w-2xl mx-auto"
            style={{ color: "rgba(255,255,255,0.65)" }}
          >
            One plan. Everything included. No upgrades required to access basic features.
          </p>
        </MotionFadeIn>
      </section>

      {/* Comparison */}
      <section
        className="px-4 sm:px-6 lg:px-10 py-10 sm:py-16"
        style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
      >
        <MotionFadeIn className="max-w-5xl mx-auto">
          {/* Column headers */}
          <div className="grid grid-cols-4 gap-2 sm:gap-4 mb-4">
            <div />
            <div
              className="relative p-4 sm:p-5 rounded-2xl text-center bg-[#111827]"
              style={{
                border: "2px solid rgba(59,130,246,0.55)",
                boxShadow: "0 0 32px rgba(59,130,246,0.2)",
              }}
            >
              <div
                className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full"
                style={{ background: "linear-gradient(135deg,#3b82f6,#1d4ed8)", color: "#fff" }}
              >
                <Sparkles className="w-3 h-3" />
                Best value
              </div>
              <p className="text-xs sm:text-sm font-bold text-white mt-1">MyAiBank</p>
            </div>
            <div
              className="p-4 sm:p-5 rounded-2xl text-center"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <p className="text-xs sm:text-sm font-semibold" style={{ color: "rgba(255,255,255,0.65)" }}>
                Big banks
              </p>
            </div>
            <div
              className="p-4 sm:p-5 rounded-2xl text-center"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <p className="text-xs sm:text-sm font-semibold" style={{ color: "rgba(255,255,255,0.65)" }}>
                Premium fintechs
              </p>
            </div>
          </div>

          {/* Rows */}
          <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
            {COMPARISON.map((row, i) => (
              <div
                key={row.label}
                className="grid grid-cols-4 gap-2 sm:gap-4 items-center px-3 sm:px-5 py-4 sm:py-5"
                style={{
                  background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent",
                  borderTop: i === 0 ? "none" : "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div className="text-xs sm:text-sm font-medium" style={{ color: "rgba(255,255,255,0.75)" }}>
                  {row.label}
                </div>
                <div
                  className="text-center px-2 py-2 rounded-lg"
                  style={{
                    background: "rgba(59,130,246,0.08)",
                    border: "1px solid rgba(59,130,246,0.25)",
                  }}
                >
                  <Cell value={row.myaibank} />
                </div>
                <div className="text-center">
                  <Cell value={row.bigBanks} />
                </div>
                <div className="text-center">
                  <Cell value={row.premiumFintechs} />
                </div>
              </div>
            ))}
          </div>
        </MotionFadeIn>
      </section>

      {/* FAQ */}
      <section
        className="px-4 sm:px-6 lg:px-10 py-16 sm:py-24"
        style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="max-w-3xl mx-auto">
          <MotionFadeIn className="text-center mb-10 sm:mb-14">
            <p
              className="text-xs sm:text-sm font-semibold uppercase tracking-widest mb-3"
              style={{ color: "#3b82f6" }}
            >
              FAQ
            </p>
            <h2
              className="font-bold text-white"
              style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)" }}
            >
              Questions, answered.
            </h2>
          </MotionFadeIn>

          <div className="space-y-4">
            {FAQ.map(({ q, a }, i) => (
              <MotionFadeIn
                key={q}
                delay={i * 0.08}
                className="p-5 sm:p-6 rounded-2xl bg-[#111827] border border-[#1e293b]"
              >
                <h3 className="font-semibold text-white mb-2 text-sm sm:text-base">
                  {q}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "rgba(255,255,255,0.65)" }}
                >
                  {a}
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
