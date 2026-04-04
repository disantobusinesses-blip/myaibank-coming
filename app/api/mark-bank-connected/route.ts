import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    // Parse the request body for end_user_id (sent from the callback)
    let endUserId: string | null = null;
    try {
      const body = await request.json();
      endUserId = body.end_user_id || body.endUserId || null;
    } catch {
      // No body or invalid JSON, continue
    }

    // Resolve the authenticated user from Supabase session cookies
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.warn("mark-bank-connected: No authenticated user found.");
      return NextResponse.json({
        ok: true,
        demo: true,
        message: "Bank connection acknowledged (no authenticated user)",
      });
    }

    const userId = user.id;

    // Update the profile to mark bank connection
    const updatePayload: { has_bank_connection: boolean; fiskil_user_id?: string } = {
      has_bank_connection: true,
    };
    if (endUserId) {
      updatePayload.fiskil_user_id = endUserId;
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update(updatePayload)
      .eq("id", userId);

    if (updateError) {
      console.error("Error updating profile:", updateError);
      return NextResponse.json({
        ok: false,
        error: updateError.message,
        userId,
      }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      message: "Bank connection marked successfully",
      userId,
    });

  } catch (error) {
    console.error("mark-bank-connected error:", error);
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}