import { createBrowserClient, type SupabaseClient } from '@supabase/ssr'

let client: SupabaseClient | null = null

export function createClient(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    // During build/SSG, return a mock that won't be used
    // This prevents build failures when env vars aren't available
    if (typeof window === 'undefined') {
      return {} as SupabaseClient
    }
    throw new Error('Missing Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.')
  }

  if (!client) {
    client = createBrowserClient(supabaseUrl, supabaseAnonKey)
  }
  
  return client
}
