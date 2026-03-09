import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const error = searchParams.get("error")
  const errorDescription = searchParams.get("error_description")

  // Handle OAuth errors from provider
  if (error) {
    console.error("[v0] OAuth error:", error, errorDescription)
    return NextResponse.redirect(`${origin}/auth/error?error=${encodeURIComponent(error)}`)
  }

  if (code) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("[v0] Missing Supabase env vars in callback")
      return NextResponse.redirect(`${origin}/auth/error?error=configuration`)
    }

    const cookieStore = await cookies()

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Ignore - middleware handles session refresh
          }
        },
      },
    })

    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (!exchangeError && data.user) {
      // Auto-activate free account for the user (first 500 users get free access)
      try {
        await fetch(`${origin}/api/activate-free-account`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: data.user.id }),
        })
      } catch (activateError) {
        console.error("[v0] Error activating free account:", activateError)
        // Continue anyway - the user can still access the app
      }

      // Mark user as onboarded on first Google OAuth (no email verification needed)
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

      // Redirect to home which will route based on auth state
      return NextResponse.redirect(`${origin}/`)
    }

    if (exchangeError) {
      console.error("[v0] Code exchange error:", exchangeError.message)
    }
  }

  // Return to error page on failure
  return NextResponse.redirect(`${origin}/auth/error`)
}
