import Link from "next/link"
import Image from "next/image"

interface SiteFooterProps {
  variant?: "light" | "dark"
}

export function SiteFooter({ variant = "light" }: SiteFooterProps) {
  const isDark = variant === "dark"

  const baseLinkClass = `text-sm transition-colors hover:underline underline-offset-2 ${
    isDark ? "text-white/60 hover:text-white" : "text-muted-foreground hover:text-foreground"
  }`
  const headingClass = `text-xs font-semibold uppercase tracking-wider mb-3 ${
    isDark ? "text-white/40" : "text-foreground/40"
  }`
  const dividerColor = isDark ? "rgba(255,255,255,0.08)" : "#e5e7eb"
  const mutedTextColor = isDark ? "rgba(255,255,255,0.35)" : "#9ca3af"

  return (
    <footer
      className="w-full px-6 py-10"
      style={{ borderTop: `1px solid ${dividerColor}` }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/" aria-label="MyAiBank home">
            <Image
              src="/MABtransparent.png"
              alt="MyAiBank logo"
              width={80}
              height={34}
              className={isDark ? "" : "invert"}
              style={{ objectFit: "contain" }}
            />
          </Link>
        </div>

        {/* Navigation columns */}
        <nav aria-label="Site navigation" className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-8">
          <div>
            <p className={headingClass}>Product</p>
            <ul className="space-y-2">
              <li><Link href="/features" className={baseLinkClass}>Features</Link></li>
              <li><Link href="/pricing" className={baseLinkClass}>Pricing</Link></li>
              <li><Link href="/what-we-do" className={baseLinkClass}>What We Do</Link></li>
              <li><Link href="/blog" className={baseLinkClass}>Blog</Link></li>
            </ul>
          </div>

          <div>
            <p className={headingClass}>Get Started</p>
            <ul className="space-y-2">
              <li><Link href="/signup" className={baseLinkClass}>Sign Up</Link></li>
              <li><Link href="/login" className={baseLinkClass}>Log In</Link></li>
            </ul>
          </div>

          <div>
            <p className={headingClass}>Company</p>
            <ul className="space-y-2">
              <li><Link href="/security" className={baseLinkClass}>Security</Link></li>
              <li><Link href="/contact" className={baseLinkClass}>Contact</Link></li>
            </ul>
          </div>

          <div>
            <p className={headingClass}>Legal</p>
            <ul className="space-y-2">
              <li><Link href="/privacy" className={baseLinkClass}>Privacy Policy</Link></li>
              <li><Link href="/terms" className={baseLinkClass}>Terms of Use</Link></li>
            </ul>
          </div>
        </nav>

        {/* Bottom bar */}
        <div
          className="pt-6 text-center text-xs space-y-1"
          style={{
            borderTop: `1px solid ${dividerColor}`,
            color: mutedTextColor,
          }}
        >
          <p>ABN 38 693 023 371 &nbsp;|&nbsp; support@myaibank.ai</p>
          <p>
            Built by{" "}
            <a
              href="https://intelligentaisystem.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
              style={{ color: mutedTextColor }}
            >
              Intelligent AI Systems
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
