import { NextRequest, NextResponse } from "next/server"

// ENV VARS needed:
// - FISKIL_BASE_URL
// - FISKIL_CLIENT_ID
// - FISKIL_CLIENT_SECRET
// - SUPABASE_URL
// - SUPABASE_SERVICE_ROLE_KEY

export async function GET(request: NextRequest) {
  try {
    // Get authorization header
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // In production, this would:
    // 1. Verify the token
    // 2. Get user's fiskil_user_id from profiles
    // 3. Fetch accounts and transactions from Fiskil API
    // 4. Return the data

    // Return a clear error when Fiskil is not yet configured —
    // never inject fabricated financial data.
    const fiskilConfigured =
      process.env.FISKIL_BASE_URL &&
      process.env.FISKIL_CLIENT_ID &&
      process.env.FISKIL_CLIENT_SECRET

    if (!fiskilConfigured) {
      return NextResponse.json(
        {
          error: "Fiskil integration not configured",
          message:
            "Set FISKIL_BASE_URL, FISKIL_CLIENT_ID and FISKIL_CLIENT_SECRET environment variables to enable bank data.",
        },
        { status: 503 }
      )
    }

    // Placeholder for real Fiskil API call — the actual implementation
    // lives in the /fiskil-data/inject route which writes to Supabase.
    return NextResponse.json(
      {
        error: "Not implemented",
        message:
          "Use the Fiskil consent flow to connect a bank.  Data is written directly to Supabase via the inject route.",
      },
      { status: 501 }
    )
  } catch (error) {
    console.error("Error in fiskil-data route:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
