import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import sanitizeHtml from "sanitize-html"
import { createPublicClient } from "@/lib/supabase"

export const revalidate = 60

/** Allowed HTML tags and attributes for blog post content. */
const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    "h1", "h2", "h3", "h4", "h5", "h6",
    "p", "br", "hr",
    "ul", "ol", "li",
    "strong", "em", "b", "i", "u", "s",
    "a",
    "blockquote", "pre", "code",
    "table", "thead", "tbody", "tr", "th", "td",
    "img",
    "div", "span",
  ],
  allowedAttributes: {
    a: ["href", "title", "target", "rel"],
    img: ["src", "alt", "width", "height", "loading"],
    "*": ["class", "style"],
  },
  // Force external links to open safely
  transformTags: {
    a: (tagName, attribs) => ({
      tagName,
      attribs: {
        ...attribs,
        ...(attribs.href?.startsWith("http")
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {}),
      },
    }),
  },
}

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

async function getPost(slug: string): Promise<Post | null> {
  const supabase = createPublicClient()
  if (!supabase) return null

  const { data } = await supabase
    .from("posts")
    .select("id, slug, title, description, content, published, created_at")
    .eq("slug", slug)
    .eq("published", true)
    .single()

  return (data as Post) ?? null
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
    <article>
      <h1 className="text-3xl font-bold mb-4" style={{ color: "#180D27" }}>
        {post.title}
      </h1>
      <p className="text-sm mb-8" style={{ color: "#999" }}>
        Published by MyAiBank
      </p>

      <div
        className="prose prose-slate max-w-none"
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content, SANITIZE_OPTIONS) }}
      />

      {/* Conversion CTA */}
      <div
        className="mt-12 p-8 rounded-2xl text-center"
        style={{ backgroundColor: "#f9f7fc", border: "1px solid #e8e0f0" }}
      >
        <h3
          className="text-xl font-semibold mb-2"
          style={{ color: "#180D27" }}
        >
          Ready to see your finances analysed instantly?
        </h3>
        <p className="mb-4" style={{ color: "#555" }}>
          Try the MyAiBank demo and experience AI-powered money insights.
        </p>
        <Link
          href="/"
          className="inline-block px-8 py-3 rounded-xl text-white font-semibold text-sm"
          style={{
            background: "linear-gradient(135deg, #180D27 0%, #2d1b69 100%)",
          }}
        >
          Try the Demo
        </Link>
      </div>
    </article>
  )
}
