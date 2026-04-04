import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

// ENV VARS needed:
// - STRIPE_SECRET_KEY
// - NEXT_PUBLIC_APP_URL
// - STRIPE_PRICE_ID — accepts either a price ID (price_xxx) or a product ID (prod_xxx).
//   If a product ID is provided, the default price is looked up automatically.

export async function POST(request: NextRequest) {
  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY
    const appUrl = process.env.NEXT_PUBLIC_APP_URL
    const configuredId = process.env.STRIPE_PRICE_ID

    if (!stripeKey || !appUrl || !configuredId) {
      return NextResponse.json(
        { error: "Stripe is not configured. Ensure STRIPE_SECRET_KEY, NEXT_PUBLIC_APP_URL, and STRIPE_PRICE_ID are set." },
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

    // Resolve the price ID — if a product ID was provided, look up its default price
    let priceId = configuredId
    if (configuredId.startsWith("prod_")) {
      try {
        const product = await stripe.products.retrieve(configuredId)
        const dp = product.default_price
        if (typeof dp === "string") {
          priceId = dp
        } else if (dp && typeof dp === "object") {
          priceId = (dp as Stripe.Price).id
        } else {
          return NextResponse.json(
            { error: "The configured Stripe product has no default price. Set STRIPE_PRICE_ID to a price ID (starts with 'price_') or add a default price to your product in the Stripe Dashboard." },
            { status: 500 }
          )
        }
      } catch (productErr) {
        console.error("Failed to resolve product ID to price:", productErr)
        return NextResponse.json(
          { error: "Invalid Stripe product ID or failed to look up its price. Check STRIPE_PRICE_ID in your env vars." },
          { status: 500 }
        )
      }
    }

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
    const stripeErr = error as { code?: string; param?: string }
    if (stripeErr.code === "resource_missing" && stripeErr.param?.includes("price")) {
      return NextResponse.json(
        { error: "The configured Stripe price ID does not exist. Check that STRIPE_PRICE_ID is correct and matches your Stripe mode (test vs live)." },
        { status: 500 }
      )
    }
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    )
  }
}
