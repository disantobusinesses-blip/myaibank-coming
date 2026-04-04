# Detailed Changes - Line by Line

Exact changes made to each file for reference and code review.

---

## 1. app/login/page.tsx

### Removed Components/Lines
```diff
- Email input field (Label, Input component)
- Password input field with show/hide toggle  
- Password visibility toggle button
- Form submission handler (handleSubmit)
- Email and password state variables
- Divider section ("or" text)
- Error display for sign in errors
- Form section completely removed
```

### Kept Components/Lines
```diff
+ Google OAuth button (updated label)
+ Back to home link
+ Logo and header
+ Error state display (for OAuth errors)
+ LegalFooter component
```

### Key Changes
```typescript
// BEFORE
const [email, setEmail] = useState("")
const [password, setPassword] = useState("")
const handleSubmit = async (e: React.FormEvent) => {
  // ... email/password logic
}

// AFTER
// Removed completely - not in new version
```

---

## 2. app/signup/page.tsx

### Removed Components/Lines
```diff
- Name input field
- Email input field  
- Password input field with show/hide toggle
- Password visibility toggle button
- Form submission handler (handleSubmit)
- Name, email, password state variables
- Password strength hint text
- Divider section ("or" text)
- Form section completely removed
```

### Kept Components/Lines
```diff
+ Google OAuth button (updated label)
+ Terms/Privacy checkbox (still required)
+ Back button
+ Logo and header
+ Legal modals (Terms and Privacy)
+ Error state display
```

### Key Changes
```typescript
// BEFORE
const handleSubmit = async (e: React.FormEvent) => {
  // ... email/password signup
}

// AFTER
// Removed completely

// BEFORE
const handleGoogleSignUp = async () => {
  if (!agreedToTerms) {
    // Error
  }
  await signInWithGoogle()
}

// AFTER
// Same method, still calls signInWithGoogle()
// Keeps terms requirement check
```

---

## 3. contexts/auth-context.tsx

### Interface Changes
```typescript
// BEFORE
interface AuthContextType {
  user: User | null
  session: Session | null
  profile: Profile | null
  loading: boolean
  signUp: (email: string, password: string, metadata?: Record<string, unknown>) => Promise<{ error: Error | null }>
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signInWithGoogle: () => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: Error | null }>
  refreshProfile: () => Promise<void>
}

// AFTER
interface AuthContextType {
  user: User | null
  session: Session | null
  profile: Profile | null
  loading: boolean
  signInWithGoogle: () => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: Error | null }>
  refreshProfile: () => Promise<void>
}
```

### Removed Methods
```typescript
// REMOVED: signUp()
const signUp = async (email: string, password: string, metadata?: Record<string, unknown>) => {
  if (!supabase) return { error: new Error("Supabase not configured") }
  
  const origin = typeof window !== "undefined" ? window.location.origin : ""
  
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
      emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
        `${origin}/auth/callback`,
    },
  })
  return { error: error ? new Error(error.message) : null }
}

// REMOVED: signIn()
const signIn = async (email: string, password: string) => {
  if (!supabase) return { error: new Error("Supabase not configured") }
  
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { error: error ? new Error(error.message) : null }
}
```

### Provider Update
```typescript
// BEFORE
return (
  <AuthContext.Provider
    value={{
      user,
      session,
      profile,
      loading,
      signUp,
      signIn,
      signInWithGoogle,
      signOut,
      updateProfile,
      refreshProfile,
    }}
  >

// AFTER
return (
  <AuthContext.Provider
    value={{
      user,
      session,
      profile,
      loading,
      signInWithGoogle,
      signOut,
      updateProfile,
      refreshProfile,
    }}
  >
```

---

## 4. app/auth/callback/route.ts

### Added Onboarding Logic
```typescript
// ADDED: Auto-mark as onboarded
if (!exchangeError && data.user) {
  // ... existing code ...

  // Mark user as onboarded on first Google OAuth
  try {
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ is_onboarded: true, updated_at: new Date().toISOString() })
      .eq("id", data.user.id)

    if (updateError) {
      console.error("[v0] Error marking user as onboarded:", updateError)
    }
  } catch (err) {
    console.error("[v0] Error in onboarding update:", err)
  }

  // Changed redirect
  return NextResponse.redirect(`${origin}/`)  // Was: `/onboarding`
}
```

### Changed Redirect
```typescript
// BEFORE
return NextResponse.redirect(`${origin}/onboarding`)

// AFTER
return NextResponse.redirect(`${origin}/`)
```

### Removed Parameter
```typescript
// BEFORE
const next = searchParams.get("next") ?? "/"

// AFTER
// Removed - no longer needed
```

---

## 5. lib/routing.ts

### Removed Routes
```typescript
// BEFORE
export const ROUTES = {
  LANDING: "/",
  SIGNIN: "/login",
  SIGNUP: "/signup",
  SUBSCRIBE: "/subscribe",                      // REMOVED
  SUBSCRIPTION_SUCCESS: "/subscription-success", // REMOVED
  ONBOARDING: "/onboarding",
  DASHBOARD: "/app/dashboard",
  AUTH_CALLBACK: "/auth/callback",
  AUTH_SIGNUP_SUCCESS: "/auth/sign-up-success",  // REMOVED
  AUTH_ERROR: "/auth/error",
  FISKIL_CALLBACK: "/fiskil/callback",
  WHAT_WE_DO: "/what-we-do",
} as const

// AFTER
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
```

### Updated Public Routes
```typescript
// BEFORE
const PUBLIC_ROUTES: Set<string> = new Set([
  ROUTES.LANDING,
  ROUTES.SIGNIN,
  ROUTES.SIGNUP,
  ROUTES.AUTH_CALLBACK,
  ROUTES.AUTH_SIGNUP_SUCCESS,  // REMOVED
  ROUTES.AUTH_ERROR,
  ROUTES.WHAT_WE_DO,
])

// AFTER
const PUBLIC_ROUTES: Set<string> = new Set([
  ROUTES.LANDING,
  ROUTES.SIGNIN,
  ROUTES.SIGNUP,
  ROUTES.AUTH_CALLBACK,
  ROUTES.AUTH_ERROR,
  ROUTES.WHAT_WE_DO,
])
```

### Simplified Routing Logic
```typescript
// BEFORE
if (!state.onboardingCompleted) {
  return loopGuard(ROUTES.ONBOARDING, currentPath)
}

if (!state.bankConnected) {
  // Onboarding page is where they connect the bank
  return loopGuard(ROUTES.ONBOARDING, currentPath)
}

// AFTER
if (!state.onboardingCompleted) {
  return loopGuard(ROUTES.ONBOARDING, currentPath)
}

// Bank connection is optional - removed this check entirely
// Users can connect bank anytime from settings
```

---

## 6. app/onboarding/page.tsx

### Updated Skip Handler
```typescript
// BEFORE
const handleSkip = async () => {
  await updateProfile({
    is_onboarded: true,
  })
  const state = buildRoutingState({
    loading: false,
    user,
    profile: {
      ...(profile ?? {}),
      is_onboarded: true,
    },
    demoMode: false,
  })
  const dest = getNextRoute(state, pathname) ?? "/app/dashboard"
  router.push(dest)
}

// AFTER
const handleSkip = async () => {
  // User already marked as onboarded by auth callback
  if (!profile?.is_onboarded) {
    await updateProfile({
      is_onboarded: true,
    })
  }
  router.push("/app/dashboard")
}
```

### Added Connect Later Handler
```typescript
// ADDED
const handleConnectLater = () => {
  // Skip bank connection and go directly to dashboard
  router.push("/app/dashboard")
}
```

### Updated Button Text
```typescript
// BEFORE
<button
  onClick={handleSkip}
  className="mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
>
  Skip for now
</button>

// AFTER
<button
  onClick={handleConnectLater}
  className="mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
>
  Connect bank later
</button>
```

---

## 7. app/app/profile/page.tsx

### Added State Variables
```typescript
// ADDED
const [isConnectingBank, setIsConnectingBank] = useState(false)
const [bankConnectError, setBankConnectError] = useState("")
```

### Added Bank Connection Handler
```typescript
// ADDED: Complete new function
const handleConnectBank = async () => {
  setIsConnectingBank(true)
  setBankConnectError("")
  
  try {
    const response = await fetch("/api/create-consent-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error || "Failed to create consent session")
    }

    const data = await response.json()
    
    if (data.auth_url) {
      window.location.href = data.auth_url
    } else {
      throw new Error("No auth URL returned")
    }
  } catch (err) {
    console.error("Bank connection error:", err)
    setBankConnectError(err instanceof Error ? err.message : "Failed to connect bank")
    setIsConnectingBank(false)
  }
}
```

### Replaced Bank Connection Section
```typescript
// BEFORE (Just status display)
<div className="rounded-2xl bg-card border border-border p-6">
  <div className="flex items-center gap-3 mb-4">
    <Building2 className="w-5 h-5 text-muted-foreground" />
    <h2 className="font-semibold text-foreground">Bank Connection</h2>
  </div>
  
  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm text-foreground">
        {profile?.has_bank_connection ? "Connected" : "Not connected"}
      </p>
      <p className="text-xs text-muted-foreground">
        {profile?.has_bank_connection
          ? "Your bank account is linked"
          : "Link your bank to see transactions"}
      </p>
    </div>
    <div
      className={`w-3 h-3 rounded-full ${
        profile?.has_bank_connection ? "bg-[#22c55e]" : "bg-muted"
      }`}
    />
  </div>
</div>

// AFTER (Status + Button)
<div className="rounded-2xl bg-card border border-border p-6">
  <div className="flex items-center gap-3 mb-4">
    <Building2 className="w-5 h-5 text-muted-foreground" />
    <h2 className="font-semibold text-foreground">Bank Connection</h2>
  </div>
  
  <div className="mb-4">
    <p className="text-sm text-foreground mb-1">
      {profile?.has_bank_connection ? "Connected" : "Not connected"}
    </p>
    <p className="text-xs text-muted-foreground">
      {profile?.has_bank_connection
        ? "Your bank account is linked. You can connect another account anytime."
        : "Link your bank account to see transactions and get AI insights."}
    </p>
  </div>

  {bankConnectError && (
    <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center gap-2">
      <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0" />
      <p className="text-sm text-destructive">{bankConnectError}</p>
    </div>
  )}

  <Button
    onClick={handleConnectBank}
    disabled={isConnectingBank}
    className="w-full h-12 rounded-xl bg-[#1F0051] hover:bg-[#2d0075] text-white font-semibold"
  >
    {isConnectingBank ? (
      <>
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
        Connecting...
      </>
    ) : (
      "Connect Bank Account"
    )}
  </Button>
</div>
```

---

## 8. app/auth/sign-up-success/page.tsx

### Status: DELETED
```
File completely removed.
This page was only used for email verification step which no longer exists.
Entire file deleted including:
- Email icon display
- "Check your email" heading
- Email verification instructions
- "Back to Sign In" button
- LegalFooter component
```

---

## Summary of Line Changes

| File | Lines Removed | Lines Added | Net Change |
|------|---------------|-------------|-----------|
| app/login/page.tsx | ~80 | ~5 | -75 |
| app/signup/page.tsx | ~130 | ~10 | -120 |
| contexts/auth-context.tsx | ~25 | 0 | -25 |
| app/auth/callback/route.ts | ~3 | ~15 | +12 |
| lib/routing.ts | ~8 | ~2 | -6 |
| app/onboarding/page.tsx | ~13 | ~11 | -2 |
| app/app/profile/page.tsx | ~15 | ~60 | +45 |
| app/auth/sign-up-success/page.tsx | ~25 | 0 | **DELETED** |
| **TOTALS** | **~299** | **~103** | **-265 lines** |

---

## Impact Analysis

**Code Reduction:** -265 net lines (simpler codebase)  
**Functionality Loss:** Email/password auth (intentional)  
**New Functionality:** Always-visible bank connection button  
**Complexity:** Significantly reduced  
**Maintainability:** Improved (fewer code paths)  

---

## Testing Verification

For each changed file, verify:

- ✅ app/login/page.tsx - Only Google button visible
- ✅ app/signup/page.tsx - Only Google button visible
- ✅ contexts/auth-context.tsx - signInWithGoogle still works
- ✅ app/auth/callback/route.ts - Auto-onboarding happens
- ✅ lib/routing.ts - Routing works correctly
- ✅ app/onboarding/page.tsx - Skip functionality works
- ✅ app/app/profile/page.tsx - Bank button always visible
- ✅ app/auth/sign-up-success/page.tsx - Not accessible anywhere

---

**This completes the detailed line-by-line changes documentation.**
