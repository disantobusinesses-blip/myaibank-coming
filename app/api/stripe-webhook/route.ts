import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@supabase/supabase-js"

// ENV VARS needed:
// - STRIPE_SECRET_KEY
// - STRIPE_WEBHOOK_SECRET
// - NEXT_PUBLIC_SUPABASE_URL
// - SUPABASE_SERVICE_ROLE_KEY

function getServiceSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

async function updateSubscription(
  userId: string,
  data: {
    subscription_status: string
    subscription_plan?: string | null
    stripe_customer_id?: string | null
    stripe_subscription_id?: string | null
    trial_end?: string | null
    current_period_end?: string | null
  }
) {
  const supabase = getServiceSupabase()
  if (!supabase) return

  const { error } = await supabase
    .from("profiles")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", userId)

  if (error) {
    console.error("Error updating subscription in DB:", error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

    if (!stripeKey || !webhookSecret) {
      return NextResponse.json(
        { error: "Stripe not configured" },
        { status: 500 }
      )
    }

    const body = await request.text()
    const signature = request.headers.get("stripe-signature")

    if (!signature) {
      return NextResponse.json(
        { error: "Missing stripe signature" },
        { status: 400 }
      )
    }

    const stripe = new Stripe(stripeKey)
    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error("Webhook signature verification failed:", err)
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      )
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.user_id
        if (!userId) break

        const subscriptionId =
          typeof session.subscription === "string"
            ? session.subscription
            : session.subscription?.id

        await updateSubscription(userId, {
          subscription_status: "trialing",
          subscription_plan: "pro",
          stripe_customer_id:
            typeof session.customer === "string"
              ? session.customer
              : session.customer?.id ?? null,
          stripe_subscription_id: subscriptionId ?? null,
        })
        break
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription
        const userId = sub.metadata?.user_id
        if (!userId) {
          console.warn("Webhook: subscription event missing user_id in metadata", sub.id)
          break
        }

        await updateSubscription(userId, {
          subscription_status: sub.status,
          stripe_subscription_id: sub.id,
          trial_end: sub.trial_end
            ? new Date(sub.trial_end * 1000).toISOString()
            : null,
          current_period_end: sub.current_period_end
            ? new Date(sub.current_period_end * 1000).toISOString()
            : null,
        })
        break
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription
        const userId = sub.metadata?.user_id
        if (!userId) {
          console.warn("Webhook: subscription.deleted missing user_id in metadata", sub.id)
          break
        }

        await updateSubscription(userId, {
          subscription_status: "canceled",
          stripe_subscription_id: sub.id,
          current_period_end: sub.current_period_end
            ? new Date(sub.current_period_end * 1000).toISOString()
            : null,
        })
        break
      }

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice
        const subId =
          typeof invoice.subscription === "string"
            ? invoice.subscription
            : invoice.subscription?.id

        if (subId) {
          const subscription = await stripe.subscriptions.retrieve(subId)
          const userId = subscription.metadata?.user_id
          if (userId) {
            await updateSubscription(userId, {
              subscription_status: subscription.status,
              current_period_end: subscription.current_period_end
                ? new Date(subscription.current_period_end * 1000).toISOString()
                : null,
            })
          }
        }
        break
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice
        const subId =
          typeof invoice.subscription === "string"
            ? invoice.subscription
            : invoice.subscription?.id

        if (subId) {
          const subscription = await stripe.subscriptions.retrieve(subId)
          const userId = subscription.metadata?.user_id
          if (userId) {
            await updateSubscription(userId, {
              subscription_status: subscription.status,
            })
          }
        }
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Error processing webhook:", error)
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    )
  }
}
