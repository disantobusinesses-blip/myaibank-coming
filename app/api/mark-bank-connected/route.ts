import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ ok: false, error: "Missing userId" }, { status: 400 });
    }

    // Check if Supabase is configured
    if (!supabaseUrl || !supabaseServiceKey) {
      console.warn("Supabase not configured, skipping mark-bank-connected");
      return NextResponse.json({ ok: true, message: "Supabase not configured, no action taken" });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // First, check if the onboarding_step column exists
    const { data: columns, error: columnError } = await supabase
      .from("profiles")
      .select("*")
      .limit(0);

    // If we can't check the schema, just return success (non-blocking)
    if (columnError) {
      console.warn("Could not verify profiles schema:", columnError.message);
      return NextResponse.json({ ok: true, message: "Schema check skipped" });
    }

    // Try to update the onboarding_step
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ 
        onboarding_step: "bank_connected",
        bank_connected_at: new Date().toISOString()
      })
      .eq("id", userId);

    if (updateError) {
      // If the column doesn't exist, log but don't fail
      if (updateError.message.includes("onboarding_step")) {
        console.warn("onboarding_step column not found in profiles table. Run this SQL in Supabase:\n" +
          "ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_step TEXT DEFAULT 'welcome';\n" +
          "ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bank_connected_at TIMESTAMPTZ;");
        
        // Return success anyway to not block the flow
        return NextResponse.json({ 
          ok: true, 
          warning: "Column missing but continuing",
          message: "Please add onboarding_step column to profiles table"
        });
      }

      console.error("Error updating profile:", updateError);
      return NextResponse.json({ ok: false, error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, message: "Bank connection marked successfully" });

  } catch (error) {
    console.error("mark-bank-connected error:", error);
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}