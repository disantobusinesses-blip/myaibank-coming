import Link from "next/link"
import { ExternalLink } from "lucide-react"

export default function RebrandPage() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: "#060608" }}
    >
      {/* Ambient glow */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(139,92,246,0.18) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-2xl w-full text-center">
        {/* Badge */}
        <span
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-8"
          style={{
            background: "rgba(139,92,246,0.15)",
            border: "1px solid rgba(139,92,246,0.35)",
            color: "#c4b5fd",
          }}
        >
          Important Announcement
        </span>

        {/* Heading */}
        <h1
          className="font-extrabold text-white mb-6 leading-tight"
          style={{ fontSize: "clamp(2rem,6vw,3.5rem)" }}
        >
          MyAiBank has rebranded to
        </h1>

        {/* Brand name */}
        <p
          className="font-extrabold mb-8 leading-none"
          style={{
            fontSize: "clamp(2.2rem,8vw,4.5rem)",
            background: "linear-gradient(135deg,#a78bfa,#7c3aed,#4f46e5)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Onyxglobal.com.au
        </p>

        {/* Description */}
        <p
          className="text-base sm:text-lg mb-10 leading-relaxed max-w-lg mx-auto"
          style={{ color: "rgba(255,255,255,0.55)" }}
        >
          We&apos;ve moved to a new home. Visit our new website to explore everything we offer.
        </p>

        {/* CTA button */}
        <Link
          href="https://onyxglobal.com.au"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-10 py-4 rounded-2xl text-base sm:text-lg font-semibold transition-all duration-200 hover:scale-105 hover:shadow-2xl"
          style={{
            background: "linear-gradient(135deg,#8b5cf6,#6d28d9)",
            color: "#fff",
            boxShadow: "0 4px 32px rgba(139,92,246,0.45)",
          }}
        >
          Visit Onyxglobal.com.au
          <ExternalLink className="w-5 h-5" />
        </Link>

        {/* Blog link */}
        <p className="mt-10 text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
          Looking for our articles?{" "}
          <Link
            href="/blog"
            className="underline underline-offset-4 transition-colors hover:text-white"
            style={{ color: "rgba(139,92,246,0.85)" }}
          >
            Browse the blog
          </Link>
        </p>
      </div>
    </main>
  )
}
