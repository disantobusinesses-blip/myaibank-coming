import type { Transaction } from "@/contexts/app-data-context"
import { normaliseMerchantName } from "./categorisation"

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface RecurringPattern {
  /** Normalised merchant name */
  merchant: string
  /** Detected amount (positive = income, negative = expense) */
  amount: number
  /** Estimated frequency in days */
  frequencyDays: number
  /** Human-readable frequency label */
  frequency: "weekly" | "fortnightly" | "monthly" | "quarterly" | "yearly"
  /** Confidence 0–1 */
  confidence: number
  /** Last seen date (YYYY-MM-DD) */
  lastSeen: string
  /** Predicted next date (YYYY-MM-DD) */
  nextExpected: string
  /** Number of occurrences found */
  occurrences: number
  /** Category of the recurring transaction */
  category: string
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function toDateKey(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

/** Frequency buckets with tolerance windows (in days). */
const FREQUENCY_MAP: Array<{
  label: RecurringPattern["frequency"]
  target: number
  tolerance: number
}> = [
  { label: "weekly", target: 7, tolerance: 2 },
  { label: "fortnightly", target: 14, tolerance: 3 },
  { label: "monthly", target: 30, tolerance: 5 },
  { label: "quarterly", target: 91, tolerance: 10 },
  { label: "yearly", target: 365, tolerance: 30 },
]

function classifyFrequency(
  avgDaysBetween: number
): { label: RecurringPattern["frequency"]; target: number } | null {
  for (const f of FREQUENCY_MAP) {
    if (Math.abs(avgDaysBetween - f.target) <= f.tolerance) {
      return { label: f.label, target: f.target }
    }
  }
  return null
}

/* ------------------------------------------------------------------ */
/*  Core: detect recurring transactions                                */
/* ------------------------------------------------------------------ */

/**
 * Analyse a list of transactions and detect recurring patterns.
 *
 * Approach:
 * 1. Group transactions by normalised merchant + amount sign + approximate amount.
 * 2. For each group with ≥ 2 occurrences, compute intervals between dates.
 * 3. If the median interval falls within a known frequency bucket, flag it
 *    as recurring.
 * 4. Calculate confidence based on consistency of intervals and number of
 *    occurrences.
 */
export function detectRecurringTransactions(
  transactions: Transaction[]
): RecurringPattern[] {
  // Group by merchant + amount sign + rounded amount
  const groups = new Map<
    string,
    { dates: Date[]; amounts: number[]; categories: string[]; merchant: string }
  >()

  for (const t of transactions) {
    const merchant = normaliseMerchantName(t.merchant_name)
    const amt = Number(t.amount)
    const sign = amt >= 0 ? "+" : "-"
    // Round to nearest dollar for grouping
    const rounded = Math.round(Math.abs(amt))
    const key = `${merchant.toLowerCase()}|${sign}|${rounded}`

    const txDate = new Date(t.transaction_date)
    if (isNaN(txDate.getTime())) continue

    if (!groups.has(key)) {
      groups.set(key, { dates: [], amounts: [], categories: [], merchant })
    }
    const group = groups.get(key)!
    group.dates.push(txDate)
    group.amounts.push(amt)
    group.categories.push(
      (t.category ?? t.merchant_category ?? "uncategorized").toLowerCase()
    )
  }

  const results: RecurringPattern[] = []

  for (const [, group] of groups) {
    // Need at least 2 occurrences to detect a pattern
    if (group.dates.length < 2) continue

    // Sort dates ascending
    group.dates.sort((a, b) => a.getTime() - b.getTime())

    // Calculate intervals between consecutive dates
    const intervals: number[] = []
    for (let i = 1; i < group.dates.length; i++) {
      const diffMs = group.dates[i].getTime() - group.dates[i - 1].getTime()
      intervals.push(diffMs / (24 * 60 * 60 * 1000)) // days
    }

    // Compute median interval
    const sorted = [...intervals].sort((a, b) => a - b)
    const median =
      sorted.length % 2 === 0
        ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
        : sorted[Math.floor(sorted.length / 2)]

    const freq = classifyFrequency(median)
    if (!freq) continue

    // Calculate consistency (how close each interval is to the target)
    const deviations = intervals.map((i) => Math.abs(i - freq.target))
    const avgDeviation =
      deviations.reduce((s, d) => s + d, 0) / deviations.length

    // Confidence: based on consistency + number of occurrences
    const consistencyScore = Math.max(0, 1 - avgDeviation / freq.target)
    const occurrenceBonus = Math.min(0.2, (group.dates.length - 2) * 0.05)
    const confidence = Math.min(1, consistencyScore * 0.8 + occurrenceBonus + 0.1)

    // Skip low-confidence detections
    if (confidence < 0.4) continue

    // Average amount
    const avgAmount =
      group.amounts.reduce((s, a) => s + a, 0) / group.amounts.length

    // Most common category
    const catCount = new Map<string, number>()
    for (const c of group.categories) {
      catCount.set(c, (catCount.get(c) || 0) + 1)
    }
    let topCat = "uncategorized"
    let topCatCount = 0
    for (const [cat, count] of catCount) {
      if (count > topCatCount) {
        topCat = cat
        topCatCount = count
      }
    }

    const lastDate = group.dates[group.dates.length - 1]
    const nextDate = new Date(lastDate)
    nextDate.setDate(nextDate.getDate() + freq.target)

    results.push({
      merchant: group.merchant,
      amount: Math.round(avgAmount * 100) / 100,
      frequencyDays: freq.target,
      frequency: freq.label,
      confidence: Math.round(confidence * 100) / 100,
      lastSeen: toDateKey(lastDate),
      nextExpected: toDateKey(nextDate),
      occurrences: group.dates.length,
      category: topCat,
    })
  }

  // Sort by confidence descending
  return results.sort((a, b) => b.confidence - a.confidence)
}
