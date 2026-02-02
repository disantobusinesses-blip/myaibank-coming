"use client"

import React, { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/contexts/auth-context"
import { AppDataProvider, useAppData } from "@/contexts/app-data-context"
import {
  LayoutDashboard,
  CreditCard,
  RefreshCcw,
  TrendingUp,
  Gauge,
  ArrowLeftRight,
  FileText,
  Briefcase,
  User,
  BarChart3,
  Menu,
  X,
  LogOut,
} from "lucide-react"
import { AIAssistant } from "@/components/ai-assistant"

const navItems = [
  { href: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/app/transactions", label: "Transactions", icon: CreditCard },
  { href: "/app/subscriptions", label: "Subscriptions", icon: RefreshCcw },
  { href: "/app/forecast", label: "Forecast", icon: TrendingUp },
  { href: "/app/budget-autopilot", label: "Budget", icon: Gauge },
  { href: "/app/cashflow", label: "Cashflow", icon: ArrowLeftRight },
  { href: "/app/reports", label: "Reports", icon: FileText },
  { href: "/app/portfolio", label: "Portfolio", icon: Briefcase },
  { href: "/app/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/app/profile", label: "Profile", icon: User },
]

// Check if demo mode is active from sessionStorage
function checkDemoMode(): boolean {
  if (typeof window === "undefined") return false
  return sessionStorage.getItem("myaibank_demo_mode") === "true"
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, profile, loading, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isDemoMode, setIsDemoMode] = useState(false)

  // Check demo mode on mount and when window becomes available
  useEffect(() => {
    setIsDemoMode(checkDemoMode())
  }, [])

  useEffect(() => {
    // Skip auth redirect if in demo mode
    if (isDemoMode) return

    if (!loading && !user) {
      router.push("/login")
    } else if (!loading && user && profile && !profile.is_onboarded) {
      router.push("/onboarding")
    }
  }, [user, profile, loading, router, isDemoMode])

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  const handleExitDemo = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("myaibank_demo_mode")
      sessionStorage.removeItem("mab_demo_ai_count")
    }
    setIsDemoMode(false)
    router.push("/")
  }

  // Determine if we should show the app content
  const showApp = isDemoMode || (!loading && user)
  const showLoading = !isDemoMode && (loading || !user)

  // IMPORTANT FIX:
  // Always mount AppDataProvider even during loading / unauth states.
  // This prevents "useAppData must be used within an AppDataProvider".
  return (
    <AppDataProvider>
      {showLoading ? (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="animate-pulse">
            <Image src="/logo.jpeg" alt="MyAiBank" width={60} height={60} className="rounded-xl" />
          </div>
        </div>
      ) : showApp ? (
        <div className="min-h-screen bg-background flex">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-sidebar">
            {/* Logo */}
            <div className="p-6 border-b border-sidebar-border">
              <Link href="/app/dashboard" className="flex items-center gap-3">
                <Image src="/logo.jpeg" alt="MyAiBank" width={40} height={40} className="rounded-xl" />
                <span className="font-semibold text-lg text-sidebar-foreground">MyAiBank</span>
              </Link>
            </div>

            {/* Nav Items */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                )
              })}
            </nav>

            {/* Sign Out / Exit Demo */}
            <div className="p-4 border-t border-sidebar-border">
              <button
                onClick={isDemoMode ? handleExitDemo : handleSignOut}
                className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">{isDemoMode ? "Exit Demo" : "Sign Out"}</span>
              </button>
            </div>
          </aside>

          {/* Mobile Header & Bottom Nav */}
          <div className="flex-1 flex flex-col min-h-screen">
            {/* Mobile Header */}
            <header className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-border bg-background sticky top-0 z-40">
              <Link href="/app/dashboard" className="flex items-center gap-2">
                <Image src="/logo.jpeg" alt="MyAiBank" width={32} height={32} className="rounded-lg" />
                <span className="font-semibold text-foreground">MyAiBank</span>
              </Link>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 text-foreground hover:bg-secondary rounded-lg"
              >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </header>

            {/* Mobile Slide-over Menu */}
            {sidebarOpen && (
              <div className="lg:hidden fixed inset-0 z-50">
                <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
                <div className="absolute right-0 top-0 bottom-0 w-72 bg-sidebar border-l border-sidebar-border flex flex-col">
                  <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
                    <span className="font-semibold text-sidebar-foreground">Menu</span>
                    <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-sidebar-accent rounded-lg">
                      <X className="w-5 h-5 text-sidebar-foreground" />
                    </button>
                  </div>
                  <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                      const Icon = item.icon
                      const isActive = pathname === item.href
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setSidebarOpen(false)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                            isActive
                              ? "bg-sidebar-primary text-sidebar-primary-foreground"
                              : "text-sidebar-foreground hover:bg-sidebar-accent"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{item.label}</span>
                        </Link>
                      )
                    })}
                  </nav>
                  <div className="p-4 border-t border-sidebar-border">
                    <button
                      onClick={isDemoMode ? handleExitDemo : handleSignOut}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="font-medium">{isDemoMode ? "Exit Demo" : "Sign Out"}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Main Content */}
            <main className="flex-1 pb-20 lg:pb-0">{children}</main>

            {/* AI Assistant */}
            <AIAssistant />

            {/* Mobile Bottom Navigation */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border safe-area-inset z-30">
              <div className="flex items-center justify-around py-2">
                {navItems.slice(0, 5).map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                        isActive ? "text-[#1F0051]" : "text-muted-foreground"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-xs font-medium">{item.label.slice(0, 6)}</span>
                    </Link>
                  )
                })}
              </div>
            </nav>
          </div>
        </div>
      ) : (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="animate-pulse">
            <Image src="/logo.jpeg" alt="MyAiBank" width={60} height={60} className="rounded-xl" />
          </div>
        </div>
      )}
    </AppDataProvider>
  )
}
