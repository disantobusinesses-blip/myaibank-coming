"use client"

import { useAuth } from "@/contexts/auth-context"
import { useAppData } from "@/contexts/app-data-context"
import { CashflowChart } from "@/components/dashboard/cashflow-chart"
import { StatCard } from "@/components/dashboard/stat-card"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import { SyncStatusBanner } from "@/components/dashboard/sync-status-banner"
import { SplitText } from "@/components/split-text"
import { buildSpendingSummary } from "@/lib/financial-engine"
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Building2,
  RefreshCw,
  Info,
  X,
  Sparkles,
  Brain,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CountUp } from "@/components/count-up"

export default function DashboardPage() {
  const { user, profile } = useAuth()
  const { accounts, transactions, connected, syncStatus, refreshData, isLoading, isDemoMode, disableDemoMode } = useAppData()
  const router = useRouter()

  const handleExitDemo = () => {
    disableDemoMode()
    router.push("/")
  }

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0)
  const summary = buildSpendingSummary(transactions)
  const income = summary.totalIncome
  const expenses = summary.totalExpenses
  const netSaved = income - expenses
  const savingsRate = income > 0 ? Math.round((netSaved / income) * 100) : 0

  const firstName = isDemoMode
    ? "Demo"
    : profile?.first_name || user?.email?.split("@")[0] || "there"

  // Generate a rich AI insight from real data
  const topCategory = transactions
    .filter((t) => t.amount < 0 && t.category)
    .reduce((acc: Record<string, number>, t) => {
      const cat = t.category as string
      acc[cat] = (acc[cat] || 0) + Math.abs(t.amount)
      return acc
    }, {})

  const sortedCategories = Object.entries(topCategory).sort((a, b) => b[1] - a[1])
  const topCategoryName = sortedCategories[0]?.[0]
  const topCategoryAmount = sortedCategories[0]?.[1]

  // Investment projection constants for AI insight
  const ASSUMED_ANNUAL_RETURN = 0.10 // 10% avg S&P 500 return
  const PROJECTION_YEARS = 10
  const MONTHS_PER_YEAR = 12
  const ASSUMED_DAYS_PER_MONTH = 30

  // Calculate investment projection for insight
  // Estimate monthly savings from income - expenses divided by approximate months of transaction data
  const approxMonths = transactions.length > 0 ? Math.max(1, Math.ceil(transactions.length / ASSUMED_DAYS_PER_MONTH)) : 1
  const monthlySavings = income > 0 ? Math.round((income - expenses) / approxMonths) : 0
  const monthlyRate = ASSUMED_ANNUAL_RETURN / MONTHS_PER_YEAR
  const totalPeriods = PROJECTION_YEARS * MONTHS_PER_YEAR
  const futureValue10yr = monthlySavings > 0 ? Math.round(monthlySavings * MONTHS_PER_YEAR * ((Math.pow(1 + monthlyRate, totalPeriods) - 1) / monthlyRate)) : 0

  const aiInsight = topCategoryName && topCategoryAmount
    ? `Your highest spend is ${topCategoryName} at $${Math.round(topCategoryAmount).toLocaleString()}. ${
        savingsRate > 20
          ? `🎉 Great savings rate of ${savingsRate}%!${futureValue10yr > 0 ? ` If you invest your monthly surplus at 10% p.a., it could grow to ~$${Math.round(futureValue10yr).toLocaleString()} in 10 years.` : ""}`
          : savingsRate > 0
          ? `💡 Your savings rate is ${savingsRate}%. Try to push above 20% — even small increases compound significantly over time.`
          : "⚠️ Your expenses are exceeding income this period. Let's find areas to cut back."
      }`
    : "Connect your bank to unlock personalised AI insights, financial forecasts, and investment projections."

  const isPositiveBalance = totalBalance >= 0

  return (
    <div className="p-4 lg:p-6 space-y-5 max-w-4xl mx-auto">

      {/* Demo Mode Banner */}
      {isDemoMode && (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
          <div className="flex items-center gap-3">
            <Info className="w-5 h-5 text-amber-500 shrink-0" />
            <div>
              <p className="font-medium text-amber-400 text-sm">Demo Mode Active</p>
              <p className="text-xs text-amber-500/80">Viewing sample data. Connect your real bank to get started.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button asChild size="sm" className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-xs">
              <Link href="/signup">Sign Up Free</Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleExitDemo}
              className="h-8 w-8 text-amber-600 hover:bg-amber-500/20"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold mb-1">
            {new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 18 ? "Good afternoon" : "Good evening"},
          </p>
          <h1 className="text-2xl font-bold text-foreground">
            <SplitText text={firstName} charDelay={50} startDelay={100} />
          </h1>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={refreshData}
          disabled={isLoading}
          className="gap-2 bg-transparent border-white/10 hover:bg-white/5 text-muted-foreground text-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
          Sync
        </Button>
      </div>

      {/* Sync Status */}
      <SyncStatusBanner status={syncStatus} />

      {/* Not Connected */}
      {!connected && !isLoading && (
        <div className="card-glass rounded-2xl p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#7c3aed]/10 flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-[#7c3aed]" />
          </div>
          <h2 className="text-lg font-semibold text-foreground mb-2">Connect your bank</h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
            Link your accounts to see transactions, track spending, and get your AI financial insights.
          </p>
          <Button asChild className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white">
            <Link href="/onboarding">
              Connect Bank
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      )}

      {/* Connected State */}
      {connected && (
        <>
          {/* NET WORTH HERO CARD */}
          <div
            className="relative rounded-2xl overflow-hidden p-6"
            style={{
              background: "linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(15,15,22,0.95) 50%, rgba(20,184,166,0.08) 100%)",
              border: "1px solid rgba(124,58,237,0.2)",
            }}
          >
            {/* Background glow */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 rounded-full balance-pulse pointer-events-none"
              style={{ background: "radial-gradient(ellipse, rgba(124,58,237,0.2) 0%, transparent 70%)" }}
            />

            <div className="relative">
              <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold mb-2">
                Total Net Worth
              </p>
              <p className={`text-5xl font-bold tabular-nums mb-1 ${isPositiveBalance ? "text-white number-glow-white" : "text-[#f87171]"}`}>
                <CountUp
                  to={Math.abs(totalBalance)}
                  duration={2800}
                  formatter={(v) => `${totalBalance < 0 ? "-" : ""}$${Math.round(v).toLocaleString()}`}
                />
              </p>
              {netSaved > 0 && (
                <p className="text-sm text-[#22c55e] font-medium flex items-center gap-1.5 mt-1">
                  <TrendingUp className="w-4 h-4" />
                  +${Math.round(netSaved).toLocaleString()} saved this period
                </p>
              )}

              {/* Account breakdown */}
              {accounts.length > 1 && (
                <div className="mt-4 pt-4 space-y-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Account Breakdown</p>
                  {accounts.map((acc) => (
                    <div key={acc.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <Building2 className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                        <span className="text-xs text-muted-foreground truncate">
                          {acc.account_name || acc.institution_name || "Account"}
                          {acc.account_type ? ` · ${acc.account_type}` : ""}
                        </span>
                      </div>
                      <span className={`text-xs font-semibold tabular-nums ml-2 ${acc.balance >= 0 ? "text-foreground" : "text-[#f87171]"}`}>
                        {acc.balance < 0 ? "-" : ""}${Math.abs(Math.round(acc.balance)).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Mini stats row */}
              <div className="flex items-center gap-6 mt-5 pt-5" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Income</p>
                  <p className="text-sm font-bold text-[#22c55e] tabular-nums">
                    +${Math.round(income).toLocaleString()}
                  </p>
                </div>
                <div style={{ width: 1, height: 32, background: "rgba(255,255,255,0.06)" }} />
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Expenses</p>
                  <p className="text-sm font-bold text-foreground tabular-nums">
                    -${Math.round(expenses).toLocaleString()}
                  </p>
                </div>
                <div style={{ width: 1, height: 32, background: "rgba(255,255,255,0.06)" }} />
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Savings Rate</p>
                  <p className={`text-sm font-bold tabular-nums ${savingsRate >= 20 ? "text-[#22c55e]" : "text-[#f59e0b]"}`}>
                    {savingsRate}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* AI INSIGHT CARD */}
          <Link href="/app/copilot">
            <div className="ai-insight-border rounded-2xl p-4 cursor-pointer hover:border-[#7c3aed]/40 transition-all group">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#7c3aed]/15 flex items-center justify-center shrink-0">
                  <Brain className="w-5 h-5 text-[#a78bfa]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#a78bfa]">
                      AI Insight
                    </p>
                    <Sparkles className="w-3 h-3 text-[#7c3aed]" />
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed">{aiInsight}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground/40 shrink-0 mt-1 group-hover:text-[#7c3aed] transition-colors" />
              </div>
            </div>
          </Link>

          {/* Cashflow Chart */}
          <CashflowChart />

          {/* Stat Cards — 3 column */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <StatCard
              title="Total Cash"
              subtitle="Across accounts"
              value={totalBalance}
              icon={<Wallet className="w-4 h-4" />}
              variant="default"
              trend={savingsRate}
              trendLabel="savings rate"
            />
            <Link href="/app/transactions" className="block">
              <StatCard
                title="Income"
                subtitle="This period"
                value={income}
                icon={<TrendingUp className="w-4 h-4" />}
                variant="green"
                showArrow
              />
            </Link>
            <Link href="/app/budget-autopilot" className="block">
              <StatCard
                title="Expenses"
                subtitle="This period"
                value={expenses}
                icon={<TrendingDown className="w-4 h-4" />}
                variant="purple"
                showArrow
              />
            </Link>
          </div>

          {/* Recent Transactions */}
          <RecentTransactions transactions={transactions.slice(0, 6)} />
        </>
      )}
    </div>
  )
}
