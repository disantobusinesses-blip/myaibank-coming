import { NextRequest, NextResponse } from "next/server"

// ENV VARS needed:
// - STRIPE_SECRET_KEY
// - STRIPE_WEBHOOK_SECRET
// - SUPABASE_URL
// - SUPABASE_SERVICE_ROLE_KEY

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("stripe-signature")

    if (!signature) {
      return NextResponse.json(
        { error: "Missing stripe signature" },
        { status: 400 }
      )
    }

    // In production, verify webhook signature and process events
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
    // const event = stripe.webhooks.constructEvent(
    //   body,
    //   signature,
    //   process.env.STRIPE_WEBHOOK_SECRET!
    // )

    // Handle different event types:
    // - checkout.session.completed
    // - customer.subscription.updated
    // - customer.subscription.deleted
    // - invoice.paid
    // - invoice.payment_failed

    // switch (event.type) {
    //   case 'checkout.session.completed':
    //     // Handle successful checkout
    //     break
    //   case 'customer.subscription.deleted':
    //     // Handle subscription cancellation
    //     break
    // }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Error processing webhook:", error)
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    )
  }
}
