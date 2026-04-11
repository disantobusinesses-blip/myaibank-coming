"use client"

import React, { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { AppDataProvider, useAppData } from "@/contexts/app-data-context"
import { getNextRoute, buildRoutingState } from "@/lib/routing"
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
import Image from "next/image"

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
  // Initialize with null to indicate "not yet checked"
  const [isDemoMode, setIsDemoMode] = useState<boolean | null>(null)

  // Check demo mode on mount - runs once
  useEffect(() => {
    const demoActive = checkDemoMode()
    setIsDemoMode(demoActive)
  }, [])

  useEffect(() => {
    // Wait until demo mode check is complete (isDemoMode is not null)
    if (isDemoMode === null) return

    // Skip ALL auth redirects if in demo mode
    if (isDemoMode === true) return

    if (loading) return

    const state = buildRoutingState({
      loading,
      user,
      profile,
      demoMode: isDemoMode,
    })
    const dest = getNextRoute(state, pathname)
    if (dest) router.replace(dest)
  }, [user, profile, loading, router, isDemoMode, pathname])

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  const handleExitDemo = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("myaibank_demo_mode")
      sessionStorage.removeItem("mab_demo_ai_count")
      // Clear the demo mode cookie so the homepage doesn't redirect back
      document.cookie = "myaibank_demo_mode=; path=/; max-age=0; SameSite=Lax"
    }
    setIsDemoMode(false)
    router.push("/")
  }

  // Determine if we should show the app content
  // Show loading while demo mode check is pending (isDemoMode === null)
  const demoCheckPending = isDemoMode === null
  const showApp = isDemoMode === true || (!loading && user)
  const showLoading = demoCheckPending || (isDemoMode === false && (loading || !user))

  // IMPORTANT FIX:
  // Always mount AppDataProvider even during loading / unauth states.
  // This prevents "useAppData must be used within an AppDataProvider".
  return (
    <AppDataProvider>
      {showLoading ? (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="animate-pulse">
            <Image
              src="/MABtransparent.png"
              alt="MAB logo"
              width={80}
              height={32}
              className="object-contain opacity-40"
            />
          </div>
        </div>
      ) : showApp ? (
        <div className="min-h-screen bg-background flex">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:flex flex-col w-64 border-r bg-[#080810]" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            {/* Logo */}
            <div className="p-6 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
              <Link href="/app/dashboard" className="flex items-center">
                <Image
                  src="/MABtransparent.png"
                  alt="MAB logo"
                  width={96}
                  height={40}
                  className="object-contain"
                  priority
                />
              </Link>
              {/* PRO badge */}
              <div className="mt-3 px-3 py-1.5 rounded-lg bg-[#7c3aed]/10 border border-[#7c3aed]/20 inline-block">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#a78bfa]">PRO</p>
              </div>
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
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive
                        ? "nav-item-active-glow bg-[#7c3aed]/10 text-[#a78bfa] font-semibold"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04]"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                )
              })}
            </nav>

            {/* Sign Out / Exit Demo */}
            <div className="p-4 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
              <button
                onClick={isDemoMode ? handleExitDemo : handleSignOut}
                className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-muted-foreground hover:text-foreground hover:bg-white/[0.04] transition-all"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">{isDemoMode ? "Exit Demo" : "Sign Out"}</span>
              </button>
            </div>
          </aside>

          {/* Mobile Header & Bottom Nav */}
          <div className="flex-1 flex flex-col min-h-screen min-w-0">
            {/* Mobile Header - logo only, no text */}
            <header className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-border bg-background sticky top-0 z-40">
              <Link href="/app/dashboard" className="flex items-center">
                <Image
                  src="/MABtransparent.png"
                  alt="MAB logo"
                  width={80}
                  height={32}
                  className="object-contain"
                  priority
                />
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
                <div className="absolute right-0 top-0 bottom-0 w-72 bg-[#080810] flex flex-col" style={{ borderLeft: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="p-4 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <span className="font-semibold text-foreground">Menu</span>
                    <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-white/[0.04] rounded-lg">
                      <X className="w-5 h-5 text-muted-foreground" />
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
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                            isActive
                              ? "nav-item-active-glow bg-[#7c3aed]/10 text-[#a78bfa] font-semibold"
                              : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04]"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{item.label}</span>
                        </Link>
                      )
                    })}
                  </nav>
                  <div className="p-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                    <button
                      onClick={isDemoMode ? handleExitDemo : handleSignOut}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-muted-foreground hover:text-foreground hover:bg-white/[0.04] transition-all"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="font-medium">{isDemoMode ? "Exit Demo" : "Sign Out"}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Main Content */}
            <main className="flex-1 overflow-x-hidden">{children}</main>

            {/* AI Assistant */}
            <AIAssistant />

          </div>
        </div>
      ) : (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="animate-pulse">
            <Image
              src="/MABtransparent.png"
              alt="MAB logo"
              width={80}
              height={32}
              className="object-contain opacity-40"
            />
          </div>
        </div>
      )}
    </AppDataProvider>
  )
}
