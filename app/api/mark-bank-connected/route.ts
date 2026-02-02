import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let body: any = null
    try {
      body = await req.json()
    } catch {
      body = null
    }

    const endUserId =
      body?.end_user_id ||
      body?.endUserId ||
      body?.userId ||
      null

    // If we weren't given an end_user_id, try to read existing one (fallback)
    let fiskilUserIdToStore: string | null = endUserId

    if (!fiskilUserIdToStore) {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("fiskil_user_id")
        .eq("id", user.id)
        .single()

      fiskilUserIdToStore = profileData?.fiskil_user_id ?? null
    }

    if (!fiskilUserIdToStore) {
      return NextResponse.json(
        { error: "Missing end_user_id" },
        { status: 400 }
      )
    }

    const { error: updateErr } = await supabase
      .from("profiles")
      .update({
        has_bank_connection: true,
        fiskil_user_id: fiskilUserIdToStore,
        onboarding_step: "COMPLETE",
        is_onboarded: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)

    if (updateErr) {
      return NextResponse.json({ error: updateErr.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, end_user_id: fiskilUserIdToStore })
  } catch (e) {
    return NextResponse.json(
      { error: "Unable to mark bank connection", details: String((e as any)?.message || e) },
      { status: 500 }
    )
  }
}
