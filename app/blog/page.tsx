import type { Metadata } from "next"
import Link from "next/link"
import { createPublicClient } from "@/lib/supabase"

export const revalidate = 60

export const metadata: Metadata = {
  title: "Blog — AI Money Management Insights | MyAiBank",
  description:
    "Read our latest articles on AI budgeting, spending insights, subscription detection, and financial health for Australians.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Blog — AI Money Management Insights | MyAiBank",
    description:
      "Read our latest articles on AI budgeting, spending insights, subscription detection, and financial health for Australians.",
    url: "/blog",
    type: "website",
    siteName: "MyAiBank",
    locale: "en_AU",
  },
  twitter: {
    card: "summary",
    title: "Blog — AI Money Management Insights | MyAiBank",
    description:
      "Read our latest articles on AI budgeting, spending insights, subscription detection, and financial health for Australians.",
  },
}

interface Post {
  id: string
  slug: string
  title: string
  description: string | null
  published: boolean
  created_at: string
}

/** Static fallback — always shown when Supabase returns no posts */
const STATIC_POSTS: Post[] = [
  {
    id: "ai-budget-tracking",
    slug: "ai-budget-tracking",
    title: "AI Budget Tracking for Australians",
    description:
      "Learn how AI powered budget tracking helps Australians understand spending, reduce financial stress and improve savings habits.",
    published: true,
    created_at: "2025-01-10",
  },
  {
    id: "ai-future-balance-forecasting",
    slug: "ai-future-balance-forecasting",
    title: "How AI Future Balance Forecasting Helps You See Where Your Money Is Heading",
    description:
      "AI future balance forecasting combines your transactions, subscriptions, and cashflow patterns to predict your account balance ahead — so you can act before problems happen.",
    published: true,
    created_at: "2025-01-09",
  },
  {
    id: "ai-spending-insights",
    slug: "ai-spending-insights",
    title: "AI Spending Insights for Australians",
    description:
      "Discover how AI spending insights help Australians identify patterns, reduce waste, and make smarter financial decisions every day.",
    published: true,
    created_at: "2025-01-08",
  },
  {
    id: "ai-transaction-categorisation",
    slug: "ai-transaction-categorisation",
    title: "AI Transaction Categorisation for Australians",
    description:
      "Learn how AI transaction categorisation automatically organises your bank transactions into meaningful categories, saving time and revealing spending patterns.",
    published: true,
    created_at: "2025-01-07",
  },
  {
    id: "financial-health-score",
    slug: "financial-health-score",
    title: "Financial Health Score for Australians",
    description:
      "Understand your financial health score and how AI analyses your income, spending, and savings habits to give you a clear picture of your financial wellbeing.",
    published: true,
    created_at: "2025-01-06",
  },
  {
    id: "how-to-save-money-fast-australia",
    slug: "how-to-save-money-fast-australia",
    title: "How to Save Money Fast in Australia",
    description:
      "A practical guide to saving money fast in Australia with a budget that actually works. Track spending, cut waste, and automate savings.",
    published: true,
    created_at: "2025-01-05",
  },
  {
    id: "mortgage-rate-alerts",
    slug: "mortgage-rate-alerts",
    title: "Mortgage Rate Alerts for Australians",
    description:
      "Learn how AI mortgage rate alerts help Australians stay informed about interest rate changes and make better home loan decisions.",
    published: true,
    created_at: "2025-01-04",
  },
  {
    id: "pay-off-home-loan-faster-australia",
    slug: "pay-off-home-loan-faster-australia",
    title: "How to Pay Off Your Home Loan Faster in Australia",
    description:
      "Practical strategies for paying off your Australian mortgage faster including extra repayments, fortnightly payments, offset accounts, and rate reviews.",
    published: true,
    created_at: "2025-01-03",
  },
  {
    id: "save-for-house-deposit-faster-australia",
    slug: "save-for-house-deposit-faster-australia",
    title: "How to Save for a House Deposit Faster in Australia",
    description:
      "A practical guide for Australians saving for a house deposit. Estimate your target, reduce spending, automate savings, and track weekly progress.",
    published: true,
    created_at: "2025-01-02",
  },
  {
    id: "subscription-detection",
    slug: "subscription-detection",
    title: "AI Subscription Detection for Australians",
    description:
      "Find out how AI subscription detection automatically identifies recurring charges, unused subscriptions, and hidden costs draining your bank account.",
    published: true,
    created_at: "2025-01-01",
  },
]

export default async function BlogIndexPage() {
  const supabase = createPublicClient()
  let posts: Post[] = []

  if (supabase) {
    const { data } = await supabase
      .from("posts")
      .select("id, slug, title, description, published, created_at")
      .eq("published", true)
      .order("created_at", { ascending: false })

    posts = (data as Post[]) ?? []
  }

  // Fall back to static posts when Supabase returns nothing
  if (posts.length === 0) {
    posts = STATIC_POSTS
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2" style={{ color: "#180D27" }}>
        MyAiBank Blog
      </h1>
      <p className="mb-8 leading-relaxed" style={{ color: "#555" }}>
        Learn how AI-powered tools help Australians budget smarter, track
        spending, and improve their financial health.
      </p>

      <div className="space-y-6">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="block p-5 rounded-2xl border hover:shadow-sm transition-shadow"
            style={{ borderColor: "#e5e5e5" }}
          >
            <h2
              className="text-xl font-semibold mb-1"
              style={{ color: "#180D27" }}
            >
              {post.title}
            </h2>
            {post.description && (
              <p className="text-sm leading-relaxed" style={{ color: "#666" }}>
                {post.description}
              </p>
            )}
            <span
              className="text-xs mt-2 inline-block"
              style={{ color: "#180D27" }}
            >
              Read more →
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
