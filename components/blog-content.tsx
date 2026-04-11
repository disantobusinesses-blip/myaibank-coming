"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import type { Components } from "react-markdown"
import Link from "next/link"
import { SavingsCalculator } from "@/components/savings-calculator"

interface BlogContentProps {
  content: string
}

const markdownComponents: Components = {
  p({ children }) {
    // Detect a paragraph that contains only the [SAVINGS_CHART] placeholder
    const text =
      typeof children === "string"
        ? children
        : Array.isArray(children) && children.length === 1 && typeof children[0] === "string"
          ? children[0]
          : null

    if (text?.trim() === "[SAVINGS_CHART]") {
      return <SavingsCalculator />
    }

    return <p>{children}</p>
  },
  // Use Next.js Link for internal links so navigation is client-side
  a({ href, children, ...props }) {
    if (!href) return <a {...props}>{children}</a>
    const isInternal =
      href.startsWith("/") ||
      /^https?:\/\/myaibank\.ai(\/|$)/.test(href)
    if (isInternal) {
      const localHref = href.startsWith("/")
        ? href
        : href.replace(/^https?:\/\/myaibank\.ai/, "")
      return <Link href={localHref} {...props}>{children}</Link>
    }
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    )
  },
}

export function BlogContent({ content }: BlogContentProps) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
      {content}
    </ReactMarkdown>
  )
}
