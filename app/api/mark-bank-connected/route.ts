import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(request: NextRequest) {
  try {
    // Try to get userId from multiple sources
    let userId: string | null = null;

    // 1. Try from request body
    try {
      const body = await request.json();
      userId = body.userId || body.user_id || null;
    } catch {
      // No body or invalid JSON, continue
    }

    // 2. Try from query params
    if (!userId) {
      const { searchParams } = new URL(request.url);
      userId = searchParams.get("userId") || searchParams.get("user_id");
    }

    // 3. Try from Authorization header (Supabase JWT)
    if (!userId && supabaseUrl && supabaseServiceKey) {
      const authHeader = request.headers.get("authorization");
      if (authHeader) {
        const token = authHeader.replace("Bearer ", "");
        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (!error && user) {
          userId = user.id;
        }
      }
    }

    // 4. Try from cookies (session)
    if (!userId) {
      const cookies = request.cookies;
      const sessionCookie = cookies.get("sb-access-token") || cookies.get("supabase-auth-token");
      if (sessionCookie && supabaseUrl && supabaseServiceKey) {
        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        const { data: { user }, error } = await supabase.auth.getUser(sessionCookie.value);
        if (!error && user) {
          userId = user.id;
        }
      }
    }

    // If still no userId, check if we're in demo mode
    if (!userId) {
      console.warn("No userId found in request. Accepting in demo mode.");
      return NextResponse.json({ 
        ok: true, 
        demo: true,
        message: "Bank connection acknowledged (demo mode - no userId)" 
      });
    }

    // Check if Supabase is configured
    if (!supabaseUrl || !supabaseServiceKey) {
      console.warn("Supabase not configured, skipping mark-bank-connected");
      return NextResponse.json({ 
        ok: true, 
        message: "Supabase not configured, no action taken",
        userId 
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

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
      if (updateError.message.includes("onboarding_step") || updateError.message.includes("column")) {
        console.warn("Column not found in profiles table. Run this SQL in Supabase:\n" +
          "ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_step TEXT DEFAULT 'welcome';\n" +
          "ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bank_connected_at TIMESTAMPTZ;");
        
        // Return success anyway to not block the flow
        return NextResponse.json({ 
          ok: true, 
          warning: "Column missing but continuing",
          message: "Please add onboarding_step column to profiles table",
          userId
        });
      }

      console.error("Error updating profile:", updateError);
      return NextResponse.json({ 
        ok: false, 
        error: updateError.message,
        userId 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      ok: true, 
      message: "Bank connection marked successfully",
      userId 
    });

  } catch (error) {
    console.error("mark-bank-connected error:", error);
    return NextResponse.json(
      { 
        ok: false, 
        error: error instanceof Error ? error.message : "Internal server error",
        hint: "Could not determine userId from request"
      },
      { status: 500 }
    );
  }
}