"use client"

import React from "react"

import { ArrowRight } from "lucide-react"

interface StatCardProps {
  title: string
  subtitle?: string
  value: number
  icon?: React.ReactNode
  description?: string
  variant?: "default" | "teal" | "purple"
  showArrow?: boolean
}

export function StatCard({
  title,
  subtitle,
  value,
  icon,
  description,
  variant = "default",
  showArrow = false,
}: StatCardProps) {
  const variantClasses = {
    default: "bg-card border-border",
    teal: "gradient-teal border-[#14b8a6]/30",
    purple: "gradient-purple-pink border-[#8b5cf6]/30",
  }

  const valueColor = {
    default: "text-foreground",
    teal: "text-[#14b8a6]",
    purple: "text-[#ec4899]",
  }

  return (
    <div
      className={`rounded-2xl border p-4 ${variantClasses[variant]} transition-transform hover:scale-[1.02]`}
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className={`text-sm font-medium ${variant === "default" ? "text-foreground" : "text-white"}`}>
            {title}
          </p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {showArrow && (
          <ArrowRight className={`w-4 h-4 ${variant === "default" ? "text-muted-foreground" : "text-white/70"}`} />
        )}
      </div>

      <p className={`text-2xl font-bold ${valueColor[variant]} mt-2`}>
        ${Math.abs(value).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
      </p>

      {description && (
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      )}

      {showArrow && (
        <p className={`text-xs mt-2 ${variant === "default" ? "text-muted-foreground" : "text-white/70"}`}>
          {"VISIT PAGE →"}
        </p>
      )}
    </div>
  )
}
