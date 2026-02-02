import { NextRequest, NextResponse } from "next/server"

// ENV VARS needed:
// - FISKIL_BASE_URL
// - FISKIL_CLIENT_ID
// - FISKIL_CLIENT_SECRET
// - SUPABASE_URL
// - SUPABASE_SERVICE_ROLE_KEY

// Mock data for demonstration
const mockAccounts = [
  { id: "1", name: "Everyday Account", type: "transaction", balance: 2847.5, institution: "CommBank" },
  { id: "2", name: "Savings Account", type: "savings", balance: 15420.0, institution: "CommBank" },
  { id: "3", name: "Credit Card", type: "credit", balance: -1250.0, institution: "ANZ" },
]

const mockTransactions = [
  { id: "1", date: "2026-01-30", description: "Woolworths", amount: -85.42, category: "Groceries", merchant: "Woolworths" },
  { id: "2", date: "2026-01-30", description: "Salary", amount: 3500.0, category: "Income", merchant: "Employer" },
  { id: "3", date: "2026-01-29", description: "Netflix", amount: -22.99, category: "Entertainment", merchant: "Netflix" },
  { id: "4", date: "2026-01-29", description: "Uber Eats", amount: -45.0, category: "Food & Dining", merchant: "Uber Eats" },
  { id: "5", date: "2026-01-28", description: "Shell", amount: -78.5, category: "Transport", merchant: "Shell" },
  { id: "6", date: "2026-01-28", description: "Spotify", amount: -12.99, category: "Entertainment", merchant: "Spotify" },
  { id: "7", date: "2026-01-27", description: "Rent Transfer", amount: -1500.0, category: "Housing", merchant: "Property Manager" },
  { id: "8", date: "2026-01-26", description: "Coffee Club", amount: -6.5, category: "Food & Dining", merchant: "Coffee Club" },
]

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

    // Mock response
    return NextResponse.json({
      connected: true,
      accounts: mockAccounts,
      transactions: mockTransactions,
      last_updated: new Date().toISOString(),
      syncStatus: {
        stage: "complete",
        progress: 100,
        message: "Data synced successfully",
      },
    })
  } catch (error) {
    console.error("Error fetching Fiskil data:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
