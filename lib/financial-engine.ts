import type { Transaction, Subscription } from "@/contexts/app-data-context"

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface ForecastDataPoint {
  /** Display label, e.g. "Mar 9" */
  date: string
  /** ISO-like key for date matching, e.g. "2026-03-09" */
  rawDate: string
  /** Projected income for the period */
  income: number
  /** Projected expenses for the period */
  expenses: number
  /** true when this point is the user's current local date */
  isToday: boolean
  /** true for dates after today (forecast territory) */
  isFuture: boolean
}

export interface ForecastResult {
  data: ForecastDataPoint[]
  todayLabel: string
  projectedIncome: number
  projectedExpenses: number
  projectedDate: string
}

export interface SpendingSummary {
  totalIncome: number
  totalExpenses: number
  netCashflow: number
  /** Category → total amount (absolute value for expenses) */
  byCategory: Record<string, number>
  /** Estimated "essential" expenses (housing, utilities, groceries, insurance, health) */
  essentialExpenses: number
  /** Estimated "discretionary" expenses (everything else) */
  discretionaryExpenses: number
  /** Average weekly income from the data */
  avgWeeklyIncome: number
  /** Average weekly expenses from the data */
  avgWeeklyExpenses: number
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Normalise a Date to a YYYY-MM-DD string using the local timezone. */
export function toDateKey(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

/** Essential spending categories (case-insensitive matching). */
const ESSENTIAL_CATEGORIES = new Set([
  "housing",
  "rent",
  "mortgage",
  "utilities",
  "groceries",
  "insurance",
  "health",
  "medical",
  "transport",
  "education",
  "childcare",
])

function isEssentialCategory(category: string | null): boolean {
  if (!category) return false
  return ESSENTIAL_CATEGORIES.has(category.toLowerCase())
}

/* ------------------------------------------------------------------ */
/*  Core: build spending summary from real transaction data            */
/* ------------------------------------------------------------------ */

export function buildSpendingSummary(transactions: Transaction[]): SpendingSummary {
  let totalIncome = 0
  let totalExpenses = 0
  let essentialExpenses = 0
  let discretionaryExpenses = 0
  const byCategory: Record<string, number> = {}

  for (const t of transactions) {
    const amt = Number(t.amount)
    if (amt > 0) {
      totalIncome += amt
    } else {
      const absAmt = Math.abs(amt)
      totalExpenses += absAmt
      const cat = (t.category ?? t.merchant_category ?? "uncategorized").toLowerCase()
      byCategory[cat] = (byCategory[cat] || 0) + absAmt

      if (isEssentialCategory(t.category) || isEssentialCategory(t.merchant_category)) {
        essentialExpenses += absAmt
      } else {
        discretionaryExpenses += absAmt
      }
    }
  }

  // Calculate date range for weekly averages
  const dates = transactions.map((t) => new Date(t.transaction_date).getTime()).filter((d) => !isNaN(d))
  const weeks = dates.length >= 2
    ? Math.max(1, (Math.max(...dates) - Math.min(...dates)) / (7 * 24 * 60 * 60 * 1000))
    : 1

  return {
    totalIncome,
    totalExpenses,
    netCashflow: totalIncome - totalExpenses,
    byCategory,
    essentialExpenses,
    discretionaryExpenses,
    avgWeeklyIncome: totalIncome / weeks,
    avgWeeklyExpenses: totalExpenses / weeks,
  }
}

/* ------------------------------------------------------------------ */
/*  Core: generate a production forecast from real transaction data    */
/* ------------------------------------------------------------------ */

/**
 * Generates a 9-month timeline (3 months history + 6 months forecast)
 * at weekly intervals.
 *
 * **Historical points** use actual aggregated income/expenses from the
 * transaction list.  **Future points** project forward using the
 * computed weekly averages, plus any known recurring subscription
 * amounts.
 *
 * The "Today" marker is placed at the closest data point to the
 * current local date.
 */
export function generateForecast(
  transactions: Transaction[],
  subscriptions: Subscription[] = []
): ForecastResult {
  const today = new Date()
  const todayStr = toDateKey(today)

  // Build weekly buckets from transaction data
  const weeklyIncome: Record<string, number> = {}
  const weeklyExpenses: Record<string, number> = {}

  for (const t of transactions) {
    const txDate = new Date(t.transaction_date)
    if (isNaN(txDate.getTime())) continue
    // Bucket to the Monday of the week
    const weekStart = new Date(txDate)
    const dayOfWeek = weekStart.getDay()
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
    weekStart.setDate(weekStart.getDate() + diff)
    const key = toDateKey(weekStart)

    const amt = Number(t.amount)
    if (amt > 0) {
      weeklyIncome[key] = (weeklyIncome[key] || 0) + amt
    } else {
      weeklyExpenses[key] = (weeklyExpenses[key] || 0) + Math.abs(amt)
    }
  }

  // Calculate averages from historical data
  const incomeValues = Object.values(weeklyIncome)
  const expenseValues = Object.values(weeklyExpenses)
  const avgWeeklyIncome = incomeValues.length > 0
    ? incomeValues.reduce((s, v) => s + v, 0) / incomeValues.length
    : 0
  const avgWeeklyExpenses = expenseValues.length > 0
    ? expenseValues.reduce((s, v) => s + v, 0) / expenseValues.length
    : 0

  // Monthly subscription total (for enriching future expense projections)
  const monthlySubscriptionTotal = subscriptions
    .filter((s) => s.is_active)
    .reduce((sum, s) => sum + Math.abs(Number(s.amount)), 0)
  const weeklySubscriptionAdjustment = monthlySubscriptionTotal / 4.33

  // Generate data points at weekly intervals
  const weeksBack = 12
  const weeksForward = 26
  const data: ForecastDataPoint[] = []
  let todayLabel = ""

  for (let w = -weeksBack; w <= weeksForward; w++) {
    const d = new Date(today)
    d.setDate(d.getDate() + w * 7)
    const key = toDateKey(d)
    const label = d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })

    const isToday = key === todayStr
    const isFuture = key > todayStr

    let income: number
    let expenses: number

    if (!isFuture && !isToday) {
      // Historical: use actual data if available, else the average
      // Find the Monday of this week for bucket lookup
      const weekStart = new Date(d)
      const dayOfWeek = weekStart.getDay()
      const diff2 = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
      weekStart.setDate(weekStart.getDate() + diff2)
      const bucketKey = toDateKey(weekStart)

      income = weeklyIncome[bucketKey] ?? avgWeeklyIncome
      expenses = weeklyExpenses[bucketKey] ?? avgWeeklyExpenses
    } else {
      // Future / Today: project using averages + subscription data
      income = avgWeeklyIncome
      // Blend subscription data with average — don't double count
      expenses = Math.max(avgWeeklyExpenses, weeklySubscriptionAdjustment)
    }

    data.push({
      date: label,
      rawDate: key,
      income: Math.round(income),
      expenses: Math.round(expenses),
      isToday,
      isFuture,
    })

    if (isToday) {
      todayLabel = label
    }
  }

  // If today didn't land exactly on a generated weekly point, snap to closest
  if (!todayLabel && data.length > 0) {
    let closest = data[0]
    let minDiff = Math.abs(new Date(data[0].rawDate).getTime() - today.getTime())
    for (const pt of data) {
      const diff3 = Math.abs(new Date(pt.rawDate).getTime() - today.getTime())
      if (diff3 < minDiff) {
        minDiff = diff3
        closest = pt
      }
    }
    closest.isToday = true
    closest.rawDate = todayStr
    closest.date = today.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
    todayLabel = closest.date
    for (const pt of data) {
      pt.isFuture = pt.rawDate > todayStr
    }
  }

  const lastPoint = data[data.length - 1]

  return {
    data,
    todayLabel,
    projectedIncome: lastPoint?.income ?? 0,
    projectedExpenses: lastPoint?.expenses ?? 0,
    projectedDate: lastPoint?.date ?? "",
  }
}

/* ------------------------------------------------------------------ */
/*  Month-end projection                                               */
/* ------------------------------------------------------------------ */

/**
 * Projects the net balance at the end of the current month using
 * real weekly averages from transaction data.
 */
export function projectMonthEnd(
  transactions: Transaction[],
  currentBalance: number
): { projected: number; daysRemaining: number } {
  const today = new Date()
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
  const daysRemaining = Math.max(0, endOfMonth.getDate() - today.getDate())

  const summary = buildSpendingSummary(transactions)
  const dailyNet = (summary.avgWeeklyIncome - summary.avgWeeklyExpenses) / 7
  const projected = currentBalance + dailyNet * daysRemaining

  return { projected: Math.round(projected), daysRemaining }
}
