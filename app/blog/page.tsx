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
