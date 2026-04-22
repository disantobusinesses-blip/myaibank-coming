import type { Metadata } from "next"
import Link from "next/link"
import { SiteFooter } from "@/components/site-footer"
import { Shield, Lock, Eye, Database, UserCheck, FileText, CreditCard, Brain } from "lucide-react"

export const metadata: Metadata = {
  title: "Security | MyAiBank — Bank-Grade Protection",
  description:
    "MyAiBank is built on bank-grade infrastructure. Learn how we protect your financial data, your accounts, and your privacy.",
  alternates: { canonical: "/security" },
  openGraph: {
    title: "Security | MyAiBank — Bank-Grade Protection",
    description:
      "MyAiBank is built on bank-grade infrastructure. Learn how we protect your financial data, your accounts, and your privacy.",
    url: "/security",
    type: "website",
    siteName: "MyAiBank",
    locale: "en_AU",
  },
}

const principles = [
  {
    icon: Lock,
    color: "#3b82f6",
    title: "Encryption in transit and at rest",
    description:
      "All data is encrypted using TLS 1.3 in transit and AES-256 at rest. Your financial data is protected whether it is being transmitted or stored.",
  },
  {
    icon: Eye,
    color: "#8b5cf6",
    title: "We never sell your data",
    description:
      "Your personal and financial data is used only to power your account and your AI financial advisor. We do not sell, rent, or share your data with advertisers or third parties.",
  },
  {
    icon: Database,
    color: "#3b82f6",
    title: "Minimal data collection",
    description:
      "We collect only what is required to operate your account and deliver AI-powered insights: transactions, balances, and account metadata. Nothing more.",
  },
  {
    icon: UserCheck,
    color: "#8b5cf6",
    title: "Secure authentication",
    description:
      "MyAiBank uses industry-standard authentication including Google OAuth and secure session tokens. Multi-factor authentication is supported for all accounts.",
  },
  {
    icon: CreditCard,
    color: "#3b82f6",
    title: "Regulated banking infrastructure",
    description:
      "Account and card services are provided through Shaype, a licensed Banking-as-a-Service partner operating under Australian financial services regulations. Your funds and card are held and issued under a regulated framework.",
  },
  {
    icon: Brain,
    color: "#8b5cf6",
    title: "AI advisor — finance only",
    description:
      "Our AI financial advisor is trained and constrained to financial topics only. It cannot initiate transactions or access data beyond your own account. All AI responses are generated without storing your conversation history.",
  },
  {
    icon: FileText,
    color: "#3b82f6",
    title: "Privacy Act compliance",
    description:
      "We comply with the Privacy Act 1988 (Cth) and the Australian Privacy Principles (APPs). You have the right to access, correct, or request deletion of your personal information at any time.",
  },
  {
    icon: Shield,
    color: "#8b5cf6",
    title: "Fraud monitoring and alerts",
    description:
      "Real-time transaction monitoring flags unusual activity on your account. You are notified immediately and can freeze your card instantly from within the app.",
  },
]

export default function SecurityPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#0a0f1e", color: "#fff" }}>
      <header className="px-6 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="max-w-4xl mx-auto flex items-center gap-3 flex-wrap">
          <Link href="/" className="text-sm transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.5)" }}>
            ← Home
          </Link>
          <span style={{ color: "rgba(255,255,255,0.2)" }}>|</span>
          <Link href="/features" className="text-sm transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.5)" }}>
            Features
          </Link>
          <span style={{ color: "rgba(255,255,255,0.2)" }}>|</span>
          <Link href="/privacy" className="text-sm transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.5)" }}>
            Privacy Policy
          </Link>
        </div>
      </header>

      <main className="flex-1 px-6 py-14 max-w-4xl mx-auto w-full">

        {/* Hero */}
        <div className="mb-14">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 text-xs font-semibold uppercase tracking-widest"
            style={{ background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.3)", color: "#93c5fd" }}
          >
            <Shield className="w-3 h-3 flex-shrink-0" />
            Security
          </div>
          <h1 className="font-bold text-white mb-4" style={{ fontSize: "clamp(2rem, 5vw, 3rem)", lineHeight: 1.15 }}>
            Built for banking.{" "}
            <span style={{ background: "linear-gradient(135deg,#3b82f6,#60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Secured like a bank.
            </span>
          </h1>
          <p className="text-base sm:text-lg leading-relaxed max-w-2xl" style={{ color: "rgba(255,255,255,0.6)" }}>
            MyAiBank is a full banking software platform with an AI financial advisor layer built on top. That means your money, your account, and your data are all held to the same standards as a traditional bank — plus the transparency of a modern fintech.
          </p>
        </div>

        {/* Principle cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-14">
          {principles.map(({ icon: Icon, color, title, description }) => (
            <div
              key={title}
              className="p-6 rounded-3xl"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: `${color}22` }}
              >
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <h2 className="text-base font-semibold text-white mb-2">{title}</h2>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
                {description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          className="p-8 rounded-3xl text-center"
          style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.25)" }}
        >
          <h2 className="text-lg font-semibold text-white mb-2">
            Questions about security or privacy?
          </h2>
          <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.55)" }}>
            Contact us at{" "}
            <a
              href="mailto:privacy@myaibank.ai"
              className="hover:underline"
              style={{ color: "#60a5fa" }}
            >
              privacy@myaibank.ai
            </a>{" "}
            or read our full{" "}
            <Link href="/privacy" className="hover:underline" style={{ color: "#60a5fa" }}>
              Privacy Policy
            </Link>
            .
          </p>
          <Link
            href="/signup"
            className="inline-block px-6 py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: "linear-gradient(135deg,#3b82f6,#1d4ed8)" }}
          >
            Get Started Free
          </Link>
        </div>
      </main>

      <SiteFooter variant="dark" />
    </div>
  )
}

