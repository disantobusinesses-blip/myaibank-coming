import type { Metadata } from "next"
import Link from "next/link"
import fs from "fs"
import path from "path"

export const metadata: Metadata = {
  title: "Blog — AI Money Management Insights | MyAiBank",
  description:
    "Read our latest articles on AI budgeting, spending insights, subscription detection, and financial health for Australians.",
}

/* Blog post metadata used to render the index cards */
const blogPosts: Record<string, { title: string; description: string }> = {
  "ai-budget-tracking": {
    title: "How AI Budget Tracking Helps Australians Understand Their Spending",
    description:
      "Learn how AI powered budget tracking helps Australians understand spending, reduce financial stress and improve savings habits.",
  },
  "ai-spending-insights": {
    title: "How AI Spending Insights Help Australians Make Smarter Financial Decisions",
    description:
      "Discover how AI spending insights help Australians identify patterns, reduce waste, and make smarter financial decisions every day.",
  },
  "ai-transaction-categorisation": {
    title: "How AI Transaction Categorisation Organises Your Finances Automatically",
    description:
      "Learn how AI transaction categorisation automatically organises your bank transactions into meaningful categories, saving time and revealing spending patterns.",
  },
  "financial-health-score": {
    title: "Understanding Your Financial Health Score with AI",
    description:
      "Understand your financial health score and how AI analyses your income, spending, and savings habits to give you a clear picture of your financial wellbeing.",
  },
  "mortgage-rate-alerts": {
    title: "How AI Mortgage Rate Alerts Keep Australians Informed About Home Loan Changes",
    description:
      "Learn how AI mortgage rate alerts help Australians stay informed about interest rate changes and make better home loan decisions.",
  },
  "subscription-detection": {
    title: "How AI Subscription Detection Finds Hidden Costs in Your Bank Account",
    description:
      "Find out how AI subscription detection automatically identifies recurring charges, unused subscriptions, and hidden costs draining your bank account.",
  },
}

export default function BlogIndexPage() {
  // Dynamically discover blog post slugs from the filesystem
  const blogDir = path.join(process.cwd(), "app", "blog")
  const slugs = fs
    .readdirSync(blogDir, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isDirectory() &&
        fs.existsSync(path.join(blogDir, entry.name, "page.tsx"))
    )
    .map((entry) => entry.name)

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
        {slugs.map((slug) => {
          const post = blogPosts[slug]
          return (
            <Link
              key={slug}
              href={`/blog/${slug}`}
              className="block p-5 rounded-2xl border hover:shadow-sm transition-shadow"
              style={{ borderColor: "#e5e5e5" }}
            >
              <h2
                className="text-xl font-semibold mb-1"
                style={{ color: "#180D27" }}
              >
                {post?.title ??
                  slug
                    .split("-")
                    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                    .join(" ")}
              </h2>
              {post?.description && (
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
          )
        })}
      </div>
    </div>
  )
}
