# MyAiBank Auth - Quick Reference Guide

**One-page quick reference for the new Google-only auth system.**

---

## 🎯 Auth Flow at a Glance

```
Landing Page (/)
    ↓
[Get Started] OR [Sign In]
    ↓
Google OAuth Sign Up/In Page
    ↓
Google OAuth Popup/Redirect
    ↓
/auth/callback (process OAuth)
    ↓
Auto-onboarded, redirect to /
    ↓
Home Router (checks auth state)
    ↓
/app/dashboard
```

---

## 🔑 Key Points

| Feature | Status | Notes |
|---------|--------|-------|
| **Google OAuth** | ✅ Only method | Signup & signin use same flow |
| **Email/Password** | ❌ Removed | All code deleted |
| **Email Verification** | ❌ Removed | Auto-onboarded on OAuth |
| **Bank Connection** | ✅ Optional | Can connect anytime from profile |
| **Profile Settings** | ✅ Always accessible | "Connect Bank" button always visible |
| **Session Persistence** | ✅ Works | Survives page refresh |
| **Demo Mode** | ✅ Still works | Separate from auth |

---

## 🚀 User Journeys

### New User
1. Click "Get Started"
2. Click "Sign Up with Google"  
3. Login with Google
4. Automatically goes to dashboard
5. Can connect bank from Profile anytime

### Returning User
1. Click "Sign In"
2. Click "Sign In with Google"
3. Login with Google
4. Goes directly to dashboard
5. Data from previous session preserved

### Connect Bank (New User)
- On Onboarding: Click "Connect Bank Account" OR "Connect bank later"
- From Profile: Click "Connect Bank Account" button (always there)

---

## 📝 Changed Files

| File | What Changed | Why |
|------|-------------|-----|
| `app/login/page.tsx` | Removed email form | Google only |
| `app/signup/page.tsx` | Removed email form | Google only |
| `contexts/auth-context.tsx` | Removed signUp/signIn | Google only |
| `app/auth/callback/route.ts` | Auto-onboard users | Faster flow |
| `lib/routing.ts` | No bank requirement | Optional connection |
| `app/onboarding/page.tsx` | Bank optional | User choice |
| `app/app/profile/page.tsx` | Add connect button | Always accessible |
| `app/auth/sign-up-success/page.tsx` | **DELETED** | No email auth |

---

## 🔒 Security

✅ **Google OAuth**: Uses official Google identity  
✅ **No Passwords**: Nothing to compromise  
✅ **Secure Sessions**: Supabase handles httpOnly cookies  
✅ **Protected Routes**: Middleware enforces `/app/*` protection  
✅ **No Email Verification**: Trusted via Google  

---

## 🧪 Quick Testing (5 minutes)

**Test Signup:**
1. Go to `/signup`
2. Check terms → Click "Sign Up with Google"
3. Login with Google
4. Should land on dashboard

**Test Signin:**
1. Sign out from profile
2. Go to `/login`
3. Click "Sign In with Google"
4. Should land on dashboard

**Test Bank Button:**
1. Go to `/app/profile`
2. Find "Bank Connection" section
3. Click "Connect Bank Account"
4. Should start Fiskil flow

**Test Protected Route:**
1. Sign out completely
2. Try to access `/app/dashboard`
3. Should redirect to `/login`

---

## 📊 Component Responsibilities

```
AuthContext (contexts/auth-context.tsx)
└─ Manages: user, session, profile, loading
└─ Methods: signInWithGoogle(), signOut()

Login Page (app/login/page.tsx)
└─ Shows: Google OAuth button only
└─ Calls: signInWithGoogle()

Signup Page (app/signup/page.tsx)
└─ Shows: Google OAuth button + terms checkbox
└─ Calls: signInWithGoogle()

Auth Callback (app/auth/callback/route.ts)
└─ Processes: OAuth code exchange
└─ Sets: is_onboarded = true

Router (lib/routing.ts)
└─ Checks: auth state, onboarding status
└─ Redirects: to appropriate page

Profile (app/app/profile/page.tsx)
└─ Shows: Connect Bank button (always)
└─ Calls: Fiskil API when clicked

Middleware (lib/supabase/middleware.ts)
└─ Protects: /app/* routes
└─ Refreshes: sessions
```

---

## 🛠️ Common Operations

**Sign Up New User:**
```
1. User visits /signup
2. Checks terms checkbox
3. Clicks "Sign Up with Google"
4. Completes Google OAuth
5. Supabase creates account
6. Auto-onboarded
7. Redirects to /app/dashboard
```

**Sign In Returning User:**
```
1. User visits /login
2. Clicks "Sign In with Google"
3. Completes Google OAuth
4. Supabase finds existing account
5. Redirects to /app/dashboard
6. Session restored
```

**Connect Bank From Profile:**
```
1. User goes to /app/profile
2. Sees "Bank Connection" section
3. Clicks "Connect Bank Account"
4. Redirected to Fiskil auth URL
5. Completes bank auth
6. Returns to dashboard
7. has_bank_connection flag updated
```

**Sign Out:**
```
1. User clicks "Sign Out" in profile
2. signOut() called
3. Supabase session cleared
4. Redirects to /
5. Middleware protects /app/*
```

---

## ⚠️ Important Notes

**Email/Password Removed:**
- No way to sign in with email+password anymore
- Users must have Google account
- Old email accounts don't carry over

**Auto-Onboarded:**
- Users are marked as onboarded right after Google OAuth
- No email verification step
- Can skip bank connection to dashboard

**Bank Connection Optional:**
- Not required to use dashboard
- Can connect anytime from profile
- Can reconnect or add more accounts

**Profile Email:**
- Comes from Google account
- Read-only in app
- Change in Google settings if needed

---

## 🔍 Debugging Checklist

- [ ] Check Supabase Google OAuth is configured
- [ ] Check env vars are set correctly
- [ ] Check auth callback URL in Supabase
- [ ] Test with incognito/private browser (cache issues)
- [ ] Check browser console for errors
- [ ] Check Supabase dashboard for auth errors
- [ ] Verify middleware is running (session cookie set)
- [ ] Check Network tab for OAuth redirect flow

---

## 📞 Support

**Issue: Login page shows blank**
→ Check console for errors, verify Supabase setup

**Issue: Can't click Google button**
→ Check if JavaScript is enabled, check console

**Issue: Stuck on auth/callback**
→ Check Network tab, verify OAuth code was sent

**Issue: Always redirects to login**
→ Check session cookie exists, verify middleware runs

**Issue: Email form still showing**
→ Clear browser cache, hard refresh (Ctrl+Shift+R)

---

## ✅ Verification Checklist

After deployment, verify:

- [ ] `/login` shows only Google button
- [ ] `/signup` shows only Google button
- [ ] Both buttons work with real Google account
- [ ] New user lands on dashboard after OAuth
- [ ] Returning user lands on dashboard after OAuth
- [ ] Can access `/app/profile`
- [ ] "Connect Bank" button visible in profile
- [ ] Can click bank button and see Fiskil flow
- [ ] Signing out works and redirects to `/`
- [ ] Unauthenticated can't access `/app/*`
- [ ] Session persists on refresh
- [ ] No email/password form anywhere

---

## 🎓 Learning Resources

- `AUTH_ARCHITECTURE.md` - Deep technical dive
- `AUTH_TESTING_GUIDE.md` - Complete test cases
- `AUTH_AUDIT_FIXES_SUMMARY.md` - All changes documented
- `IMPLEMENTATION_SUMMARY.md` - Before/after comparison

---

## 📈 Metrics to Monitor

Post-deployment, track:

- **Signup Success Rate** - Should be high with no email verification
- **Login Success Rate** - Should match previous
- **Bank Connection Rate** - Expected to be lower (optional)
- **Error Rate** - Should stay same or decrease
- **Session Duration** - Should increase (no verification wait)
- **Device Coverage** - Google OAuth works on all platforms

---

## 🚨 Emergency Rollback

If critical issue found:

```bash
# Revert the 7 changed files
git revert [commit-hash]

# Or manually revert these files:
# - app/login/page.tsx
# - app/signup/page.tsx  
# - contexts/auth-context.tsx
# - app/auth/callback/route.ts
# - lib/routing.ts
# - app/onboarding/page.tsx
# - app/app/profile/page.tsx

# Restore deleted file:
# - app/auth/sign-up-success/page.tsx

# Deploy and test
```

---

## 📋 Pre-Launch Checklist

- [ ] All documentation reviewed
- [ ] Test cases run and passed
- [ ] Google OAuth tested end-to-end
- [ ] Session persistence verified
- [ ] Protected routes tested
- [ ] Mobile tested
- [ ] Error cases tested
- [ ] Performance acceptable
- [ ] No console errors
- [ ] Security review complete
- [ ] Stakeholders notified
- [ ] Deployment window scheduled

---

## 🎉 Launch Checklist

- [ ] Code deployed to production
- [ ] Monitor error logs for 1 hour
- [ ] Spot check: try signup
- [ ] Spot check: try signin
- [ ] Spot check: bank connection
- [ ] Monitor user feedback
- [ ] Performance metrics normal
- [ ] Declare launch complete

---

**Last Updated**: March 2026  
**Status**: ✅ Ready for Testing  
**Next Step**: Run AUTH_TESTING_GUIDE.md
