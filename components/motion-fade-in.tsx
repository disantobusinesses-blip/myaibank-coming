"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface MotionFadeInProps {
  children: ReactNode
  delay?: number
  className?: string
  y?: number
}

/**
 * Server-component-friendly fade/slide-in helper powered by Framer Motion.
 * Lets pages that export `metadata` (server components) embed `whileInView`
 * animations without having to declare `"use client"` on the whole page.
 */
export function MotionFadeIn({
  children,
  delay = 0,
  className,
  y = 24,
}: MotionFadeInProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

export default MotionFadeIn
