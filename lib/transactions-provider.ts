import type { Transaction } from "@/contexts/app-data-context"

/**
 * NormalizedTransaction — the single canonical schema used everywhere:
 * dashboard display, AI assistant context, sanity checks.
 */
export interface NormalizedTransaction {
  id: string
  date: string
  amount: number
  merchant: string
  description: string
  category: string
  type: "credit" | "debit"
  isSubscription: boolean
  isPending: boolean
  accountId: string | null
  currency: string
}

export interface TransactionFilters {
  dateFrom?: string
  dateTo?: string
  accountIds?: string[]
  categoryInclude?: string[]
  categoryExclude?: string[]
}

/**
 * Normalize a single raw transaction (from Supabase or demo data)
 * into the canonical NormalizedTransaction shape.
 */
export function normalizeTransaction(t: Transaction): NormalizedTransaction {
  const amount = Number(t.amount)
  return {
    id: String(t.id),
    date: t.transaction_date,
    amount,
    merchant: t.merchant_name ?? t.description ?? "Unknown",
    description: t.description ?? "",
    category: t.category ?? t.merchant_category ?? "uncategorized",
    type: amount >= 0 ? "credit" : "debit",
    isSubscription: t.is_subscription,
    isPending: t.is_pending,
    accountId: t.account_id ?? null,
    currency: t.currency ?? "AUD",
  }
}

/**
 * Normalize a list of raw transactions.
 */
export function normalizeTransactions(txs: Transaction[]): NormalizedTransaction[] {
  return txs.map(normalizeTransaction)
}

/**
 * Apply optional filters to an array of normalized transactions.
 */
export function filterTransactions(
  txs: NormalizedTransaction[],
  filters?: TransactionFilters
): NormalizedTransaction[] {
  if (!filters) return txs

  let result = txs

  if (filters.dateFrom) {
    result = result.filter((t) => t.date >= filters.dateFrom!)
  }
  if (filters.dateTo) {
    result = result.filter((t) => t.date <= filters.dateTo!)
  }
  if (filters.accountIds && filters.accountIds.length > 0) {
    const set = new Set(filters.accountIds)
    result = result.filter((t) => t.accountId !== null && set.has(t.accountId))
  }
  if (filters.categoryInclude && filters.categoryInclude.length > 0) {
    const set = new Set(filters.categoryInclude.map((c) => c.toLowerCase()))
    result = result.filter((t) => set.has(t.category.toLowerCase()))
  }
  if (filters.categoryExclude && filters.categoryExclude.length > 0) {
    const set = new Set(filters.categoryExclude.map((c) => c.toLowerCase()))
    result = result.filter((t) => !set.has(t.category.toLowerCase()))
  }

  return result
}

/**
 * Build aggregate summary from normalized transactions.
 * Used to populate the AI assistant context.
 */
export function buildTransactionSummary(txs: NormalizedTransaction[]) {
  const income = txs
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0)

  const expenses = Math.abs(
    txs.filter((t) => t.amount < 0).reduce((sum, t) => sum + t.amount, 0)
  )

  const byCategory = txs.reduce<Record<string, number>>((acc, t) => {
    if (t.amount >= 0) return acc
    acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount)
    return acc
  }, {})

  const byMerchant = txs.reduce<Record<string, number>>((acc, t) => {
    if (t.amount >= 0) return acc
    acc[t.merchant] = (acc[t.merchant] || 0) + Math.abs(t.amount)
    return acc
  }, {})

  const subscriptions = txs.filter((t) => t.isSubscription)

  return {
    totals: { income, expenses, net: income - expenses },
    byCategory,
    byMerchant,
    subscriptions,
    transactionCount: txs.length,
  }
}
