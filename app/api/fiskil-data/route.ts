import { NextRequest, NextResponse } from "next/server"

// This route is intentionally minimal.
// Bank data is written to Supabase via POST /api/fiskil-data/inject
// after the user completes the Fiskil consent flow at /fiskil/callback.
//
// To trigger a manual re-sync for a user, call POST /api/fiskil-data/inject
// with a valid Authorization header containing the user's Supabase JWT.

export async function GET(_request: NextRequest) {
  return NextResponse.json(
    {
      message:
        "Use the Fiskil consent flow to connect a bank account. " +
        "Data is fetched and written to Supabase via POST /api/fiskil-data/inject.",
    },
    { status: 200 }
  )
}
