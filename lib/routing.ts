/**
 * Centralized routing guard — single source of truth for ALL navigation decisions.
 *
 * Usage:
 *   const dest = getNextRoute(state, currentPath)
 *   if (dest) router.push(dest)     // null means "stay where you are"
 */

// ── Route constants ──────────────────────────────────────────────────
export const ROUTES = {
  LANDING: "/",
  SIGNIN: "/login",
  SIGNUP: "/signup",
  ONBOARDING: "/onboarding",
  DASHBOARD: "/app/dashboard",
  AUTH_CALLBACK: "/auth/callback",
  AUTH_ERROR: "/auth/error",
  FISKIL_CALLBACK: "/fiskil/callback",
  WHAT_WE_DO: "/what-we-do",
} as const

// Routes that never require a session
const PUBLIC_ROUTES: Set<string> = new Set([
  ROUTES.LANDING,
  ROUTES.SIGNIN,
  ROUTES.SIGNUP,
  ROUTES.AUTH_CALLBACK,
  ROUTES.AUTH_ERROR,
  ROUTES.WHAT_WE_DO,
  // Marketing / public content pages
  "/features",
  "/pricing",
  "/blog",
  "/security",
  "/contact",
  "/privacy",
  "/terms",
])

// Routes that handle their own transition logic and should not be
// redirected away from while they are active (e.g. processing callbacks)
const TRANSITION_ROUTES: Set<string> = new Set([
  ROUTES.SUBSCRIPTION_SUCCESS,
  ROUTES.FISKIL_CALLBACK,
])

// ── State the guard needs ────────────────────────────────────────────
export interface RoutingState {
  /** true while auth/profile is still loading */
  loading: boolean
  /** Supabase session exists */
  sessionExists: boolean
  /** subscription_status from profile */
  subscriptionStatus: string | null
  /** profile.is_onboarded */
  onboardingCompleted: boolean
  /** profile.has_bank_connection */
  bankConnected: boolean
  /** User explicitly chose demo mode */
  demoChoice: boolean
}

// ── Guard ────────────────────────────────────────────────────────────
/**
 * Returns the path the user SHOULD be on, or `null` if they should stay.
 *
 * The caller must NOT call this while `state.loading` is true — show a
 * spinner instead and call once loading resolves.
 */
export function getNextRoute(
  state: RoutingState,
  currentPath: string,
): string | null {
  // ── 0) While loading, never redirect ──
  if (state.loading) return null

  // ── 1) Demo bypass — explicit demo choice goes straight to dashboard ──
  if (state.demoChoice) {
    if (currentPath.startsWith("/app")) return null // already in app
    return loopGuard(ROUTES.DASHBOARD, currentPath)
  }

  // ── 2) No session ──
  if (!state.sessionExists) {
    // Public routes are fine
    if (PUBLIC_ROUTES.has(currentPath)) return null
    // Blog post slugs (/blog/some-slug) are also public
    if (currentPath.startsWith("/blog/")) return null
    // Protected routes → sign in
    return loopGuard(ROUTES.SIGNIN, currentPath)
  }

  // ── 3) Session exists — all users have free access (first 500 users) ──
  // Transition pages manage their own next-step
  if (TRANSITION_ROUTES.has(currentPath)) return null

  // No subscription check needed - free access for early adopters

  // ── 4) Has access — check onboarding ──
  if (!state.onboardingCompleted) {
    return loopGuard(ROUTES.ONBOARDING, currentPath)
  }

  // Bank connection is optional - users can connect anytime from the settings page
  // No longer requires bank connection to proceed to dashboard

  // ── 5) Fully set up — should be in /app/* ──
  if (currentPath.startsWith("/app")) return null // already there

  // Only auto-redirect from pages that specifically trigger the "go to dashboard" flow:
  // the landing page (user is already set up) and onboarding (user just finished).
  // All other public marketing pages are freely browsable even when authenticated.
  if (currentPath === ROUTES.LANDING || currentPath === ROUTES.ONBOARDING) {
    return loopGuard(ROUTES.DASHBOARD, currentPath)
  }

  // Authenticated users can stay on public pages (blog, features, pricing, etc.)
  return null
}

// ── Loop prevention ──────────────────────────────────────────────────
function loopGuard(destination: string, currentPath: string): string | null {
  return destination === currentPath ? null : destination
}

// ── Helper to build state from auth context ──────────────────────────
export function buildRoutingState(opts: {
  loading: boolean
  user: { id: string } | null
  profile: {
    subscription_status?: string
    is_onboarded?: boolean
    has_bank_connection?: boolean
  } | null
  demoMode: boolean
}): RoutingState {
  return {
    loading: opts.loading,
    sessionExists: !!opts.user,
    subscriptionStatus: opts.profile?.subscription_status ?? null,
    onboardingCompleted: opts.profile?.is_onboarded ?? false,
    bankConnected: opts.profile?.has_bank_connection ?? false,
    demoChoice: opts.demoMode,
  }
}
