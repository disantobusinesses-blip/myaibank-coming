import type { Metadata } from "next"
import Link from "next/link"
import { SiteFooter } from "@/components/site-footer"

export const metadata: Metadata = {
  title: "Contact | MyAiBank",
  description:
    "Get in touch with the MyAiBank team. Support, privacy enquiries, and general contact information.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact | MyAiBank",
    description:
      "Get in touch with the MyAiBank team. Support, privacy enquiries, and general contact information.",
    url: "/contact",
    type: "website",
    siteName: "MyAiBank",
    locale: "en_AU",
  },
}

export default function ContactPage() {
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
          <Link href="/blog" className="text-sm hover:underline" style={{ color: "#666" }}>
            Blog
          </Link>
        </div>
      </header>

      <main className="flex-1 px-6 py-10 max-w-3xl mx-auto w-full">
        <h1 className="text-3xl font-bold mb-3" style={{ color: "#180D27" }}>
          Contact MyAiBank
        </h1>
        <p className="text-base leading-relaxed mb-10" style={{ color: "#555" }}>
          We are here to help. Reach out to our team for support, privacy enquiries, or anything else.
        </p>

        <div className="space-y-6">
          <div
            className="p-6 rounded-2xl border"
            style={{ borderColor: "#e5e5e5" }}
          >
            <h2 className="text-lg font-semibold mb-3" style={{ color: "#180D27" }}>
              General Support
            </h2>
            <p className="text-sm mb-2" style={{ color: "#666" }}>
              For help with your account, transactions, or platform questions:
            </p>
            <a
              href="mailto:support@myaibank.ai"
              className="text-sm font-medium hover:underline"
              style={{ color: "#7c3aed" }}
            >
              support@myaibank.ai
            </a>
          </div>

          <div
            className="p-6 rounded-2xl border"
            style={{ borderColor: "#e5e5e5" }}
          >
            <h2 className="text-lg font-semibold mb-3" style={{ color: "#180D27" }}>
              Privacy Enquiries
            </h2>
            <p className="text-sm mb-2" style={{ color: "#666" }}>
              For requests relating to your personal data, corrections, or deletion:
            </p>
            <a
              href="mailto:privacy@myaibank.ai"
              className="text-sm font-medium hover:underline"
              style={{ color: "#7c3aed" }}
            >
              privacy@myaibank.ai
            </a>
          </div>

          <div
            className="p-6 rounded-2xl border"
            style={{ borderColor: "#e5e5e5" }}
          >
            <h2 className="text-lg font-semibold mb-3" style={{ color: "#180D27" }}>
              Company Details
            </h2>
            <div className="text-sm space-y-1" style={{ color: "#666" }}>
              <p><strong style={{ color: "#444" }}>Trading Name:</strong> MyAiBank</p>
              <p><strong style={{ color: "#444" }}>Legal Entity:</strong> AI CAPITAL HOLDINGS PTY LTD</p>
              <p><strong style={{ color: "#444" }}>ABN:</strong> 38 693 023 371</p>
              <p><strong style={{ color: "#444" }}>Country:</strong> Australia</p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-4 text-sm">
          <Link href="/privacy" className="hover:underline" style={{ color: "#7c3aed" }}>
            Privacy Policy →
          </Link>
          <Link href="/terms" className="hover:underline" style={{ color: "#7c3aed" }}>
            Terms of Use →
          </Link>
          <Link href="/security" className="hover:underline" style={{ color: "#7c3aed" }}>
            Security →
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
