import type { ReactNode } from "react"
import Link from "next/link"
import Image from "next/image"

export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#050508", color: "#fff" }}>
      {/* Shared dark nav for all blog pages */}
      <header
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          backgroundColor: "rgba(5,5,8,0.95)",
          backdropFilter: "blur(12px)",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-3 sm:py-4 flex items-center justify-between">
          <Link href="/" aria-label="Home">
            <Image
              src="/MABtransparent.png"
              alt="MyAiBank"
              width={80}
              height={32}
              className="object-contain w-16 h-auto sm:w-20"
            />
          </Link>
          <nav className="hidden sm:flex items-center gap-5 lg:gap-8">
            {([["Features", "/features"], ["Pricing", "/pricing"], ["Blog", "/blog"], ["Security", "/security"]] as const).map(([l, h]) => (
              <Link
                key={h}
                href={h}
                className="text-sm transition-colors hover:text-white"
                style={{ color: "rgba(255,255,255,0.55)" }}
              >
                {l}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden sm:block text-sm transition-colors hover:text-white"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="h-9 px-4 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all hover:scale-105"
              style={{ background: "linear-gradient(135deg,#8b5cf6,#6d28d9)", color: "#fff" }}
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Page content (blog list or individual post) */}
      {children}
    </div>
  )
}
