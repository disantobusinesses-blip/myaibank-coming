import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// ENV VARS needed:
// - FISKIL_BASE_URL (https://api.fiskil.com)
// - FISKIL_CLIENT_ID
// - FISKIL_CLIENT_SECRET
// - NEXT_PUBLIC_APP_URL

const FISKIL_BASE_URL = process.env.FISKIL_BASE_URL || "https://api.fiskil.com"
const FISKIL_CLIENT_ID = process.env.FISKIL_CLIENT_ID
const FISKIL_CLIENT_SECRET = process.env.FISKIL_CLIENT_SECRET

// Get Fiskil access token using /v1/token endpoint
async function getFiskilAccessToken(): Promise<string> {
  const response = await fetch(`${FISKIL_BASE_URL}/v1/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      "Accept": "application/json; charset=UTF-8",
    },
    body: JSON.stringify({
      client_id: FISKIL_CLIENT_ID,
      client_secret: FISKIL_CLIENT_SECRET,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to get Fiskil token: ${error}`)
  }

  const data = await response.json()
  return data.token
}

// Create or get Fiskil end-user
async function createFiskilEndUser(accessToken: string, userId: string): Promise<string> {
  const response = await fetch(`${FISKIL_BASE_URL}/v1/end-users`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json; charset=UTF-8",
      "Accept": "application/json; charset=UTF-8",
    },
    body: JSON.stringify({
      external_id: userId,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to create end user: ${error}`)
  }

  const data = await response.json()
  return data.id
}

// Create Fiskil auth session using /v1/auth/session endpoint
async function createFiskilAuthSession(
  accessToken: string,
  endUserId: string,
  redirectUri: string
): Promise<{ authSessionId: string; authUrl?: string }> {
  const response = await fetch(`${FISKIL_BASE_URL}/v1/auth/session`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json; charset=UTF-8",
      "Accept": "application/json; charset=UTF-8",
    },
    body: JSON.stringify({
      end_user_id: endUserId,
      redirect_uri: redirectUri,
      cancel_uri: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/onboarding`,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to create auth session: ${error}`)
  }

  const data = await response.json()
  // Return auth_session_id for Link SDK, or auth_url for redirect flow
  return { 
    authSessionId: data.id || data.auth_session_id,
    authUrl: data.auth_url 
  }
}

export async function POST(request: NextRequest) {
  try {
    // Validate environment variables
    if (!FISKIL_CLIENT_ID || !FISKIL_CLIENT_SECRET) {
      console.error("Missing Fiskil credentials")
      return NextResponse.json(
        { error: "Fiskil not configured" },
        { status: 500 }
      )
    }

    // Get authenticated user from Supabase
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const userId = user.id
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/fiskil/callback`

    // Step 1: Get Fiskil access token
    const accessToken = await getFiskilAccessToken()

    // Step 2: Create Fiskil end-user
    const endUserId = await createFiskilEndUser(accessToken, userId)

    // Step 3: Store fiskil_user_id in profile
    await supabase
      .from("profiles")
      .update({ fiskil_user_id: endUserId })
      .eq("id", userId)

    // Step 4: Create auth session
    const { authSessionId, authUrl } = await createFiskilAuthSession(accessToken, endUserId, redirectUri)

    return NextResponse.json({
      auth_session_id: authSessionId,
      auth_url: authUrl,
      end_user_id: endUserId,
      redirect_uri: redirectUri,
    })
  } catch (error) {
    console.error("Error creating consent session:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}
