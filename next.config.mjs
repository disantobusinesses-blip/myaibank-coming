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
    ]
  },
}

export default nextConfig