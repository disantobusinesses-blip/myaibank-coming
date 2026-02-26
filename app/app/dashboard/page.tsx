"use client"

import { useAuth } from "@/contexts/auth-context"
import { useAppData } from "@/contexts/app-data-context"
import { CashflowChart } from "@/components/dashboard/cashflow-chart"
import { StatCard } from "@/components/dashboard/stat-card"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import { SyncStatusBanner } from "@/components/dashboard/sync-status-banner"
import FloatingLines from "@/components/FloatingLines"
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
  const income = transactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0)
  const expenses = transactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)

  const firstName = isDemoMode ? "Demo User" : (profile?.first_name || user?.email?.split("@")[0] || "there")

  return (
    <div className="relative min-h-full overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 z-0">
        <FloatingLines
          linesGradient={['#180D27', '#2d1b69', '#6b21a8', '#8b5cf6', '#E947F5']}
          enabledWaves={['top', 'middle', 'bottom']}
          lineCount={[8, 10, 6]}
          lineDistance={[5, 4, 6]}
          animationSpeed={0.6}
          interactive={true}
          bendRadius={4.0}
          bendStrength={-0.4}
          parallax={true}
          parallaxStrength={0.15}
          mixBlendMode="normal"
        />
      </div>

      <div className="relative z-10 p-4 lg:p-6 space-y-6 max-w-4xl mx-auto">
      {/* Demo Mode Banner */}
      {isDemoMode && (
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
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Hi, {firstName}
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

      {/* Sync Status Banner */}
      <SyncStatusBanner status={syncStatus} />

      {/* Not Connected State */}
      {!connected && !isLoading && (
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
      )}

      {/* Connected State - Stats */}
      {connected && (
        <>
          {/* Cashflow Chart */}
          <CashflowChart />

          {/* Quick Stats */}
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

          <div className="grid grid-cols-2 gap-4">
            <Link href="/app/budget-autopilot" className="block">
              <StatCard
                title="Good Expenses"
                value={expenses * 0.6}
                icon={<TrendingDown className="w-5 h-5" />}
                variant="teal"
                showArrow
              />
            </Link>
            <Link href="/app/budget-autopilot" className="block">
              <StatCard
                title="Bad Expenses"
                value={expenses * 0.4}
                icon={<TrendingDown className="w-5 h-5" />}
                variant="purple"
                showArrow
              />
            </Link>
          </div>

          {/* Recent Transactions */}
          <RecentTransactions transactions={transactions.slice(0, 5)} />
        </>
      )}
      </div>
    </div>
  )
}
