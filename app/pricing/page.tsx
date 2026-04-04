import type { Metadata } from "next"
import Link from "next/link"
import { SiteFooter } from "@/components/site-footer"

export const metadata: Metadata = {
  title: "Pricing | MyAiBank — Free AI Money Management",
  description:
    "MyAiBank is free for early adopters. Sign up today and get full access to AI budgeting, cashflow forecasting, subscription detection, and more.",
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: "Pricing | MyAiBank — Free AI Money Management",
    description:
      "MyAiBank is free for early adopters. Sign up today and get full access to AI budgeting, cashflow forecasting, subscription detection, and more.",
    url: "/pricing",
    type: "website",
    siteName: "MyAiBank",
    locale: "en_AU",
  },
}

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#fff", color: "#1a1a1a" }}>
      <header className="px-6 py-4 border-b" style={{ borderColor: "#e5e5e5" }}>
        <div className="max-w-3xl mx-auto flex items-center gap-3 flex-wrap">
          <Link href="/" className="text-sm hover:underline" style={{ color: "#666" }}>
            ← Home
          </Link>
          <span style={{ color: "#ccc" }}>|</span>
          <Link href="/features" className="text-sm hover:underline" style={{ color: "#666" }}>
            Features
          </Link>
          <span style={{ color: "#ccc" }}>|</span>
          <Link href="/signup" className="text-sm hover:underline" style={{ color: "#666" }}>
            Get Started
          </Link>
        </div>
      </header>

      <main className="flex-1 px-6 py-10 max-w-3xl mx-auto w-full">
        <h1 className="text-3xl font-bold mb-3" style={{ color: "#180D27" }}>
          Pricing
        </h1>
        <p className="text-base leading-relaxed mb-10" style={{ color: "#555" }}>
          MyAiBank is currently <strong>free for early adopters</strong> in Australia.
          Get full access to every feature — no credit card required.
        </p>

        {/* Free tier card */}
        <div
          className="p-8 rounded-2xl border-2 mb-8"
          style={{ borderColor: "#7c3aed", backgroundColor: "#f5f3ff" }}
        >
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h2 className="text-2xl font-bold" style={{ color: "#180D27" }}>
              Early Adopter — Free
            </h2>
            <span
              className="px-3 py-1 rounded-full text-xs font-semibold text-white"
              style={{ backgroundColor: "#7c3aed" }}
            >
              Limited spots
            </span>
          </div>
          <p className="text-sm mb-6" style={{ color: "#555" }}>
            Full access while we grow our community. No hidden fees.
          </p>
          <ul className="space-y-3 mb-8">
            {[
              "AI-powered transaction categorisation",
              "Cash flow dashboard and spending analytics",
              "Subscription and bill detection",
              "AI financial assistant (ask anything)",
              "Cashflow forecasting",
              "Financial health score",
              "Mortgage rate alerts",
              "Bank-grade encryption and security",
              "Connect your Australian bank accounts",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm" style={{ color: "#444" }}>
                <span style={{ color: "#7c3aed", flexShrink: 0 }}>✓</span>
                {item}
              </li>
            ))}
          </ul>
          <Link
            href="/signup"
            className="block w-full text-center px-6 py-4 rounded-xl text-base font-semibold text-white"
            style={{ backgroundColor: "#7c3aed" }}
          >
            Get Started Free
          </Link>
        </div>

        {/* FAQ */}
        <section>
          <h2 className="text-xl font-semibold mb-4" style={{ color: "#180D27" }}>
            Pricing FAQ
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "Is MyAiBank really free?",
                a: "Yes. MyAiBank is free for the first 500 early adopters. We are growing our user base before introducing paid plans.",
              },
              {
                q: "Will pricing change in the future?",
                a: "We plan to introduce a paid plan for new users once we scale. Early adopters will receive preferential pricing.",
              },
              {
                q: "Do I need a credit card to sign up?",
                a: "No. Sign up with your email or Google account — no payment details required during the early adopter period.",
              },
              {
                q: "What features are included?",
                a: "All features listed above are included in the free plan. See our features page for a full breakdown.",
              },
            ].map((faq) => (
              <div
                key={faq.q}
                className="p-4 rounded-xl border"
                style={{ borderColor: "#e5e5e5" }}
              >
                <h3 className="font-medium mb-1" style={{ color: "#180D27" }}>{faq.q}</h3>
                <p className="text-sm" style={{ color: "#666" }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-8 text-center">
          <Link href="/features" className="text-sm hover:underline" style={{ color: "#7c3aed" }}>
            ← View all features
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
