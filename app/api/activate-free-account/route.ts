import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"

// Maximum number of free accounts allowed
const FREE_ACCOUNT_LIMIT = 500

export async function POST(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: "Supabase not configured" },
        { status: 500 }
      )
    }

    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      )
    }

    // Use service role client to bypass RLS
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Check if user already has an active subscription
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("subscription_status")
      .eq("id", userId)
      .single()

    if (existingProfile?.subscription_status === "active" || existingProfile?.subscription_status === "trialing") {
      return NextResponse.json({
        success: true,
        message: "Account already active",
        subscription_status: existingProfile.subscription_status,
      })
    }

    // Count how many users have free access (active or trialing without stripe_customer_id)
    const { count, error: countError } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .in("subscription_status", ["active", "trialing"])
      .is("stripe_customer_id", null)

    if (countError) {
      console.error("Error counting free accounts:", countError)
      return NextResponse.json(
        { error: "Failed to check free account availability" },
        { status: 500 }
      )
    }

    const freeAccountCount = count ?? 0

    if (freeAccountCount >= FREE_ACCOUNT_LIMIT) {
      return NextResponse.json({
        success: false,
        message: "Free account limit reached",
        limitReached: true,
      })
    }

    // Activate free account
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        subscription_status: "active",
        subscription_plan: "free_early_adopter",
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)

    if (updateError) {
      console.error("Error activating free account:", updateError)
      return NextResponse.json(
        { error: "Failed to activate free account" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Free account activated",
      subscription_status: "active",
      subscription_plan: "free_early_adopter",
      freeAccountsRemaining: FREE_ACCOUNT_LIMIT - freeAccountCount - 1,
    })
  } catch (error) {
    console.error("Error in activate-free-account:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
