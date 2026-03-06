import type { MetadataRoute } from "next"
import fs from "fs"
import path from "path"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://myaibank.ai"

  // Dynamically discover blog posts by reading the app/blog directory
  const blogDir = path.join(process.cwd(), "app", "blog")
  const blogSlugs = fs
    .readdirSync(blogDir, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isDirectory() &&
        fs.existsSync(path.join(blogDir, entry.name, "page.tsx"))
    )
    .map((entry) => entry.name)

  const blogEntries: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: fs.statSync(path.join(blogDir, slug, "page.tsx")).mtime,
    changeFrequency: "monthly",
    priority: 0.7,
  }))

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
    ...blogEntries,
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
