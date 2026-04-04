import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

// ENV VARS needed:
// - STRIPE_SECRET_KEY

export async function POST(request: NextRequest) {
  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY
    if (!stripeKey) {
      return NextResponse.json(
        { error: "Stripe not configured" },
        { status: 500 }
      )
    }

    const { sessionId } = await request.json()

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      )
    }

    const stripe = new Stripe(stripeKey)
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["subscription"],
    })

    if (session.status !== "complete") {
      return NextResponse.json(
        { error: "Checkout session is not complete" },
        { status: 400 }
      )
    }

    const subscription = session.subscription as Stripe.Subscription | null

    return NextResponse.json({
      success: true,
      subscription: {
        id: subscription?.id ?? null,
        status: subscription?.status ?? "trialing",
        plan: "pro",
        trialEnd: subscription?.trial_end
          ? new Date(subscription.trial_end * 1000).toISOString()
          : null,
        currentPeriodEnd: subscription?.current_period_end
          ? new Date(subscription.current_period_end * 1000).toISOString()
          : null,
      },
    })
  } catch (error) {
    console.error("Error verifying subscription:", error)
    return NextResponse.json(
      { error: "Failed to verify subscription" },
      { status: 500 }
    )
  }
}
