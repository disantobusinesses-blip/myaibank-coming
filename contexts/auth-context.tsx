"use client"

import { createContext, useContext, useEffect, useState, useCallback, useMemo, type ReactNode } from "react"
import { createBrowserClient } from "@supabase/ssr"
import type { User, Session, SupabaseClient } from "@supabase/supabase-js"

export interface Profile {
  id: string
  email: string | null
  first_name: string | null
  last_name: string | null
  username: string | null
  region: string
  is_onboarded: boolean
  has_bank_connection: boolean
  fiskil_user_id: string | null
  subscription_status: string
  subscription_plan: string | null
  stripe_customer_id: string | null
  created_at: string
  updated_at: string
}

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

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Check if Supabase is configured
function getSupabaseClient(): SupabaseClient | null {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseAnonKey) {
    return null
  }
  
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const supabase = useMemo(() => getSupabaseClient(), [])

  const fetchProfile = useCallback(async (userId: string) => {
    if (!supabase) return null
    
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single()

    if (error) {
      console.error("Error fetching profile:", error)
      return null
    }
    return data as Profile
  }, [supabase])

  const refreshProfile = useCallback(async () => {
    if (user) {
      const profileData = await fetchProfile(user.id)
      setProfile(profileData)
    }
  }, [user, fetchProfile])

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    const initAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession()
        
        if (currentSession?.user) {
          setSession(currentSession)
          setUser(currentSession.user)
          const profileData = await fetchProfile(currentSession.user.id)
          setProfile(profileData)
        }
      } catch (error) {
        console.error("Error initializing auth:", error)
      } finally {
        setLoading(false)
      }
    }

    initAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      setSession(newSession)
      setUser(newSession?.user ?? null)

      if (newSession?.user) {
        const profileData = await fetchProfile(newSession.user.id)
        setProfile(profileData)
      } else {
        setProfile(null)
      }

      if (event === "SIGNED_OUT") {
        setProfile(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, fetchProfile])

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

  const signIn = async (email: string, password: string) => {
    if (!supabase) return { error: new Error("Supabase not configured") }
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error: error ? new Error(error.message) : null }
  }

  const signInWithGoogle = async () => {
    if (!supabase) return { error: new Error("Supabase not configured") }
    
    const origin = typeof window !== "undefined" ? window.location.origin : ""
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback`,
      },
    })
    return { error: error ? new Error(error.message) : null }
  }

  const signOut = async () => {
    if (supabase) {
      await supabase.auth.signOut()
    }
    setUser(null)
    setSession(null)
    setProfile(null)
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!supabase) return { error: new Error("Supabase not configured") }
    if (!user) return { error: new Error("No user logged in") }

    const { error } = await supabase
      .from("profiles")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", user.id)

    if (!error) {
      setProfile(prev => prev ? { ...prev, ...updates } : null)
    }

    return { error: error ? new Error(error.message) : null }
  }

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
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
