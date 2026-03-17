import { createClient as createSupabaseClient } from "@supabase/supabase-js"

/**
 * Anonymous Supabase client for use in server components that perform
 * public, unauthenticated reads (e.g. blog posts).
 *
 * For authenticated operations (user data, RLS-protected tables) use the
 * cookie-aware client at lib/supabase/server.ts instead.
 */
export function createPublicClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return null
  }

  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}
