import { NextRequest, NextResponse } from "next/server"

// ENV VARS needed:
// - STRIPE_SECRET_KEY
// - NEXT_PUBLIC_APP_URL

export async function POST(request: NextRequest) {
  try {
    const { priceId, userId } = await request.json()

    if (!priceId) {
      return NextResponse.json(
        { error: "Price ID is required" },
        { status: 400 }
      )
    }

    // In production, this would create a Stripe checkout session
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
    // const session = await stripe.checkout.sessions.create({
    //   mode: 'subscription',
    //   payment_method_types: ['card'],
    //   line_items: [{ price: priceId, quantity: 1 }],
    //   success_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription-success?session_id={CHECKOUT_SESSION_ID}`,
    //   cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscribe`,
    //   metadata: { userId },
    // })

    // Mock response
    return NextResponse.json({
      sessionId: `mock_session_${Date.now()}`,
      url: "/subscription-success",
    })
  } catch (error) {
    console.error("Error creating checkout session:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
