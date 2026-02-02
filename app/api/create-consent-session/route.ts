import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

const mustEnv = (name: string, value?: string) => {
  if (!value) throw new Error(`Missing env var: ${name}`)
  return value
}

const normalizeBase = (url: string) => String(url || "").replace(/\/$/, "")
const toV1 = (base: string) => {
  const b = normalizeBase(base)
  return /\/v1$/i.test(b) ? b : `${b}/v1`
}

const FISKIL_BASE_URL = process.env.FISKIL_BASE_URL || "https://api.fiskil.com"
const FISKIL_V1_BASE = toV1(FISKIL_BASE_URL)

const FISKIL_CLIENT_ID = process.env.FISKIL_CLIENT_ID
const FISKIL_CLIENT_SECRET = process.env.FISKIL_CLIENT_SECRET

function pickEndUserId(json: any): string | null {
  return json?.end_user_id || json?.id || json?.endUserId || null
}

function pickAuthUrl(json: any): string | null {
  return json?.auth_url || json?.url || json?.redirect_url || json?.link || null
}

async function getFiskilToken(): Promise<string> {
  mustEnv("FISKIL_CLIENT_ID", FISKIL_CLIENT_ID)
  mustEnv("FISKIL_CLIENT_SECRET", FISKIL_CLIENT_SECRET)

  const r = await fetch(`${FISKIL_V1_BASE}/token`, {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify({
      client_id: FISKIL_CLIENT_ID,
      client_secret: FISKIL_CLIENT_SECRET,
    }),
  })

  const text = await r.text()
  let json: any = null
  try {
    json = text ? JSON.parse(text) : null
  } catch {
    json = null
  }

  if (!r.ok) throw new Error(`Fiskil token failed (${r.status}): ${text}`)

  const token = json?.token
  if (!token) throw new Error(`Fiskil token missing in response: ${text}`)
  return token
}

async function fiskilRequest(path: string, opts: RequestInit & { token: string }) {
  const url = `${FISKIL_V1_BASE}${path.startsWith("/") ? path : `/${path}`}`

  const r = await fetch(url, {
    ...opts,
    headers: {
      accept: "application/json",
      "content-type": "application/json; charset=UTF-8",
      authorization: `Bearer ${opts.token}`,
      ...(opts.headers || {}),
    },
  })

  const text = await r.text()
  let json: any = null
  try {
    json = text ? JSON.parse(text) : null
  } catch {
    json = null
  }

  if (!r.ok) {
    throw new Error(`Failed to ${opts.method || "GET"} ${path}: ${text}`)
  }

  return json
}

export async function POST() {
  try {
    // 0) Validate env
    mustEnv("FISKIL_CLIENT_ID", FISKIL_CLIENT_ID)
    mustEnv("FISKIL_CLIENT_SECRET", FISKIL_CLIENT_SECRET)

    // 1) Get authenticated user (cookie session)
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const appUserId = user.id
    const email = user.email || null

    // 2) Load existing end_user_id from profiles (reuse, don’t recreate)
    const { data: profile, error: profileErr } = await supabase
      .from("profiles")
      .select("fiskil_user_id")
      .eq("id", appUserId)
      .maybeSingle()

    if (profileErr) throw profileErr

    // 3) Token
    const token = await getFiskilToken()

    // 4) Get or create end user
    let endUserId: string | null = profile?.fiskil_user_id ?? null

    if (!endUserId) {
      const created = await fiskilRequest("/end-users", {
        method: "POST",
        token,
        body: JSON.stringify({
          email: email || `user_${appUserId}@example.com`,
          external_id: appUserId,
        }),
      })

      endUserId = pickEndUserId(created)

      if (!endUserId) {
        throw new Error(`Fiskil end user id missing from response: ${JSON.stringify(created)}`)
      }

      await supabase.from("profiles").update({ fiskil_user_id: endUserId }).eq("id", appUserId)
    }

    // IMPORTANT: never call auth/session without a verified endUserId
    if (!endUserId) {
      throw new Error("end_user_id could not be resolved")
    }

    // 5) Create auth session (redirect flow)
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const redirect_uri = `${appUrl}/fiskil/callback`
    const cancel_uri = `${appUrl}/onboarding`

    const sessionJson = await fiskilRequest("/auth/session", {
      method: "POST",
      token,
      body: JSON.stringify({
        end_user_id: endUserId,
        redirect_uri,
        cancel_uri,
      }),
    })

    const auth_url = pickAuthUrl(sessionJson)
    if (!auth_url) {
      return NextResponse.json(
        { error: "Missing auth_url from Fiskil auth session response", raw: sessionJson },
        { status: 500 }
      )
    }

    return NextResponse.json({
      auth_url,
      end_user_id: endUserId,
      redirect_uri,
    })
  } catch (error: any) {
    console.error("Error creating consent session:", error)
    return NextResponse.json(
      { error: error?.message || "create-consent-session failed" },
      { status: 500 }
    )
  }
}
