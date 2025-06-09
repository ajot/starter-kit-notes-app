import { type NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import Stripe from "stripe"
import { pool } from "@/lib/db"
import { sendProUpgradeEmail } from "@/lib/email"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const headersList = headers()
    const signature = headersList.get("stripe-signature")!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error("Webhook signature verification failed:", err)
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session

        if (session.mode === "subscription") {
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string)

          // Get user by customer ID
          const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [session.customer_email])

          if (userResult.rows.length > 0) {
            const user = userResult.rows[0]

            // Create or update subscription
            await pool.query(
              `
              INSERT INTO subscriptions (user_id, stripe_subscription_id, stripe_customer_id, status, price_id, current_period_start, current_period_end)
              VALUES ($1, $2, $3, $4, $5, $6, $7)
              ON CONFLICT (stripe_subscription_id) 
              DO UPDATE SET status = $4, current_period_start = $6, current_period_end = $7
            `,
              [
                user.id,
                subscription.id,
                subscription.customer,
                subscription.status,
                subscription.items.data[0].price.id,
                new Date(subscription.current_period_start * 1000),
                new Date(subscription.current_period_end * 1000),
              ],
            )

            // Send pro upgrade email
            await sendProUpgradeEmail(user.email, user.name || "User")
          }
        }
        break
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription

        await pool.query(
          "UPDATE subscriptions SET status = $1, current_period_start = $2, current_period_end = $3 WHERE stripe_subscription_id = $4",
          [
            subscription.status,
            new Date(subscription.current_period_start * 1000),
            new Date(subscription.current_period_end * 1000),
            subscription.id,
          ],
        )
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}
