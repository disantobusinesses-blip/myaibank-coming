import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// Required ENV:
// - FISKIL_BASE_URL (default https://api.fiskil.com)
// - FISKIL_CLIENT_ID
// - FISKIL_CLIENT_SECRET
// - NEXT_PUBLIC_APP_URL

const FISKIL_BASE_URL = process.env.FISKIL_BASE_URL || "https://api.fiskil.com"
const FISKIL_CLIENT_ID = process.env.FISKIL_CLIENT_ID
const FISKIL_CLIENT_SECRET = process.env.FISKIL_CLIENT_SECRET

async function getFiskilAccessToken(): Promise<string> {
  const response = await fetch(`${FISKIL_BASE_URL}/v1/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      Accept: "application/json; charset=UTF-8",
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

async function createFiskilEndUser(accessToken: string, userId: string): Promise<string> {
  const response = await fetch(`${FISKIL_BASE_URL}/v1/end-users`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json; charset=UTF-8",
      Accept: "application/json; charset=UTF-8",
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

async function createFiskilAuthSession(
  accessToken: string,
  endUserId: string,
  redirectUri: string,
  cancelUri: string
): Promise<{ authSessionId: string; authUrl?: string }> {
  const response = await fetch(`${FISKIL_BASE_URL}/v1/auth/session`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json; charset=UTF-8",
      Accept: "application/json; charset=UTF-8",
    },
    body: JSON.stringify({
      end_user_id: endUserId,
      redirect_uri: redirectUri,
      cancel_uri: cancelUri,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to create auth session: ${error}`)
  }

  const data = await response.json()
  return {
    authSessionId: data.id || data.auth_session_id,
    authUrl: data.auth_url,
  }
}

export async function POST(_request: NextRequest) {
  try {
    if (!FISKIL_CLIENT_ID || !FISKIL_CLIENT_SECRET) {
      return NextResponse.json({ error: "Fiskil not configured" }, { status: 500 })
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const redirectUri = `${appUrl}/fiskil/callback`
    const cancelUri = `${appUrl}/onboarding`

    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = user.id

    // 1) Token
    const accessToken = await getFiskilAccessToken()

    // 2) Reuse existing end_user_id if we already have it, otherwise create it
    const { data: profileRow } = await supabase
      .from("profiles")
      .select("fiskil_user_id")
      .eq("id", userId)
      .single()

    let endUserId: string | null = profileRow?.fiskil_user_id ?? null

    if (!endUserId) {
      endUserId = await createFiskilEndUser(accessToken, userId)

      await supabase
        .from("profiles")
        .update({ fiskil_user_id: endUserId })
        .eq("id", userId)
    }

    // 3) Create auth session WITH end_user_id (this fixes your error)
    const { authSessionId, authUrl } = await createFiskilAuthSession(
      accessToken,
      endUserId,
      redirectUri,
      cancelUri
    )

    return NextResponse.json({
      auth_session_id: authSessionId,
      auth_url: authUrl, // should be like https://auth.fiskil.com/?sess_id=...
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
