# MyAiBank Authentication Architecture

Technical documentation of the simplified, Google-only authentication system.

---

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Landing Page (/)                         │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ • Get Started (→ /signup)                               │   │
│  │ • Sign In (→ /login)                                    │   │
│  │ • Demo Mode (→ /app/dashboard in demo mode)             │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
        ┌─────────────────────┴──────────────────────┐
        ↓                                             ↓
  ┌──────────────┐                          ┌──────────────┐
  │ Signup Page  │                          │  Login Page  │
  │   /signup    │                          │   /login     │
  └──────────────┘                          └──────────────┘
        ↓                                             ↓
  ┌──────────────────────────────────────────────────────────┐
  │  Google OAuth Button (Click → Google OAuth Flow)         │
  └──────────────────────────────────────────────────────────┘
        ↓
  ┌──────────────────────────────────────────────────────────┐
  │  User logs in with Google                                │
  │  Google redirects back to /auth/callback with code       │
  └──────────────────────────────────────────────────────────┘
        ↓
  ┌──────────────────────────────────────────────────────────┐
  │  Auth Callback (/auth/callback)                          │
  │  • Exchange code for session                             │
  │  • Auto-activate free account                            │
  │  • Mark is_onboarded = true                              │
  │  • Redirect to home (/)                                  │
  └──────────────────────────────────────────────────────────┘
        ↓
  ┌──────────────────────────────────────────────────────────┐
  │  Home Router (/) - getNextRoute()                        │
  │  • Check: Authenticated?                                 │
  │  • Check: Onboarded?                                     │
  │  • Route: → /app/dashboard                               │
  └──────────────────────────────────────────────────────────┘
        ↓
  ┌──────────────────────────────────────────────────────────┐
  │  Dashboard (/app/dashboard)                              │
  │  • Show account overview                                 │
  │  • Show transactions                                     │
  │  • Link to Profile, other features                       │
  └──────────────────────────────────────────────────────────┘
```

---

## Core Components

### 1. Auth Context (`contexts/auth-context.tsx`)

**Responsible for:**
- Managing user session state
- Exposing `signInWithGoogle()` method
- Exposing `signOut()` method
- Profile data management
- Session persistence on page load

**Public Methods:**
```typescript
interface AuthContextType {
  user: User | null              // Supabase User object
  session: Session | null        // Supabase Session object
  profile: Profile | null        // User profile from DB
  loading: boolean               // Auth state loading

  signInWithGoogle(): Promise<{ error: Error | null }>
  signOut(): Promise<void>
  updateProfile(updates: Partial<Profile>): Promise<{ error: Error | null }>
  refreshProfile(): Promise<void>
}
```

**Flow:**
1. AuthProvider initializes on app load
2. Checks for existing Supabase session
3. Fetches user profile from `profiles` table
4. Listens for auth state changes via `onAuthStateChange()`
5. Updates context when auth state changes

---

### 2. Login Page (`app/login/page.tsx`)

**Responsibility:** Sign in existing users with Google

**Features:**
- Single "Sign In with Google" button
- Back button to home
- Error state handling
- Loading state during OAuth

**Flow:**
1. User clicks "Sign In with Google"
2. `signInWithGoogle()` redirects to Google OAuth
3. Google redirects to Supabase OAuth handler
4. Supabase redirects to `/auth/callback`

---

### 3. Signup Page (`app/signup/page.tsx`)

**Responsibility:** Create new user accounts with Google

**Features:**
- Single "Sign Up with Google" button
- Requires terms/privacy agreement
- Prevents signup without agreement
- Error state handling
- Loading state during OAuth

**Flow:**
1. User checks terms/privacy checkboxes
2. User clicks "Sign Up with Google"
3. `signInWithGoogle()` redirects to Google OAuth
4. Supabase creates new user if doesn't exist
5. Redirects to `/auth/callback`

**Key Difference:** Uses same `signInWithGoogle()` method as login - handles both new user creation and existing user signin

---

### 4. Auth Callback (`app/auth/callback/route.ts`)

**Responsibility:** Handle OAuth redirect and session setup

**Flow:**
1. Receives OAuth code from Google redirect
2. Calls `supabase.auth.exchangeCodeForSession(code)`
3. If successful:
   - Calls `/api/activate-free-account` (optional)
   - Marks user as onboarded: `is_onboarded = true`
   - Redirects to home page `/`
4. If error:
   - Redirects to error page with error code

**Important:** Auto-marks new users as onboarded to skip email verification

---

### 5. Router Logic (`lib/routing.ts`)

**Responsibility:** Central routing decision-making

**Key Function:** `getNextRoute(state, currentPath): string | null`

**Decision Tree:**
```
1. While loading? → Stay (null)
2. Demo mode? → Dashboard, skip checks
3. No session? → Login if on protected route
4. Not onboarded? → Onboarding
5. On /app/*? → Stay (null)
6. Otherwise → Dashboard
```

**Routes:**
- `PUBLIC_ROUTES`: Don't require session
  - `/` (landing)
  - `/login`
  - `/signup`
  - `/auth/callback`
  - `/auth/error`
  - `/what-we-do`

- `PROTECTED_ROUTES`: Always require session
  - `/app/*`

- `TRANSITION_ROUTES`: Handle their own routing
  - `/fiskil/callback` (bank connection)

---

### 6. Middleware (`lib/supabase/middleware.ts`)

**Responsibility:** Server-side session refresh and route protection

**Features:**
- Refreshes Supabase session on each request
- Redirects to `/login` if accessing `/app/*` without session
- Redirects logged-in users from `/login` or `/signup` to `/dashboard`
- Handles demo mode cookie detection

**Flow:**
1. Every request passes through middleware
2. Check for valid session
3. Refresh session if needed
4. Apply routing rules
5. Continue or redirect

---

### 7. Onboarding Page (`app/onboarding/page.tsx`)

**Responsibility:** Optional bank connection setup

**Features:**
- Promote bank connection benefits
- "Connect Bank Account" button initiates Fiskil flow
- "Connect bank later" button skips to dashboard
- Shows success screen after bank connects
- Bank connection is completely optional

**Flow:**
1. New user lands here after OAuth (if not already marked onboarded)
2. User can:
   - Click "Connect Bank" → Redirected to Fiskil
   - Click "Connect bank later" → Redirected to dashboard
3. Bank connection details handled by Fiskil/callback flow

---

### 8. Profile Page (`app/app/profile/page.tsx`)

**Responsibility:** User settings and account management

**Features:**
- Edit first name, last name, region
- View email (read-only)
- Permanent "Connect Bank Account" button
- Always-visible bank connection status
- Sign Out button

**Bank Connection Button:**
- Visible whether user has connected a bank or not
- Clicking initiates same Fiskil flow as onboarding
- Allows reconnecting or adding additional banks
- Shows loading and error states

---

## Data Models

### User Profile (Supabase `profiles` table)

```typescript
interface Profile {
  id: string                      // UUID, primary key
  email: string | null            // Email from Supabase Auth
  first_name: string | null       // User-set first name
  last_name: string | null        // User-set last name
  username: string | null         // Optional username
  region: string                  // User's region
  is_onboarded: boolean           // Onboarding completion flag
  has_bank_connection: boolean    // Bank connection status
  fiskil_user_id: string | null   // Fiskil service account ID
  subscription_status: string     // Free, pro, etc.
  subscription_plan: string | null // Specific plan details
  stripe_customer_id: string | null // Stripe integration
  created_at: string              // Created timestamp
  updated_at: string              // Last updated timestamp
}
```

---

## Authentication Flow (Detailed)

### New User Signup
```
1. User lands on /
2. Clicks "Get Started" → /signup
3. Checks terms/privacy
4. Clicks "Sign Up with Google"
5. Redirected to Google OAuth consent screen
6. User logs in with Google account
7. Google redirects to Supabase: /auth/callback?code=XXX
8. Callback exchanges code for Supabase session
9. Callback auto-marks is_onboarded = true
10. Redirects to /
11. Router sees: authenticated + onboarded
12. Redirects to /app/dashboard
13. User sees dashboard, fully onboarded
14. Can connect bank anytime from profile
```

### Returning User Signin
```
1. User lands on /
2. Clicks "Sign In" → /login
3. Clicks "Sign In with Google"
4. Redirected to Google OAuth consent screen
5. Google recognizes existing account, logs in instantly
6. Google redirects to Supabase: /auth/callback?code=XXX
7. Callback exchanges code for session
8. Redirects to /
9. Router sees: authenticated + onboarded (from previous signup)
10. Redirects to /app/dashboard
11. User sees dashboard with all previous data
```

### Session Persistence
```
1. Middleware runs on each request
2. Checks for existing Supabase session cookie
3. If valid, refreshes token if needed
4. AuthProvider on client checks getSession()
5. Fetches profile from database
6. User stays logged in across page refreshes
7. On logout: Supabase session cleared, redirects to /
```

---

## Security Measures

✅ **OAuth Only:** No passwords stored in app  
✅ **Supabase Session:** Cryptographically signed, httpOnly cookies  
✅ **Middleware Protection:** Server-side route protection  
✅ **Row Level Security:** Profiles table protected by RLS (if configured)  
✅ **No Email Verification:** Skipped for better UX, trusted via Google  
✅ **CSRF Protection:** Handled by Supabase + Next.js  

---

## API Endpoints Used

### Supabase Auth Methods
- `signInWithOAuth()` - Initiates Google OAuth
- `exchangeCodeForSession()` - Processes OAuth callback
- `signOut()` - Clears session
- `getSession()` - Retrieves current session
- `onAuthStateChange()` - Listens for auth changes

### App API Routes
- `POST /api/activate-free-account` - Activates free tier subscription
- `POST /api/create-consent-session` - Initiates Fiskil bank connection
- `GET /api/fiskil-data` - Fetches connected bank data
- `POST /api/mark-bank-connected` - Updates bank connection status

### External Services
- **Supabase**: Auth, database, RLS
- **Google OAuth**: User authentication
- **Fiskil**: Bank account connection
- **Stripe**: Subscription management (optional)

---

## State Management

### Global Auth State (Context)
- Managed by `AuthProvider` wrapper
- Singleton per app instance
- Persists until logout

### Session State (Supabase)
- Managed by Supabase client
- Stored in httpOnly cookie
- Auto-refreshed by middleware

### Local Component State
- UI states: loading, error
- Form inputs: name, region, etc.
- Modal/dialog states

---

## Error Handling

### OAuth Errors
- OAuth error from Google → `/auth/error?error=XXX`
- Error page displays helpful message
- User can retry from error page

### Session Errors
- Invalid/expired code → `/auth/error`
- Network failure → Retry logic in auth context
- Supabase unavailable → Loading timeout safety net

### Route Protection
- Unauthorized access to `/app/*` → Redirect to `/login`
- User tries `/login` while logged in → Redirect to `/dashboard`

---

## Performance Considerations

1. **Auth Context Initialization**: ~5 second timeout to prevent hung screens
2. **Session Refresh**: Automatic in middleware, not blocking UI
3. **Profile Fetch**: Lazy-loaded only when user authenticated
4. **OAuth Redirect**: External, doesn't block other app features
5. **Route Checks**: Lightweight routing logic, no database calls

---

## Future Enhancements

Possible additions while maintaining Google-only auth:

1. **Multi-factor Authentication (MFA)** via Supabase
2. **Social linking** for non-Gmail Google Workspace accounts
3. **Profile picture** from Google account
4. **Device management** - see active sessions
5. **Login activity history** - security audits
6. **Two-factor authentication** via authenticator apps
7. **Account deletion** - GDPR compliance

---

## Code Quality

✅ No async/await without error handling  
✅ Loading states for all async operations  
✅ Proper TypeScript typing throughout  
✅ Consistent error messages for users  
✅ Proper cleanup in useEffect hooks  
✅ No memory leaks from subscriptions  
✅ Router guards prevent infinite loops  

---

## Testing Strategy

1. **Unit Tests**: Auth context methods
2. **Integration Tests**: Auth flow end-to-end
3. **E2E Tests**: Full signup, signin, logout
4. **Security Tests**: Protected routes, session expiry
5. **Performance Tests**: Auth initialization time

See `AUTH_TESTING_GUIDE.md` for detailed test cases.
