import { NextRequest, NextResponse } from "next/server"

// ENV VARS needed:
// - OPENAI_API_KEY (optional, for enhanced analysis)

export async function POST(request: NextRequest) {
  try {
    const { transactions, income } = await request.json()

    if (!transactions || !income) {
      return NextResponse.json(
        { error: "Transactions and income are required" },
        { status: 400 }
      )
    }

    // Calculate 50/30/20 breakdown
    const totalExpenses = transactions
      .filter((t: { amount: number }) => t.amount < 0)
      .reduce((sum: number, t: { amount: number }) => sum + Math.abs(t.amount), 0)

    // Categorize spending (simplified)
    const categories = transactions.reduce((acc: Record<string, number>, t: { amount: number; category: string }) => {
      if (t.amount < 0) {
        acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount)
      }
      return acc
    }, {} as Record<string, number>)

    // Classify into needs/wants using expanded category lists
    const needsCategories = ["Housing", "Groceries", "Transport", "Utilities", "Insurance", "Health & Fitness"]
    const savingsCategories = ["Transfer", "Savings", "Investment"]
    
    let needs = 0
    let wants = 0
    
    for (const [cat, amount] of Object.entries(categories)) {
      const catLower = cat.toLowerCase()
      if (savingsCategories.some((c) => catLower.includes(c.toLowerCase()))) {
        continue // Exclude transfers/savings from needs/wants
      }
      if (needsCategories.some((c) => catLower.includes(c.toLowerCase()))) {
        needs += amount as number
      } else {
        wants += amount as number
      }
    }
    
    const savings = income - totalExpenses

    // 50/30/20 targets
    const needsTarget = income * 0.5
    const wantsTarget = income * 0.3
    const savingsTarget = income * 0.2

    // Generate suggestions
    const suggestions = []
    
    if (needs > needsTarget) {
      suggestions.push({
        type: "warning",
        message: `Your essential spending (${((needs / income) * 100).toFixed(0)}%) exceeds the recommended 50%. Consider reviewing your housing or utility costs.`,
      })
    }

    if (wants > wantsTarget) {
      suggestions.push({
        type: "warning",
        message: `Your discretionary spending (${((wants / income) * 100).toFixed(0)}%) exceeds the recommended 30%. Look for subscriptions or dining expenses to reduce.`,
      })
    }

    if (savings < savingsTarget) {
      suggestions.push({
        type: "warning",
        message: `You're saving ${((savings / income) * 100).toFixed(0)}% of your income, below the recommended 20%. Try to automate savings transfers.`,
      })
    } else {
      suggestions.push({
        type: "success",
        message: `Great job! You're saving ${((savings / income) * 100).toFixed(0)}% of your income, meeting or exceeding the 20% target.`,
      })
    }

    return NextResponse.json({
      breakdown: {
        needs: {
          actual: needs,
          target: needsTarget,
          percentage: (needs / income) * 100,
        },
        wants: {
          actual: wants,
          target: wantsTarget,
          percentage: (wants / income) * 100,
        },
        savings: {
          actual: savings,
          target: savingsTarget,
          percentage: (savings / income) * 100,
        },
      },
      categories,
      suggestions,
    })
  } catch (error) {
    console.error("Error analyzing finances:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
