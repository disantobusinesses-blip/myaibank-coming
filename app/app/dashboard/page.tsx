"use client"

import { useAuth } from "@/contexts/auth-context"
import { useAppData } from "@/contexts/app-data-context"
import { CashflowChart } from "@/components/dashboard/cashflow-chart"
import { StatCard } from "@/components/dashboard/stat-card"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import { SyncStatusBanner } from "@/components/dashboard/sync-status-banner"
import { SplitText } from "@/components/split-text"
import { AnimatedContent } from "@/components/animated-content"
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
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

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

  const firstName = isDemoMode ? "Demo User" : (profile?.first_name || user?.email?.split("@")[0] || "there")

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-4xl mx-auto">
      {/* Demo Mode Banner */}
      {isDemoMode && (
        <AnimatedContent animation="fade-up" delay={0}>
          <div className="flex items-center justify-between p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
            <div className="flex items-center gap-3">
              <Info className="w-5 h-5 text-amber-500" />
              <div>
                <p className="font-medium text-amber-700 dark:text-amber-400">Demo Mode</p>
                <p className="text-sm text-amber-600 dark:text-amber-500">{"You're viewing sample data. Sign up to connect your real bank."}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button asChild size="sm" className="bg-[#1F0051] hover:bg-[#2d0075] text-white">
                <Link href="/signup">Sign Up</Link>
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleExitDemo}
                className="h-8 w-8 text-amber-600 hover:text-amber-700 hover:bg-amber-500/20"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </AnimatedContent>
      )}

      {/* Header */}
      <AnimatedContent animation="fade-up" delay={50}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Hi,{" "}
              <SplitText
                text={firstName}
                charDelay={50}
                startDelay={100}
              />
            </h1>
            <p className="text-muted-foreground">
              {"Here's your financial overview"}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            disabled={isLoading}
            className="gap-2 bg-transparent"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            Sync
          </Button>
        </div>
      </AnimatedContent>

      {/* Sync Status Banner */}
      <SyncStatusBanner status={syncStatus} />

      {/* Not Connected State */}
      {!connected && !isLoading && (
        <AnimatedContent animation="fade-up" delay={100}>
          <div className="p-6 rounded-2xl bg-card border border-border text-center">
            <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              Connect your bank account
            </h2>
            <p className="text-muted-foreground mb-4 max-w-sm mx-auto">
              Link your accounts to see your transactions, track spending, and get personalized insights.
            </p>
            <Button asChild className="bg-[#1F0051] hover:bg-[#2d0075] text-white">
              <Link href="/onboarding">
                Connect Bank
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </AnimatedContent>
      )}

      {/* Connected State - Stats */}
      {connected && (
        <>
          {/* Cashflow Chart */}
          <AnimatedContent animation="fade-up" delay={100}>
            <CashflowChart />
          </AnimatedContent>

          {/* Quick Stats */}
          <AnimatedContent animation="fade-up" delay={150}>
            <div className="grid grid-cols-2 gap-4">
              <StatCard
                title="Where you stand"
                subtitle="Total Cash"
                value={totalBalance}
                icon={<Wallet className="w-5 h-5" />}
                description="Available in accounts"
              />
              <Link href="/app/transactions" className="block">
                <StatCard
                  title="Income"
                  value={income}
                  icon={<TrendingUp className="w-5 h-5" />}
                  variant="teal"
                  showArrow
                />
              </Link>
            </div>
          </AnimatedContent>

          <AnimatedContent animation="fade-up" delay={200}>
            <div className="grid grid-cols-2 gap-4">
              <Link href="/app/budget-autopilot" className="block">
                <StatCard
                  title="Essential"
                  value={summary.essentialExpenses}
                  icon={<TrendingDown className="w-5 h-5" />}
                  variant="teal"
                  showArrow
                />
              </Link>
              <Link href="/app/budget-autopilot" className="block">
                <StatCard
                  title="Discretionary"
                  value={summary.discretionaryExpenses}
                  icon={<TrendingDown className="w-5 h-5" />}
                  variant="purple"
                  showArrow
                />
              </Link>
            </div>
          </AnimatedContent>

          {/* Recent Transactions */}
          <AnimatedContent animation="fade-up" delay={250}>
            <RecentTransactions transactions={transactions.slice(0, 5)} />
          </AnimatedContent>
        </>
      )}
    </div>
  )
}
