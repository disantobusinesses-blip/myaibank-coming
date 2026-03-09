# MyAiBank Authentication Testing Guide

Complete testing guide for the audited and fixed Google OAuth authentication flow.

---

## Pre-Testing Requirements

✅ Supabase project is connected  
✅ Google OAuth provider is configured in Supabase  
✅ Environment variables are set:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` (if needed)

---

## Test Cases

### 1. New User Signup Flow

**Test: Sign up with Google (New User)**
1. Navigate to `/signup`
2. Verify page shows only "Sign Up with Google" button
3. Verify no email/password fields are visible
4. Verify terms/privacy checkboxes are visible and required
5. Attempt to click signup button without checking terms → Should show error message
6. Check "I agree to Terms of Use and Privacy Policy"
7. Click "Sign Up with Google"
8. Complete Google OAuth in popup/redirect
9. Should redirect to auth callback → Then to home page → Then to dashboard
10. Verify user is logged in on dashboard
11. Verify profile is loaded correctly
12. Go to `/app/profile` → Verify user info is displayed

**Expected Result:** ✅ New user created, marked as onboarded, lands on dashboard

---

### 2. Returning User Signin Flow

**Test: Sign in with Google (Returning User)**
1. Sign out from dashboard (Profile → Sign Out)
2. Should redirect to home page
3. Click "I already have an account" → Goes to `/login`
4. Verify page shows only "Sign In with Google" button
5. Verify no email/password fields are visible
6. Click "Sign In with Google"
7. Complete Google OAuth in popup/redirect
8. Should redirect to auth callback → Then to home page → Then to dashboard
9. Verify same user is logged in
10. Verify profile data is preserved from previous session

**Expected Result:** ✅ Existing user signs in successfully, data persists

---

### 3. Home Page Routing Logic

**Test: Authenticated user accesses home page**
1. Log in with Google
2. Navigate to `/` (home page)
3. Should automatically redirect to `/app/dashboard`
4. Verify dashboard loads without errors

**Test: Unauthenticated user accesses home page**
1. Sign out completely
2. Navigate to `/`
3. Should show landing page with "Get Started" and "Sign In" buttons
4. Verify no app content is visible

**Expected Result:** ✅ Routing logic correctly handles auth state

---

### 4. Protected Routes

**Test: Unauthenticated access to protected routes**
1. Sign out completely
2. Try to access `/app/dashboard` directly
3. Should redirect to `/login`
4. Try to access `/app/profile` directly
5. Should redirect to `/login`
6. Try to access `/app/portfolio` directly
7. Should redirect to `/login`

**Expected Result:** ✅ All `/app/*` routes require authentication

---

### 5. Onboarding Flow

**Test: New user onboarding (Optional Bank Connection)**
1. Create new account with Google
2. Should go through onboarding page
3. Verify "Connect Bank Account" button is visible
4. Verify "Connect bank later" link is visible
5. Click "Connect bank later"
6. Should go to dashboard
7. Verify dashboard loads and user is fully logged in
8. Go to `/app/profile` → Verify "Connect Bank Account" button is still visible

**Test: Connect bank from onboarding**
1. Create new account with Google
2. On onboarding page, click "Connect Bank Account"
3. Should redirect to Fiskil auth URL
4. Complete bank connection (or cancel)
5. If successful: Should show success message, then redirect to dashboard

**Expected Result:** ✅ Bank connection is optional, always accessible from profile

---

### 6. Profile Settings - Bank Connection Button

**Test: Permanent Connect Bank Button (Without Bank Connected)**
1. Log in as user without bank connected
2. Navigate to `/app/profile`
3. Find "Bank Connection" section
4. Verify status shows "Not connected"
5. Verify "Connect Bank Account" button is visible and clickable
6. Click button
7. Should redirect to Fiskil auth (or show loading state)
8. Attempt connection (or cancel)

**Test: Permanent Connect Bank Button (With Bank Connected)**
1. Log in as user with bank already connected
2. Navigate to `/app/profile`
3. Find "Bank Connection" section
4. Verify status shows "Connected"
5. Verify "Connect Bank Account" button is still visible
6. Click button again
7. Should allow connecting another bank or reconnecting

**Expected Result:** ✅ Button always visible, works for both new and existing connections

---

### 7. Session Persistence

**Test: Session persists across page refresh**
1. Log in with Google
2. Navigate to `/app/dashboard`
3. Refresh page (Cmd+R or Ctrl+R)
4. Verify user is still logged in
5. Verify dashboard loads without re-authentication

**Test: Session persists across different pages**
1. Log in with Google
2. Navigate to `/app/dashboard`
3. Click to `/app/profile`
4. Click to `/app/transactions`
5. Verify user stays logged in across all pages
6. Go back to dashboard
7. Verify all data is still there

**Test: Session clears on logout**
1. Log in with Google
2. Navigate to profile
3. Click "Sign Out"
4. Should redirect to home page
5. Try to access `/app/dashboard`
6. Should redirect to login

**Expected Result:** ✅ Sessions persist correctly and clear on logout

---

### 8. Error Handling

**Test: OAuth error handling**
1. On login page, if you can trigger a Google OAuth error, verify:
   - Error message displays
   - User can retry
   - No infinite loops

**Test: Network error during signup/signin**
1. Try to simulate network error (browser dev tools)
2. Start Google OAuth
3. Verify error is handled gracefully
4. Verify user can retry

**Test: Auth callback errors**
1. Try to access `/auth/callback` with invalid code
2. Should redirect to `/auth/error`
3. Verify error page displays correctly
4. Verify "Back to Sign In" button works

**Expected Result:** ✅ All errors handled gracefully with user feedback

---

### 9. UI/UX Tests

**Test: Mobile responsiveness**
1. Test all auth pages on mobile (iPhone SE, etc.)
2. Verify buttons are properly sized and clickable
3. Verify text is readable
4. Verify no overflow issues
5. Test Google OAuth on mobile

**Test: Loading states**
1. During Google OAuth, verify loading indicator appears if needed
2. During bank connection, verify loading state is shown
3. Verify disabled state during loading

**Test: Copy/messaging clarity**
1. Verify all buttons say "with Google"
2. Verify onboarding flow messaging is clear
3. Verify profile section messaging explains bank connection options
4. Verify error messages are helpful

**Expected Result:** ✅ UI is clean, responsive, and user-friendly

---

### 10. Data Integrity

**Test: Profile data preservation**
1. Create account with Google, set name and region
2. Sign out and sign back in
3. Verify name and region are still there
4. Edit profile, save changes
5. Refresh page
6. Verify changes persisted

**Test: Bank connection data preservation**
1. Connect a bank account
2. Verify has_bank_connection flag updates
3. Sign out and sign back in
4. Verify bank connection status is still there
5. Profile button still shows connection status

**Expected Result:** ✅ All user data persists correctly

---

## Quick Test Checklist

Use this for rapid testing:

- [ ] New signup with Google works
- [ ] Returning login with Google works
- [ ] Auth callback processes correctly
- [ ] User redirects to dashboard after auth
- [ ] Unauthenticated users see landing page
- [ ] Protected routes redirect to login when not authenticated
- [ ] Onboarding page shows "Connect bank later" option
- [ ] Onboarding optional - users can skip to dashboard
- [ ] Profile page has permanent "Connect Bank" button
- [ ] Bank connection button works from profile
- [ ] Session persists on refresh
- [ ] Logout clears session
- [ ] Email/password fields don't exist anywhere
- [ ] Google OAuth is the only login method
- [ ] Profile data persists across sessions
- [ ] No console errors during auth flow

---

## Known Limitations

- Email/password authentication is completely removed
- Users must have a valid Google account to sign up/sign in
- Bank connection requires Fiskil to be configured
- Demo mode is separate from regular auth

---

## Debugging Tips

**Check session state:**
```javascript
// In browser console on logged-in page
// Session should be in localStorage under 'sb-*' keys
Object.keys(localStorage).filter(k => k.startsWith('sb-'))
```

**Check auth context:**
```javascript
// Add temporary console.log in auth-context.tsx
console.log("[auth] user:", user)
console.log("[auth] profile:", profile)
console.log("[auth] loading:", loading)
```

**Monitor OAuth flow:**
1. Open browser DevTools Network tab
2. Watch for redirect to Google OAuth
3. Watch for callback to `/auth/callback`
4. Check for any errors in Network or Console

**Test bank connection:**
- Use Fiskil's sandbox environment for testing
- Check `/fiskil/callback` in routing for bank connection callback

---

## Rollback Instructions

If critical issues occur:

1. Revert these files to previous versions:
   - `app/login/page.tsx`
   - `app/signup/page.tsx`
   - `contexts/auth-context.tsx`
   - `lib/routing.ts`

2. Restore deleted file:
   - `app/auth/sign-up-success/page.tsx`

3. Revert recent commits in git

---

## Support

For issues during testing:
1. Check browser console for error messages
2. Check Supabase logs for auth errors
3. Verify Google OAuth credentials are valid
4. Verify environment variables are set correctly
5. Check network requests in DevTools
