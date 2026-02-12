import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

// ENV VARS needed:
// - STRIPE_SECRET_KEY
// - NEXT_PUBLIC_APP_URL
// - STRIPE_PRICE_ID (the Stripe Price ID for the monthly plan)

export async function POST(request: NextRequest) {
  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY
    const appUrl = process.env.NEXT_PUBLIC_APP_URL
    const priceId = process.env.STRIPE_PRICE_ID

    if (!stripeKey || !appUrl || !priceId) {
      return NextResponse.json(
        { error: "Stripe is not configured" },
        { status: 500 }
      )
    }

    const { userId, email } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      )
    }

    const stripe = new Stripe(stripeKey)

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_collection: "always",
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: {
        trial_period_days: 7,
        metadata: { user_id: userId },
      },
      success_url: `${appUrl}/subscription-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/subscribe`,
      metadata: { user_id: userId },
      ...(email ? { customer_email: email } : {}),
    })

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    })
  } catch (error) {
    console.error("Error creating checkout session:", error)
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    )
  }
}
