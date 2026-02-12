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
        { error: "Stripe is not configured. Ensure STRIPE_SECRET_KEY, NEXT_PUBLIC_APP_URL, and STRIPE_PRICE_ID are set." },
        { status: 500 }
      )
    }

    // Validate that STRIPE_PRICE_ID is actually a price ID, not a product ID
    if (priceId.startsWith("prod_")) {
      console.error(
        "STRIPE_PRICE_ID is set to a product ID (starts with 'prod_'). " +
        "It must be a price ID (starts with 'price_'). " +
        "Find the correct price ID in Stripe Dashboard → Products → select the product → copy the price ID."
      )
      return NextResponse.json(
        { error: "Stripe misconfigured: STRIPE_PRICE_ID must be a price ID (starts with 'price_'), not a product ID. Check your Stripe Dashboard." },
        { status: 500 }
      )
    }

    if (!priceId.startsWith("price_")) {
      console.error(
        `STRIPE_PRICE_ID has unexpected format: '${priceId.substring(0, 10)}...'. ` +
        "It should start with 'price_'. Find the correct ID in Stripe Dashboard → Products."
      )
      return NextResponse.json(
        { error: "Stripe misconfigured: STRIPE_PRICE_ID should start with 'price_'. Check your Stripe Dashboard." },
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
