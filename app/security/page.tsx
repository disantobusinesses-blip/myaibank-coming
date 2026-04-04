import type { Metadata } from "next"
import Link from "next/link"
import { SiteFooter } from "@/components/site-footer"

export const metadata: Metadata = {
  title: "Security | MyAiBank — Bank-Grade Data Protection",
  description:
    "Learn how MyAiBank protects your financial data with encryption, read-only bank access, and privacy-first principles. Your data is never sold or shared.",
  alternates: { canonical: "/security" },
  openGraph: {
    title: "Security | MyAiBank — Bank-Grade Data Protection",
    description:
      "Learn how MyAiBank protects your financial data with encryption, read-only bank access, and privacy-first principles. Your data is never sold or shared.",
    url: "/security",
    type: "website",
    siteName: "MyAiBank",
    locale: "en_AU",
  },
}

const principles = [
  {
    title: "Read-only bank access",
    description:
      "We connect to your bank accounts via trusted open banking providers (such as Fiskil) with read-only access. We never request permission to move, transfer, or modify funds. Your banking credentials are never stored by MyAiBank.",
  },
  {
    title: "Encryption in transit and at rest",
    description:
      "All data is encrypted using industry-standard TLS in transit and AES-256 at rest. Your financial data is protected whether it is being transmitted or stored.",
  },
  {
    title: "We never sell your data",
    description:
      "Your personal and financial data is used only to generate insights and answers for you. We do not sell, rent, or share your data with advertisers or third-party marketers.",
  },
  {
    title: "Minimal data access",
    description:
      "We request only the data necessary to provide insights — transaction history, account balances, and merchant details. We do not access your personal banking credentials at any point.",
  },
  {
    title: "Secure authentication",
    description:
      "MyAiBank uses industry-standard authentication including Google OAuth and secure session tokens. Multi-factor authentication is supported.",
  },
  {
    title: "Privacy Act compliance",
    description:
      "We comply with the Privacy Act 1988 (Cth) and the Australian Privacy Principles (APPs). You have the right to access, correct, or request deletion of your personal information.",
  },
]

export default function SecurityPage() {
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
          <Link href="/privacy" className="text-sm hover:underline" style={{ color: "#666" }}>
            Privacy Policy
          </Link>
        </div>
      </header>

      <main className="flex-1 px-6 py-10 max-w-3xl mx-auto w-full">
        <h1 className="text-3xl font-bold mb-3" style={{ color: "#180D27" }}>
          Security at MyAiBank
        </h1>
        <p className="text-base leading-relaxed mb-10" style={{ color: "#555" }}>
          Your financial data deserves the highest level of protection. Here is how we keep your information safe.
        </p>

        <div className="space-y-6 mb-10">
          {principles.map((item) => (
            <div
              key={item.title}
              className="p-5 rounded-2xl border"
              style={{ borderColor: "#e5e5e5" }}
            >
              <h2 className="text-lg font-semibold mb-2" style={{ color: "#180D27" }}>
                {item.title}
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: "#666" }}>
                {item.description}
              </p>
            </div>
          ))}
        </div>

        <div
          className="p-6 rounded-2xl text-center"
          style={{ backgroundColor: "#f5f3ff" }}
        >
          <h2 className="text-lg font-semibold mb-2" style={{ color: "#180D27" }}>
            Questions about data security?
          </h2>
          <p className="text-sm mb-4" style={{ color: "#666" }}>
            Contact us at{" "}
            <a
              href="mailto:privacy@myaibank.ai"
              className="hover:underline"
              style={{ color: "#7c3aed" }}
            >
              privacy@myaibank.ai
            </a>{" "}
            or read our full{" "}
            <Link href="/privacy" className="hover:underline" style={{ color: "#7c3aed" }}>
              Privacy Policy
            </Link>
            .
          </p>
          <Link
            href="/signup"
            className="inline-block px-6 py-3 rounded-xl text-sm font-semibold text-white"
            style={{ backgroundColor: "#7c3aed" }}
          >
            Get Started Free
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
