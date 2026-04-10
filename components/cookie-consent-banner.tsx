"use client"

import { useEffect, useState } from "react"
import {
  loadConsent,
  saveConsent,
  updateGAConsent,
  clearConsent,
} from "@/lib/cookie-consent"

type View = "banner" | "modal" | "hidden"

export function CookieConsentBanner() {
  const [view, setView] = useState<View>("hidden")
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false)

  // On mount: restore previous consent or show the banner
  useEffect(() => {
    const stored = loadConsent()
    if (stored) {
      // Restore GA consent silently — gtag may not be ready yet, retry
      const restore = () => updateGAConsent(stored.analytics)
      restore()
      setTimeout(restore, 600)
    } else {
      setView("banner")
    }

    // Listen for the global "openCookieSettings" event (from footer link)
    const handler = () => {
      const current = loadConsent()
      setAnalyticsEnabled(current?.analytics ?? false)
      setView("modal")
    }
    window.addEventListener("openCookieSettings", handler)
    return () => window.removeEventListener("openCookieSettings", handler)
  }, [])

  function acceptAll() {
    saveConsent(true)
    updateGAConsent(true)
    setView("hidden")
  }

  function rejectNonEssential() {
    saveConsent(false)
    updateGAConsent(false)
    setView("hidden")
  }

  function openManage() {
    const current = loadConsent()
    setAnalyticsEnabled(current?.analytics ?? false)
    setView("modal")
  }

  function savePreferences() {
    saveConsent(analyticsEnabled)
    updateGAConsent(analyticsEnabled)
    setView("hidden")
  }

  if (view === "hidden") return null

  return (
    <>
      {/* ── Backdrop for modal ─────────────────────────────────────────── */}
      {view === "modal" && (
        <div
          className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm"
          onClick={savePreferences}
        />
      )}

      {/* ── Banner ─────────────────────────────────────────────────────── */}
      {view === "banner" && (
        <div
          className="fixed bottom-0 left-0 right-0 z-[9999] px-4 pb-4 sm:px-6"
          role="region"
          aria-label="Cookie consent"
        >
          <div
            className="mx-auto max-w-3xl rounded-2xl p-5 sm:p-6 shadow-2xl"
            style={{
              background: "rgba(15, 10, 30, 0.97)",
              border: "1px solid rgba(124, 58, 237, 0.3)",
              backdropFilter: "blur(16px)",
            }}
          >
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              {/* Text */}
              <div className="flex-1 min-w-0">
                <p
                  className="text-sm font-semibold mb-1"
                  style={{ color: "rgba(255,255,255,0.95)" }}
                >
                  We use cookies
                </p>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
                  We use essential cookies to keep the site running and optional analytics cookies to
                  understand how you use MyAiBank. We never share or sell your data. No marketing or
                  advertising cookies are used.{" "}
                  <a href="/privacy" className="underline underline-offset-2 hover:text-white/80 transition-colors">
                    Privacy Policy
                  </a>
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2 shrink-0">
                <button
                  onClick={openManage}
                  className="px-4 py-2 rounded-xl text-xs font-medium transition-colors"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "rgba(255,255,255,0.7)",
                  }}
                >
                  Manage preferences
                </button>
                <button
                  onClick={rejectNonEssential}
                  className="px-4 py-2 rounded-xl text-xs font-medium transition-colors"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "rgba(255,255,255,0.7)",
                  }}
                >
                  Reject non-essential
                </button>
                <button
                  onClick={acceptAll}
                  className="px-4 py-2 rounded-xl text-xs font-semibold transition-colors"
                  style={{
                    background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
                    border: "1px solid rgba(124,58,237,0.5)",
                    color: "#fff",
                  }}
                >
                  Accept cookies
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Preferences modal ──────────────────────────────────────────── */}
      {view === "modal" && (
        <div
          className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-prefs-title"
        >
          <div
            className="w-full max-w-md rounded-2xl p-6 shadow-2xl"
            style={{
              background: "rgba(15, 10, 30, 0.99)",
              border: "1px solid rgba(124, 58, 237, 0.3)",
              backdropFilter: "blur(20px)",
            }}
          >
            <h2
              id="cookie-prefs-title"
              className="text-base font-semibold mb-1"
              style={{ color: "rgba(255,255,255,0.95)" }}
            >
              Cookie Preferences
            </h2>
            <p className="text-xs mb-5 leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
              Choose which cookies you allow. Essential cookies cannot be disabled as they are
              required for the site to function.
            </p>

            {/* Essential — always on */}
            <div
              className="flex items-start justify-between gap-4 rounded-xl p-4 mb-3"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium mb-0.5" style={{ color: "rgba(255,255,255,0.9)" }}>
                  Essential
                </p>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
                  Required for authentication, security, and core site functionality. Always active.
                </p>
              </div>
              <span
                className="mt-0.5 shrink-0 text-xs font-medium px-2.5 py-1 rounded-full"
                style={{ background: "rgba(124,58,237,0.2)", color: "#a78bfa" }}
              >
                Always on
              </span>
            </div>

            {/* Analytics — toggleable */}
            <div
              className="flex items-start justify-between gap-4 rounded-xl p-4 mb-5"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium mb-0.5" style={{ color: "rgba(255,255,255,0.9)" }}>
                  Analytics
                </p>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
                  Helps us understand how you use MyAiBank so we can improve the product. No
                  financial or personal data is sent.
                </p>
              </div>
              {/* Toggle switch */}
              <button
                role="switch"
                aria-checked={analyticsEnabled}
                onClick={() => setAnalyticsEnabled((v) => !v)}
                className="mt-0.5 shrink-0 relative w-10 h-6 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                style={{
                  background: analyticsEnabled
                    ? "linear-gradient(135deg, #7c3aed, #6d28d9)"
                    : "rgba(255,255,255,0.12)",
                  border: analyticsEnabled
                    ? "1px solid rgba(124,58,237,0.5)"
                    : "1px solid rgba(255,255,255,0.15)",
                }}
              >
                <span
                  className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200"
                  style={{ transform: analyticsEnabled ? "translateX(16px)" : "translateX(0)" }}
                />
              </button>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={rejectNonEssential}
                className="flex-1 py-2.5 rounded-xl text-xs font-medium transition-colors"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.7)",
                }}
              >
                Reject all
              </button>
              <button
                onClick={savePreferences}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold transition-colors"
                style={{
                  background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
                  border: "1px solid rgba(124,58,237,0.5)",
                  color: "#fff",
                }}
              >
                Save preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
