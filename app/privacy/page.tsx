import type { Metadata } from "next"
import Link from "next/link"
import { PRIVACY_POLICY } from "@/lib/legal-content"
import { SiteFooter } from "@/components/site-footer"

export const metadata: Metadata = {
  title: "Privacy Policy | MyAiBank",
  description:
    "MyAiBank Privacy Policy. Learn how we collect, use, and protect your personal and financial information.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "Privacy Policy | MyAiBank",
    description:
      "MyAiBank Privacy Policy. Learn how we collect, use, and protect your personal and financial information.",
    url: "/privacy",
    type: "website",
    siteName: "MyAiBank",
    locale: "en_AU",
  },
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#fff", color: "#1a1a1a" }}>
      <header className="px-6 py-4 border-b" style={{ borderColor: "#e5e5e5" }}>
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <Link href="/" className="text-sm hover:underline" style={{ color: "#666" }}>
            ← Home
          </Link>
          <span style={{ color: "#ccc" }}>|</span>
          <Link href="/terms" className="text-sm hover:underline" style={{ color: "#666" }}>
            Terms of Use
          </Link>
        </div>
      </header>

      <main className="flex-1 px-6 py-10 max-w-3xl mx-auto w-full">
        <h1 className="text-3xl font-bold mb-2" style={{ color: "#180D27" }}>
          Privacy Policy
        </h1>
        <p className="text-sm mb-8" style={{ color: "#888" }}>
          ABN 38 693 023 371 &nbsp;|&nbsp; Last Updated: January 14, 2026
        </p>
        <div
          className="text-sm leading-relaxed whitespace-pre-wrap"
          style={{ color: "#444" }}
        >
          {PRIVACY_POLICY}
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
