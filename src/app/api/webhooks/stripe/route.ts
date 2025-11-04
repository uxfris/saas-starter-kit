import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/services/stripe/client";
import { prisma } from "@/lib/db/prisma";
import { env } from "@/env.mjs";

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;

        if (userId && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          );

          await prisma.subscription.update({
            where: { userId },
            data: {
              stripeSubscriptionId: subscription.id,
              stripePriceId: subscription.items.data[0]?.price.id,
              status: subscription.status,
              currentPeriodStart: new Date(
                subscription.items.data[0]?.current_period_start * 1000
              ),
              currentPeriodEnd: new Date(
                subscription.items.data[0]?.current_period_end * 1000
              ),
            },
          });
        }
        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const dbSubscription = await prisma.subscription.findUnique({
          where: { stripeCustomerId: customerId },
        });

        if (dbSubscription) {
          await prisma.subscription.update({
            where: { stripeCustomerId: customerId },
            data: {
              status: subscription.status,
              currentPeriodStart: new Date(
                subscription.items.data[0]?.current_period_start * 1000
              ),
              currentPeriodEnd: new Date(
                subscription.items.data[0]?.current_period_start * 1000
              ),
              cancelAtPeriodEnd: subscription.cancel_at_period_end,
            },
          });
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook handler error:", err);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
