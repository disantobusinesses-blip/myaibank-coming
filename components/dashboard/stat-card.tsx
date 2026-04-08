"use client"

import React from "react"
import { ArrowRight, TrendingUp, TrendingDown } from "lucide-react"

interface StatCardProps {
  title: string
  subtitle?: string
  value: number
  icon?: React.ReactNode
  description?: string
  variant?: "default" | "teal" | "purple" | "green"
  showArrow?: boolean
  trend?: number
  trendLabel?: string
}

export function StatCard({
  title,
  subtitle,
  value,
  icon,
  description,
  variant = "default",
  showArrow = false,
  trend,
  trendLabel,
}: StatCardProps) {
  const borderAccent = {
    default: "border-l-[#7c3aed]/60",
    teal: "border-l-[#14b8a6]/60",
    purple: "border-l-[#7c3aed]/60",
    green: "border-l-[#22c55e]/60",
  }

  const valueColor = {
    default: "text-white number-glow-white",
    teal: "text-[#14b8a6] number-glow-purple",
    purple: "text-[#a78bfa] number-glow-purple",
    green: "text-[#22c55e] number-glow-green",
  }

  const iconBg = {
    default: "bg-[#7c3aed]/10 text-[#7c3aed]",
    teal: "bg-[#14b8a6]/10 text-[#14b8a6]",
    purple: "bg-[#7c3aed]/10 text-[#a78bfa]",
    green: "bg-[#22c55e]/10 text-[#22c55e]",
  }

  const isPositiveTrend = trend !== undefined && trend >= 0

  return (
    <div
      className={`stat-card-premium rounded-2xl border-l-2 p-4 ${borderAccent[variant]} cursor-pointer`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {icon && (
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${iconBg[variant]}`}>
              {icon}
            </div>
          )}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {title}
            </p>
            {subtitle && (
              <p className="text-xs text-muted-foreground/60 mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>
        {showArrow && (
          <ArrowRight className="w-4 h-4 text-muted-foreground/40" />
        )}
      </div>

      <p className={`text-3xl font-bold tabular-nums ${valueColor[variant]} mt-1`}>
        ${Math.round(Math.abs(value)).toLocaleString()}
      </p>

      <div className="flex items-center justify-between mt-2">
        {description && (
          <p className="text-xs text-muted-foreground/60">{description}</p>
        )}
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-medium ${isPositiveTrend ? "trend-up" : "trend-down"}`}>
            {isPositiveTrend
              ? <TrendingUp className="w-3 h-3" />
              : <TrendingDown className="w-3 h-3" />
            }
            <span>{Math.abs(trend)}% {trendLabel ?? "this month"}</span>
          </div>
        )}
      </div>

      {showArrow && (
        <p className="text-[10px] mt-2 text-muted-foreground/40 uppercase tracking-wider">
          View details →
        </p>
      )}
    </div>
  )
}
