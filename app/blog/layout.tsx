import { LegalFooter } from "@/components/legal-footer"
import Link from "next/link"
import type { ReactNode } from "react"

export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#fff', color: '#1a1a1a' }}>
      <header className="px-6 py-4 border-b" style={{ borderColor: '#e5e5e5' }}>
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-10 w-24 rounded opacity-20" role="img" aria-label="Logo placeholder" />
          </Link>
          <span style={{ color: '#ccc' }}>|</span>
          <Link href="/blog" className="text-xs hover:underline" style={{ color: '#666' }}>Blog</Link>
          <span style={{ color: '#ccc' }}>|</span>
          <Link href="/what-we-do" className="text-xs hover:underline" style={{ color: '#666' }}>Learn More</Link>
        </div>
      </header>
      <main className="flex-1 px-6 py-10 max-w-3xl mx-auto w-full">
        {children}
      </main>
      <LegalFooter />
    </div>
  )
}
