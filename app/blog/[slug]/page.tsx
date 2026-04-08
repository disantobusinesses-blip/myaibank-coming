import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { createClient } from "@supabase/supabase-js"
import { BlogContent } from "@/components/blog-content"

const blogClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_BLOGS_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_BLOGS_ANON_KEY!
)

export const revalidate = 60

interface Post {
  id: string
  slug: string
  title: string
  description: string | null
  content: string
  published: boolean
  created_at: string
}

interface Props {
  params: Promise<{ slug: string }>
}

function formatAustralianDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Australia/Sydney",
  })
}

async function getPost(slug: string): Promise<Post | null> {
  try {
    const { data } = await blogClient
      .from("myaibank_posts")
      .select("id, slug, title, description, content, published, created_at")
      .eq("slug", slug)
      .eq("published", true)
      .single()

    return (data as Post) ?? null
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    return { title: "Post Not Found | MyAiBank" }
  }

  return {
    title: `${post.title} | MyAiBank`,
    description: post.description ?? undefined,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title: `${post.title} | MyAiBank`,
      description: post.description ?? undefined,
      url: `/blog/${post.slug}`,
      type: "article",
      siteName: "MyAiBank",
      locale: "en_AU",
    },
    twitter: {
      card: "summary",
      title: `${post.title} | MyAiBank`,
      description: post.description ?? undefined,
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 py-12 sm:py-16">
      <article>
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 text-sm mb-8 hover:underline transition-colors"
          style={{ color: "rgba(255,255,255,0.55)" }}
        >
          ← Back to Blog
        </Link>

        {/* Hero */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-3 leading-tight text-white">
            {post.title}
          </h1>
          {post.description && (
            <p className="text-lg leading-relaxed mb-3" style={{ color: "rgba(255,255,255,0.7)" }}>
              {post.description}
            </p>
          )}
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
            {formatAustralianDate(post.created_at)}
          </p>
        </div>

        {/* Markdown content */}
        <div className="prose prose-invert prose-lg max-w-none">
          <BlogContent content={post.content} />
        </div>

        {/* CTA banner */}
        <div
          className="mt-12 p-8 rounded-2xl text-center"
          style={{ backgroundColor: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.25)" }}
        >
          <h3 className="text-xl font-semibold mb-2 text-white">
            Ready to take control of your finances?
          </h3>
          <p className="mb-5" style={{ color: "rgba(255,255,255,0.65)" }}>
            Join MyAiBank and get AI-powered financial insights for $14.99/month.
            No lock-in, cancel anytime.
          </p>
          <a
            href="https://myaibank.ai"
            className="inline-block px-8 py-3 rounded-xl text-white font-semibold text-sm"
            style={{
              background: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)",
            }}
          >
            Start Free Trial →
          </a>
        </div>
      </article>
    </div>
  )
}
