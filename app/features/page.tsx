import type { Metadata } from "next"
import Link from "next/link"
import { SiteFooter } from "@/components/site-footer"

export const metadata: Metadata = {
  title: "Features | MyAiBank — AI-Powered Money Management",
  description:
    "Explore all MyAiBank features: AI budgeting, cashflow forecasting, subscription detection, spending analytics, transaction categorisation, and more.",
  alternates: { canonical: "/features" },
  openGraph: {
    title: "Features | MyAiBank — AI-Powered Money Management",
    description:
      "Explore all MyAiBank features: AI budgeting, cashflow forecasting, subscription detection, spending analytics, transaction categorisation, and more.",
    url: "/features",
    type: "website",
    siteName: "MyAiBank",
    locale: "en_AU",
  },
}

const features = [
  {
    title: "AI-Powered Budgeting",
    description:
      "Automatically categorise every transaction, highlight spending patterns, and build monthly summaries. Identify where you overspend and set simple targets that fit your lifestyle.",
    href: "/blog/ai-budget-tracking",
    linkText: "Learn about AI budgeting →",
  },
  {
    title: "Cashflow Forecasting",
    description:
      "Predict your account balance weeks ahead using your transaction history, subscriptions, and spending patterns. Act before problems happen.",
    href: "/blog/ai-future-balance-forecasting",
    linkText: "Learn about forecasting →",
  },
  {
    title: "Spending Analytics Dashboard",
    description:
      "See your income, expenses, and net cash flow at a glance. Break down spending by category, track trends over time, and understand exactly where your money goes.",
    href: "/blog/ai-spending-insights",
    linkText: "Explore spending analytics →",
  },
  {
    title: "Subscription & Bill Detection",
    description:
      "Automatically find recurring charges, subscriptions, and bills. See what each costs over time so you can cancel unused services or plan ahead.",
    href: "/blog/subscription-detection",
    linkText: "See subscription detection →",
  },
  {
    title: "AI Financial Assistant",
    description:
      "Ask anything about your money — \"What did I spend on food last month?\" or \"Show my biggest merchants.\" Get real answers backed by your actual transactions.",
    href: "/blog/ai-transaction-categorisation",
    linkText: "Meet the AI assistant →",
  },
  {
    title: "Financial Health Score",
    description:
      "Understand your overall financial wellbeing with an AI-generated health score. Track income, spending, and savings rate to measure improvement over time.",
    href: "/blog/financial-health-score",
    linkText: "Learn about health scores →",
  },
  {
    title: "Mortgage Rate Alerts",
    description:
      "Stay informed about interest rate changes that could affect your home loan. Get personalised alerts when refinancing opportunities arise.",
    href: "/blog/mortgage-rate-alerts",
    linkText: "See mortgage alerts →",
  },
  {
    title: "Bank-Grade Security",
    description:
      "Your financial data is protected with encryption at rest and in transit. We never store your banking credentials. Read-only access via open banking.",
    href: "/security",
    linkText: "Learn about our security →",
  },
]

export default function FeaturesPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#fff", color: "#1a1a1a" }}>
      <header className="px-6 py-4 border-b" style={{ borderColor: "#e5e5e5" }}>
        <div className="max-w-3xl mx-auto flex items-center gap-3 flex-wrap">
          <Link href="/" className="text-sm hover:underline" style={{ color: "#666" }}>
            ← Home
          </Link>
          <span style={{ color: "#ccc" }}>|</span>
          <Link href="/pricing" className="text-sm hover:underline" style={{ color: "#666" }}>
            Pricing
          </Link>
          <span style={{ color: "#ccc" }}>|</span>
          <Link href="/blog" className="text-sm hover:underline" style={{ color: "#666" }}>
            Blog
          </Link>
          <span style={{ color: "#ccc" }}>|</span>
          <Link href="/signup" className="text-sm hover:underline" style={{ color: "#666" }}>
            Get Started
          </Link>
        </div>
      </header>

      <main className="flex-1 px-6 py-10 max-w-3xl mx-auto w-full">
        <h1 className="text-3xl font-bold mb-3" style={{ color: "#180D27" }}>
          MyAiBank Features
        </h1>
        <p className="text-base leading-relaxed mb-10" style={{ color: "#555" }}>
          Everything you need to understand and manage your money — powered by AI.
          Available now in Australia, with the USA and UK coming soon.
        </p>

        <div className="space-y-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="p-5 rounded-2xl border"
              style={{ borderColor: "#e5e5e5" }}
            >
              <h2 className="text-xl font-semibold mb-2" style={{ color: "#180D27" }}>
                {feature.title}
              </h2>
              <p className="text-sm leading-relaxed mb-3" style={{ color: "#666" }}>
                {feature.description}
              </p>
              <Link
                href={feature.href}
                className="text-xs font-medium hover:underline"
                style={{ color: "#7c3aed" }}
              >
                {feature.linkText}
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-10 p-6 rounded-2xl text-center" style={{ backgroundColor: "#f5f3ff" }}>
          <h2 className="text-xl font-bold mb-2" style={{ color: "#180D27" }}>
            Ready to get started?
          </h2>
          <p className="text-sm mb-4" style={{ color: "#666" }}>
            Sign up free and explore the full demo — no bank connection required.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              href="/signup"
              className="px-6 py-3 rounded-xl text-sm font-semibold text-white"
              style={{ backgroundColor: "#7c3aed" }}
            >
              Get Started Free
            </Link>
            <Link
              href="/pricing"
              className="text-sm hover:underline"
              style={{ color: "#7c3aed" }}
            >
              View Pricing →
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
