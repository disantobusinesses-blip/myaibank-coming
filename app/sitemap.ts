import type { MetadataRoute } from "next"
import fs from "fs"
import path from "path"
import { createPublicClient } from "@/lib/supabase"

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://myaibank.ai"

  // --- Static blog posts: those that still have a dedicated page.tsx folder ---
  // (Excludes the [slug] dynamic route folder)
  const blogDir = path.join(process.cwd(), "app", "blog")
  const staticSlugs = fs
    .readdirSync(blogDir, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isDirectory() &&
        !entry.name.startsWith("[") &&
        fs.existsSync(path.join(blogDir, entry.name, "page.tsx"))
    )
    .map((entry) => entry.name)

  const staticBlogEntries: MetadataRoute.Sitemap = staticSlugs.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: fs.statSync(path.join(blogDir, slug, "page.tsx")).mtime,
    changeFrequency: "monthly",
    priority: 0.7,
  }))

  // --- Dynamic blog posts: published rows in the Supabase posts table ---
  // Only include slugs that are NOT already covered by a static file.
  const staticSlugSet = new Set(staticSlugs)
  const supabase = createPublicClient()
  const dynamicBlogEntries: MetadataRoute.Sitemap = []

  if (supabase) {
    const { data } = await supabase
      .from("posts")
      .select("slug, created_at")
      .eq("published", true)
      .order("created_at", { ascending: false })

    if (data) {
      for (const post of data as { slug: string; created_at: string }[]) {
        if (!staticSlugSet.has(post.slug)) {
          dynamicBlogEntries.push({
            url: `${baseUrl}/blog/${post.slug}`,
            lastModified: new Date(post.created_at),
            changeFrequency: "monthly",
            priority: 0.7,
          })
        }
      }
    }
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/what-we-do`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...staticBlogEntries,
    ...dynamicBlogEntries,
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
      priority: 0.3,
    },
  ]
}
