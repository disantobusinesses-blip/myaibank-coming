/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      // Redirect www → non-www (permanent)
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.myaibank.ai" }],
        destination: "https://myaibank.ai/:path*",
        permanent: true,
      },
      // Redirect http → https (permanent)
      {
        source: "/:path*",
        has: [{ type: "header", key: "x-forwarded-proto", value: "http" }],
        destination: "https://myaibank.ai/:path*",
        permanent: true,
      },
      // Demo route retired — redirect to homepage
      {
        source: "/demo",
        destination: "/",
        permanent: false,
      },
      // Rebrand: redirect all non-blog routes to the homepage
      { source: "/features",              destination: "/", permanent: false },
      { source: "/pricing",               destination: "/", permanent: false },
      { source: "/contact",               destination: "/", permanent: false },
      { source: "/what-we-do",            destination: "/", permanent: false },
      { source: "/privacy",               destination: "/", permanent: false },
      { source: "/terms",                 destination: "/", permanent: false },
      { source: "/security",              destination: "/", permanent: false },
      { source: "/login",                 destination: "/", permanent: false },
      { source: "/signup",                destination: "/", permanent: false },
      { source: "/auth/:path*",           destination: "/", permanent: false },
      { source: "/onboarding/:path*",     destination: "/", permanent: false },
      { source: "/onboarding",            destination: "/", permanent: false },
      { source: "/subscribe",             destination: "/", permanent: false },
      { source: "/subscribe/:path*",      destination: "/", permanent: false },
      { source: "/subscription-success",  destination: "/", permanent: false },
      { source: "/app/:path*",            destination: "/", permanent: false },
    ]
  },
}

export default nextConfig