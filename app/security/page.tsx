import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { SiteFooter } from "@/components/site-footer"
import { MotionFadeIn } from "@/components/motion-fade-in"
import { ShieldCheck, Eye, Lock, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Security | MyAiBank — Regulated, read-only AI, bank-grade encryption",
  description:
    "MyAiBank operates under Australian financial services law. Our AI is read-only, our encryption is bank-grade, and your funds are held by Shaype — not MyAiBank.",
  alternates: { canonical: "/security" },
  openGraph: {
    title: "Security | MyAiBank",
    description:
      "Your money is safe. Here is exactly why. Regulated infrastructure, read-only AI, bank-grade encryption.",
    url: "/security",
    type: "website",
    siteName: "MyAiBank",
    locale: "en_AU",
  },
}

const PILLARS = [
  {
    icon: ShieldCheck,
    heading: "Regulated Australian Infrastructure",
    body:
      "MyAiBank is a Corporate Authorised Representative of Hay Limited (AFSL 515459). Card and payment services are issued by Shaype, a licensed Australian financial services provider. Every dollar you load is held under Australian financial services law — not stored in an app.",
  },
  {
    icon: Eye,
    heading: "Read-Only AI. Always.",
    body:
      "Our AI assistant analyses your transaction data but can never initiate payments without your explicit approval. Every money movement requires a separate confirmation in the app. The AI advises. You decide. Always.",
  },
  {
    icon: Lock,
    heading: "Bank-Grade Encryption",
    body:
      "All data transmitted between the MyAiBank app and our servers uses 256-bit TLS encryption — the same standard used by Australia's major banks. Your card details are tokenised and never stored on our servers in readable form.",
  },
]

const LEGAL_DISCLOSURE =
  "MyAiBank is a financial technology platform operated by AI Capital Holdings Pty Ltd (ACN 693 023 371). MyAiBank is a Corporate Authorised Representative of Hay Limited (AFSL 515459). MyAiBank is not an Authorised Deposit-taking Institution under the Banking Act 1959. Card and payment services are issued by Shaype (Hay Limited). Your funds are held by Shaype, not MyAiBank. MyAiBank does not hold, invest, or lend your money."

export default function SecurityPage() {
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
              ["Pricing", "/pricing"],
              ["Privacy", "/privacy"],
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
            Security
          </p>
          <h1
            className="font-bold text-white mb-5"
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", lineHeight: 1.1 }}
          >
            Your money is safe. Here is exactly why.
          </h1>
          <p
            className="text-base sm:text-lg max-w-2xl mx-auto"
            style={{ color: "rgba(255,255,255,0.65)" }}
          >
            We are not a bank. We are something more careful.
          </p>
        </MotionFadeIn>
      </section>

      {/* Pillars */}
      <section
        className="px-4 sm:px-6 lg:px-10 py-10 sm:py-16"
        style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">
          {PILLARS.map(({ icon: Icon, heading, body }, i) => (
            <MotionFadeIn
              key={heading}
              delay={i * 0.1}
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
                    style={{ fontSize: "clamp(1.25rem, 3vw, 1.75rem)" }}
                  >
                    {heading}
                  </h2>
                  <p
                    className="text-sm sm:text-base leading-relaxed"
                    style={{ color: "rgba(255,255,255,0.65)" }}
                  >
                    {body}
                  </p>
                </div>
              </div>
            </MotionFadeIn>
          ))}
        </div>
      </section>

      {/* Legal disclosure */}
      <section
        className="px-4 sm:px-6 lg:px-10 py-16 sm:py-24"
        style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
      >
        <MotionFadeIn className="max-w-4xl mx-auto">
          <p
            className="text-xs sm:text-sm font-semibold uppercase tracking-widest mb-4"
            style={{ color: "#3b82f6" }}
          >
            Legal disclosure
          </p>
          <h2
            className="font-bold text-white mb-6"
            style={{ fontSize: "clamp(1.5rem, 4vw, 2.25rem)" }}
          >
            The fine print, plainly stated.
          </h2>
          <div
            className="p-6 sm:p-8 rounded-3xl"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <p
              className="text-sm sm:text-base leading-relaxed"
              style={{ color: "rgba(255,255,255,0.7)" }}
            >
              {LEGAL_DISCLOSURE}
            </p>
          </div>
        </MotionFadeIn>
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
