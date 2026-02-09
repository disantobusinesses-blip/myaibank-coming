/**
 * Sanity-check script for verifying the transaction normalization pipeline.
 *
 * Usage:
 *   npx tsx scripts/sanity-check-transactions.ts
 *
 * This validates that:
 *   1. Demo mode returns deterministic demo transactions.
 *   2. The normalized schema is consistent between demo and live shapes.
 *   3. The assistant summary builder produces expected aggregates.
 *
 * NOTE: This does NOT call Fiskil or Supabase — it uses local demo data only.
 */

import { demoTransactions, demoAccounts } from "../lib/demo-data"
import {
  normalizeTransaction,
  normalizeTransactions,
  filterTransactions,
  buildTransactionSummary,
  NormalizedTransaction,
} from "../lib/transactions-provider"
import type { Transaction } from "../contexts/app-data-context"

// ── helpers ────────────────────────────────────────────────────────
function assert(cond: boolean, msg: string) {
  if (!cond) {
    console.error(`❌ FAIL: ${msg}`)
    process.exitCode = 1
  } else {
    console.log(`✅ PASS: ${msg}`)
  }
}

// ── 1. Demo data returns deterministic count ──────────────────────
console.log("\n=== Demo Data Check ===")
assert(demoTransactions.length === 72, `Demo transactions count is 72 (got ${demoTransactions.length})`)
assert(demoAccounts.length === 2, `Demo accounts count is 2 (got ${demoAccounts.length})`)

// ── 2. Normalization produces correct schema ─────────────────────
console.log("\n=== Normalization Check ===")

// Simulate what AppDataProvider does: convert demo data to Transaction shape
const mappedTransactions: Transaction[] = demoTransactions.map((t) => ({
  id: String(t.id),
  account_id: "demo-acc-1",
  fiskil_transaction_id: null,
  amount: t.amount,
  currency: "AUD",
  description: t.description,
  merchant_name: t.merchant_name,
  merchant_category: null,
  category: t.category,
  subcategory: null,
  transaction_type: t.transaction_type,
  transaction_date: t.transaction_date,
  posted_date: t.transaction_date,
  is_pending: false,
  is_recurring: t.is_subscription,
  is_subscription: t.is_subscription,
  tags: null,
  notes: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}))

const normalized = normalizeTransactions(mappedTransactions)
assert(normalized.length === 72, `Normalized count matches (got ${normalized.length})`)

const first = normalized[0]
const requiredKeys: (keyof NormalizedTransaction)[] = [
  "id",
  "date",
  "amount",
  "merchant",
  "description",
  "category",
  "type",
  "isSubscription",
  "isPending",
  "accountId",
  "currency",
]

for (const key of requiredKeys) {
  assert(key in first, `Normalized transaction has key '${key}'`)
}

assert(first.type === "debit" || first.type === "credit", `type is 'debit' or 'credit' (got '${first.type}')`)

// ── 3. Filtering works ───────────────────────────────────────────
console.log("\n=== Filter Check ===")
const filtered = filterTransactions(normalized, {
  categoryInclude: ["groceries"],
})
const allGroceries = filtered.every((t) => t.category.toLowerCase() === "groceries")
assert(allGroceries, "Category include filter returns only matching transactions")
assert(filtered.length > 0, `Groceries filter returned ${filtered.length} transactions`)

const excluded = filterTransactions(normalized, {
  categoryExclude: ["income"],
})
const noIncome = excluded.every((t) => t.category.toLowerCase() !== "income")
assert(noIncome, "Category exclude filter removes matching transactions")

// ── 4. Summary builder produces expected shape ───────────────────
console.log("\n=== Summary Builder Check ===")
const summary = buildTransactionSummary(normalized)
assert(typeof summary.totals.income === "number", `income is a number (${summary.totals.income})`)
assert(typeof summary.totals.expenses === "number", `expenses is a number (${summary.totals.expenses})`)
assert(summary.totals.income > 0, `income > 0 (${summary.totals.income})`)
assert(summary.totals.expenses > 0, `expenses > 0 (${summary.totals.expenses})`)
assert(typeof summary.byCategory === "object", "byCategory is an object")
assert(typeof summary.byMerchant === "object", "byMerchant is an object")
assert(Array.isArray(summary.subscriptions), "subscriptions is an array")
assert(summary.subscriptions.length > 0, `subscriptions found (${summary.subscriptions.length})`)
assert(summary.transactionCount === 72, `transactionCount is 72 (got ${summary.transactionCount})`)

// ── 5. Live-mode shape compatibility check ───────────────────────
console.log("\n=== Live/Demo Schema Parity Check ===")

// Simulate a live-mode transaction row from Supabase
const liveTx: Transaction = {
  id: "uuid-from-supabase",
  account_id: "acc-uuid",
  fiskil_transaction_id: "fiskil-tx-123",
  amount: -42.5,
  currency: "AUD",
  description: "Woolworths Town Hall",
  merchant_name: "Woolworths",
  merchant_category: null,
  category: "Groceries",
  subcategory: null,
  transaction_type: "debit",
  transaction_date: "2026-02-09",
  posted_date: "2026-02-09",
  is_pending: false,
  is_recurring: false,
  is_subscription: false,
  tags: null,
  notes: null,
  created_at: "2026-02-09T00:00:00Z",
  updated_at: "2026-02-09T00:00:00Z",
}

const liveNorm = normalizeTransaction(liveTx)
for (const key of requiredKeys) {
  assert(key in liveNorm, `Live normalized transaction has key '${key}'`)
}
assert(liveNorm.type === "debit", `Live transaction type is debit (got '${liveNorm.type}')`)

console.log("\n=== All checks complete ===\n")
