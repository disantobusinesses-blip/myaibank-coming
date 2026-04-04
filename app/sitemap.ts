import type { MetadataRoute } from "next"
import { createClient } from "@supabase/supabase-js"

export const dynamic = "force-dynamic"

const blogClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_BLOGS_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_BLOGS_ANON_KEY!
)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://myaibank.ai"

  const { data } = await blogClient
    .from("myaibank_posts")
    .select("slug, created_at")
    .eq("published", true)
    .order("created_at", { ascending: false })

  const blogEntries: MetadataRoute.Sitemap = (
    (data ?? []) as { slug: string; created_at: string }[]
  ).map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.created_at),
    changeFrequency: "monthly",
    priority: 0.8,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/features`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/what-we-do`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/security`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/signup`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    ...blogEntries,
  ]
}
