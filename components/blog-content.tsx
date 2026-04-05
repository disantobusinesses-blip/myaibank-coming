"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import type { Components } from "react-markdown"
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
}

export function BlogContent({ content }: BlogContentProps) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
      {content}
    </ReactMarkdown>
  )
}
