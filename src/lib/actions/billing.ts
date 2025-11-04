"use server";

import { redirect } from "next/navigation";
import { getUser } from "@/lib/services/supabase/server";
import { stripe } from "@/lib/services/stripe/client";
import { prisma } from "@/lib/db/prisma";
import { env } from "@/env.mjs";
import { getPriceId } from "../services/stripe/config";

export async function createCheckoutSession(planId: string) {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  const priceId = getPriceId(planId);

  // Get or create Stripe customer
  let subscription = await prisma.subscription.findUnique({
    where: { userId: user.id },
  });

  let customerId: string;

  if (subscription?.stripeCustomerId) {
    customerId = subscription.stripeCustomerId;
  } else {
    const customer = await stripe.customers.create({
      email: user.email!,
      metadata: {
        userId: user.id,
      },
    });
    customerId = customer.id;

    // Update or create subscription record
    await prisma.subscription.upsert({
      where: { userId: user.id },
      update: { stripeCustomerId: customerId },
      create: {
        userId: user.id,
        stripeCustomerId: customerId,
        status: "incomplete",
      },
    });
  }

  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${env.NEXT_PUBLIC_APP_URL}/billing?success=true`,
    cancel_url: `${env.NEXT_PUBLIC_APP_URL}/billing?canceled=true`,
    metadata: {
      userId: user.id,
    },
  });

  if (!session.url) {
    throw new Error("Failed to create checkout session");
  }

  redirect(session.url);
}

export async function createPortalSession() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  const subscription = await prisma.subscription.findUnique({
    where: { userId: user.id },
  });

  if (!subscription?.stripeCustomerId) {
    throw new Error("No subscription found");
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: `${env.NEXT_PUBLIC_APP_URL}/billing`,
  });

  redirect(session.url);
}

export async function getSubscriptionStatus() {
  const user = await getUser();

  if (!user) {
    return null;
  }

  const subscription = await prisma.subscription.findUnique({
    where: { userId: user.id },
  });

  return subscription;
}
