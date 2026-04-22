"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "./auth-context"
import { demoAccounts, demoTransactions, demoSubscriptions } from "@/lib/demo-data"

export interface Transaction {
  id: string
  account_id: string | null
  amount: number
  currency: string
  description: string | null
  merchant_name: string | null
  merchant_category: string | null
  category: string | null
  subcategory: string | null
  transaction_type: string | null
  transaction_date: string
  posted_date: string | null
  is_pending: boolean
  is_recurring: boolean
  is_subscription: boolean
  tags: string[] | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Account {
  id: string
  institution_name: string | null
  account_name: string | null
  account_type: string | null
  account_number_masked: string | null
  bsb: string | null
  balance: number
  available_balance: number
  currency: string
  is_primary: boolean
  last_synced_at: string | null
  created_at: string
  updated_at: string
}

export interface Subscription {
  id: string
  name: string
  amount: number
  currency: string
  frequency: string
  category: string | null
  next_billing_date: string | null
  is_active: boolean
  merchant_name: string | null
  created_at: string
  updated_at: string
}

interface SyncStatus {
  stage: "idle" | "connecting" | "syncing" | "complete" | "error"
  progress: number
  message: string
}

interface AppDataContextType {
  accounts: Account[]
  transactions: Transaction[]
  // Full 12-month transaction history for accurate forecasting
  forecastTransactions: Transaction[]
  subscriptions: Subscription[]
  connected: boolean
  lastUpdated: string | null
  syncStatus: SyncStatus
  refreshData: () => Promise<void>
  isLoading: boolean
  totalBalance: number
  totalIncome: number
  totalExpenses: number
  isDemoMode: boolean
  enableDemoMode: () => void
  disableDemoMode: () => void
}

const defaultAppData: AppDataContextType = {
  accounts: [],
  transactions: [],
  forecastTransactions: [],
  subscriptions: [],
  connected: false,
  lastUpdated: null,
  syncStatus: { stage: "idle", progress: 0, message: "" },
  refreshData: async () => {},
  isLoading: true,
  totalBalance: 0,
  totalIncome: 0,
  totalExpenses: 0,
  isDemoMode: false,
  enableDemoMode: () => {},
  disableDemoMode: () => {},
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined)

export function AppDataProvider({ children }: { children: ReactNode }) {
  const { user, profile } = useAuth()
  const [accounts, setAccounts] = useState<Account[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [forecastTransactions, setForecastTransactions] = useState<Transaction[]>([])
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [connected, setConnected] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    stage: "idle",
    progress: 0,
    message: "",
  })

  const supabase = createClient()

  const enableDemoMode = useCallback(() => {
    try {
      setIsDemoMode(true)

      const mappedAccounts: Account[] = demoAccounts.map((a) => ({
        id: a.id,
        institution_name: a.institution_name,
        account_name: a.account_name,
        account_type: a.account_type,
        account_number_masked: "****1234",
        bsb: "062-000",
        balance: a.balance,
        available_balance: a.available_balance,
        currency: "AUD",
        is_primary: a.id === "demo-acc-1",
        last_synced_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }))

      const mappedTransactions: Transaction[] = demoTransactions.map((t) => ({
        id: t.id,
        account_id: "demo-acc-1",
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

      const mappedSubscriptions: Subscription[] = demoSubscriptions.map((s) => ({
        id: s.id,
        name: s.name,
        amount: s.amount,
        currency: "AUD",
        frequency: s.frequency,
        category: s.category,
        next_billing_date: s.next_billing_date,
        is_active: s.is_active,
        merchant_name: s.name,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }))

      setAccounts(mappedAccounts)
      setTransactions(mappedTransactions)
      setForecastTransactions(mappedTransactions)
      setSubscriptions(mappedSubscriptions)
      setConnected(true)
      setLastUpdated(new Date().toISOString())
      setSyncStatus({ stage: "complete", progress: 100, message: "Demo data loaded" })
      setIsLoading(false)

      if (typeof window !== "undefined") {
        sessionStorage.setItem("myaibank_demo_mode", "true")
      }
    } catch (error) {
      console.error("Error enabling demo mode:", error)
      setIsLoading(false)
      setSyncStatus({ stage: "error", progress: 0, message: "Failed to load demo data" })
    }
  }, [])

  const disableDemoMode = useCallback(() => {
    try {
      setIsDemoMode(false)
      setAccounts([])
      setTransactions([])
      setForecastTransactions([])
      setSubscriptions([])
      setConnected(false)
      setSyncStatus({ stage: "idle", progress: 0, message: "" })

      if (typeof window !== "undefined") {
        sessionStorage.removeItem("myaibank_demo_mode")
        document.cookie = "myaibank_demo_mode=; path=/; max-age=0"
      }
    } catch (error) {
      console.error("Error disabling demo mode:", error)
    }
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") {
      const demoMode = sessionStorage.getItem("myaibank_demo_mode")
      if (demoMode === "true") enableDemoMode()
    }
  }, [enableDemoMode])

  const refreshData = useCallback(async () => {
    if (isDemoMode) { enableDemoMode(); return }
    if (!user) { setIsLoading(false); return }

    setIsLoading(true)
    setSyncStatus({ stage: "syncing", progress: 20, message: "Fetching your accounts..." })

    try {
      // Fetch accounts
      const { data: accountsData, error: accountsError } = await supabase
        .from("bank_accounts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true })

      if (accountsError) throw accountsError
      setAccounts(accountsData || [])

      setSyncStatus({ stage: "syncing", progress: 45, message: "Fetching recent transactions..." })

      // Recent transactions (90 days) for dashboard/cashflow views
      const ninetyDaysAgo = new Date()
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)

      const { data: transactionsData, error: transactionsError } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)
        .gte("transaction_date", ninetyDaysAgo.toISOString().split("T")[0])
        .order("transaction_date", { ascending: false })

      if (transactionsError) throw transactionsError
      setTransactions(transactionsData || [])

      setSyncStatus({ stage: "syncing", progress: 65, message: "Fetching 12-month history for forecasting..." })

      // Full 12-month history for accurate cash flow forecasting
      const twelveMonthsAgo = new Date()
      twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12)

      const { data: forecastData, error: forecastError } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)
        .gte("transaction_date", twelveMonthsAgo.toISOString().split("T")[0])
        .order("transaction_date", { ascending: false })

      if (forecastError) {
        console.warn("Failed to fetch forecast transactions, falling back to 90-day data:", forecastError)
        setForecastTransactions(transactionsData || [])
      } else {
        setForecastTransactions(forecastData || [])
      }

      setSyncStatus({ stage: "syncing", progress: 85, message: "Fetching subscriptions..." })

      // Fetch subscriptions
      const { data: subscriptionsData, error: subscriptionsError } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .order("next_billing_date", { ascending: true })

      if (subscriptionsError) throw subscriptionsError
      setSubscriptions(subscriptionsData || [])

      setConnected((accountsData?.length || 0) > 0)
      setLastUpdated(new Date().toISOString())
      setSyncStatus({ stage: "complete", progress: 100, message: "Data synced successfully" })
    } catch (error) {
      console.error("Error refreshing data:", error)
      setSyncStatus({ stage: "error", progress: 0, message: "Failed to sync data" })
    } finally {
      setIsLoading(false)
    }
  }, [user, supabase, isDemoMode, enableDemoMode])

  useEffect(() => {
    if (isDemoMode) return
    if (profile?.has_bank_connection) {
      refreshData()
    } else {
      setIsLoading(false)
      setSyncStatus({ stage: "idle", progress: 0, message: "No bank connected" })
    }
  }, [profile?.has_bank_connection, refreshData, isDemoMode])

  const totalBalance = accounts.reduce((sum, acc) => sum + Number(acc.balance), 0)

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const recentTransactions = transactions.filter((t) => new Date(t.transaction_date) >= thirtyDaysAgo)

  const totalIncome = recentTransactions
    .filter((t) => Number(t.amount) > 0)
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const totalExpenses = Math.abs(
    recentTransactions
      .filter((t) => Number(t.amount) < 0)
      .reduce((sum, t) => sum + Number(t.amount), 0)
  )

  return (
    <AppDataContext.Provider
      value={{
        accounts,
        transactions,
        forecastTransactions,
        subscriptions,
        connected,
        lastUpdated,
        syncStatus,
        refreshData,
        isLoading,
        totalBalance,
        totalIncome,
        totalExpenses,
        isDemoMode,
        enableDemoMode,
        disableDemoMode,
      }}
    >
      {children}
    </AppDataContext.Provider>
  )
}

export function useAppData(): AppDataContextType {
  const context = useContext(AppDataContext)
  if (context === undefined) {
    if (typeof window === "undefined") return defaultAppData
    throw new Error("useAppData must be used within an AppDataProvider")
  }
  return context
}
