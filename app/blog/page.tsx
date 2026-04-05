import Link from "next/link"
import Image from "next/image"
import { SiteFooter } from "@/components/site-footer"
import { ArrowRight, ChevronRight, Eye, Clock } from "lucide-react"

// ── Blog metadata ─────────────────────────────────────────────────────────────
// View counts are illustrative; replace with a real analytics source when ready.
const POSTS = [
  {
    slug: "ai-spending-insights",
    category: "AI Insights",
    color: "#8b5cf6",
    title: "How AI Analyses Your Spending Patterns",
    excerpt:
      "Discover how machine learning categorises every transaction and surfaces opportunities to save money automatically — without you lifting a finger.",
    readTime: "4 min",
    views: 3842,
    featured: true,
  },
  {
    slug: "ai-future-balance-forecasting",
    category: "Cash Flow",
    color: "#22c55e",
    title: "Predicting Your Future Balance with AI",
    excerpt:
      "See how MyAiBank uses 12 months of real transaction history to forecast your cash position 30, 60, and 90 days ahead — with confidence intervals.",
    readTime: "5 min",
    views: 2917,
    featured: false,
  },
  {
    slug: "subscription-detection",
    category: "Smart Detection",
    color: "#14b8a6",
    title: "Never Miss a Subscription Charge Again",
    excerpt:
      "Our AI automatically detects recurring payments and alerts you before they hit — so you stay in control of your financial commitments.",
    readTime: "3 min",
    views: 2104,
    featured: false,
  },
  {
    slug: "financial-health-score",
    category: "Health Score",
    color: "#f59e0b",
    title: "Understanding Your Financial Health Score",
    excerpt:
      "A single number that summarises your income, expenses, savings rate, and debt position — updated every time your bank data syncs.",
    readTime: "4 min",
    views: 1876,
    featured: false,
  },
  {
    slug: "ai-budget-tracking",
    category: "Budgeting",
    color: "#ec4899",
    title: "AI Budget Tracking That Actually Works",
    excerpt:
      "Forget spreadsheets. MyAiBank learns your spending patterns and builds a personalised budget that adapts to your life in real time.",
    readTime: "5 min",
    views: 1543,
    featured: false,
  },
  {
    slug: "ai-transaction-categorisation",
    category: "AI Insights",
    color: "#8b5cf6",
    title: "How Transaction Categorisation Works",
    excerpt:
      "A deep dive into the AI engine that sorts your bank transactions into meaningful categories — and how to train it to suit your lifestyle.",
    readTime: "4 min",
    views: 1289,
    featured: false,
  },
  {
    slug: "save-for-house-deposit-faster-australia",
    category: "Goals",
    color: "#6366f1",
    title: "Save for a House Deposit Faster in Australia",
    excerpt:
      "Data-backed strategies for Australians looking to accelerate their path to homeownership — with real numbers from real bank data.",
    readTime: "6 min",
    views: 4211,
    featured: false,
  },
  {
    slug: "pay-off-home-loan-faster-australia",
    category: "Debt",
    color: "#ef4444",
    title: "Pay Off Your Home Loan Faster in Australia",
    excerpt:
      "How offset accounts, redraw facilities, and extra repayments combine to save Australian homeowners tens of thousands in interest.",
    readTime: "6 min",
    views: 3107,
    featured: false,
  },
  {
    slug: "mortgage-rate-alerts",
    category: "Alerts",
    color: "#0ea5e9",
    title: "Set Up Mortgage Rate Alerts — Never Miss a Deal",
    excerpt:
      "Automated alerts that tell you the moment your lender's rate changes, so you can refinance at the right time without obsessively checking.",
    readTime: "3 min",
    views: 982,
    featured: false,
  },
  {
    slug: "how-to-save-money-fast-australia",
    category: "Savings",
    color: "#22c55e",
    title: "How to Save Money Fast in Australia (2026 Guide)",
    excerpt:
      "Practical, no-fluff tactics for cutting spending and building savings quickly — from high-interest savings accounts to expense auditing with AI.",
    readTime: "7 min",
    views: 5624,
    featured: false,
  },
]

function formatViews(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "k"
  return String(n)
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function BlogPage() {
  const featured = POSTS.find(p => p.featured)!
  const rest = POSTS.filter(p => !p.featured)

  return (
    <main className="min-h-screen flex flex-col" style={{ backgroundColor: "#050508", color: "#fff" }}>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header className="border-b" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between">
          <Link href="/" aria-label="Home">
            <Image src="/MABtransparent.png" alt="MyAiBank" width={80} height={32} className="object-contain w-16 h-auto sm:w-20" />
          </Link>
          <nav className="flex items-center gap-4 sm:gap-6">
            {[["App", "/app/dashboard"], ["Pricing", "/pricing"], ["Security", "/security"]].map(([l, h]) => (
              <Link key={h} href={h} className="text-xs sm:text-sm transition-colors hover:text-white hidden sm:block"
                style={{ color: "rgba(255,255,255,0.55)" }}>{l}</Link>
            ))}
            <Link href="/signup"
              className="h-9 px-4 sm:px-5 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all hover:scale-105"
              style={{ background: "linear-gradient(135deg,#8b5cf6,#6d28d9)", color: "#fff" }}>
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="relative px-4 sm:px-6 pt-14 sm:pt-20 pb-10 sm:pb-16 text-center overflow-hidden">
        {/* glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(ellipse,rgba(139,92,246,0.15),transparent 70%)" }} />
        <div className="relative max-w-3xl mx-auto">
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "#8b5cf6" }}>
            MyAiBank Blog
          </p>
          <h1 className="font-bold text-white mb-4" style={{ fontSize: "clamp(2rem,5vw,3.25rem)" }}>
            Financial insights,<br className="hidden sm:block" /> powered by AI
          </h1>
          <p className="text-sm sm:text-base max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.55)" }}>
            Learn how to take control of your money with practical guides, smart strategies, and deep dives into how AI is reshaping personal finance in Australia.
          </p>
        </div>
      </section>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <section className="flex-1 px-4 sm:px-6 pb-20 sm:pb-28">
        <div className="max-w-7xl mx-auto">

          {/* Featured post ────────────────────────── */}
          <Link href={`/blog/${featured.slug}`} className="block mb-5 sm:mb-6 group">
            <div className="relative overflow-hidden rounded-3xl p-6 sm:p-10 lg:p-14 transition-all duration-300 hover:scale-[1.01]"
              style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.25)" }}>

              {/* Glow blob */}
              <div className="absolute top-0 right-0 w-48 h-48 sm:w-96 sm:h-96 rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle,rgba(139,92,246,0.18),transparent 65%)", transform: "translate(35%,-35%)" }} />

              <div className="relative">
                {/* Category + meta row */}
                <div className="flex flex-wrap items-center gap-3 mb-4 sm:mb-5">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
                    style={{ background: `${featured.color}22`, color: featured.color, border: `1px solid ${featured.color}44` }}>
                    {featured.category}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                    <Clock className="w-3 h-3" />{featured.readTime} read
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                    <Eye className="w-3 h-3" />{formatViews(featured.views)} views
                  </span>
                  <span className="ml-auto px-2.5 py-0.5 rounded-full text-xs font-semibold" style={{ background: "rgba(139,92,246,0.3)", color: "#c4b5fd" }}>
                    Featured
                  </span>
                </div>

                <h2 className="font-bold text-white mb-3 sm:mb-4 max-w-3xl" style={{ fontSize: "clamp(1.4rem,4vw,2.25rem)" }}>
                  {featured.title}
                </h2>
                <p className="text-sm sm:text-base leading-relaxed mb-5 sm:mb-7 max-w-2xl" style={{ color: "rgba(255,255,255,0.6)" }}>
                  {featured.excerpt}
                </p>

                <span className="inline-flex items-center gap-2 text-sm font-semibold group-hover:gap-3 transition-all" style={{ color: featured.color }}>
                  Read article <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </Link>

          {/* All other posts grid: 1 → 2 → 3 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {rest.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
                <article
                  className="h-full flex flex-col p-5 sm:p-7 rounded-3xl transition-all duration-300 hover:scale-[1.02]"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  {/* Category pill + views */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold"
                      style={{ background: `${post.color}18`, color: post.color }}>
                      {post.category}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                      <Eye className="w-3 h-3" />{formatViews(post.views)}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="font-bold text-white mb-2 sm:mb-3 leading-snug flex-1"
                    style={{ fontSize: "clamp(1rem,2.5vw,1.15rem)" }}>
                    {post.title}
                  </h2>

                  {/* Excerpt */}
                  <p className="text-xs sm:text-sm leading-relaxed mb-5 sm:mb-6" style={{ color: "rgba(255,255,255,0.5)" }}>
                    {post.excerpt}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-auto pt-4"
                    style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                    <span className="inline-flex items-center gap-1.5 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                      <Clock className="w-3 h-3" />{post.readTime} read
                    </span>
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: post.color }} />
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA banner ──────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 py-14 sm:py-20" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="font-bold text-white mb-4" style={{ fontSize: "clamp(1.5rem,4vw,2.25rem)" }}>
            Ready to understand your finances?
          </h3>
          <p className="text-sm sm:text-base mb-7" style={{ color: "rgba(255,255,255,0.5)" }}>
            Connect your Australian bank accounts and let AI do the heavy lifting — free to try, no credit card needed.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/app/dashboard"
              className="w-full sm:w-auto h-12 sm:h-13 px-6 sm:px-8 rounded-2xl text-sm sm:text-base font-semibold flex items-center justify-center gap-2 transition-all hover:scale-105"
              style={{ background: "linear-gradient(135deg,#8b5cf6,#6d28d9)", color: "#fff", boxShadow: "0 4px 24px rgba(139,92,246,0.3)" }}>
              Try the Demo <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/signup"
              className="w-full sm:w-auto h-12 sm:h-13 px-6 sm:px-8 rounded-2xl text-sm sm:text-base font-semibold flex items-center justify-center gap-2"
              style={{ background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.35)", color: "#fff" }}>
              Create Free Account
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter variant="dark" />
    </main>
  )
}
