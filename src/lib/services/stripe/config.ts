import { env } from "@/env.mjs";

export function getPriceId(plan: string) {
  const priceId =
    STRIPE_CONFIG.prices[plan as keyof typeof STRIPE_CONFIG.prices];
  if (!priceId) {
    throw new Error(
      `Missing Stripe Price ID for ${plan}. ` +
        `Please set STRIPE_PRICE_${plan.toUpperCase()} in your environment variables.`
    );
  }
  return priceId;
}

export const STRIPE_CONFIG = {
  prices: {
    basic: env.STRIPE_PRICE_ID_BASIC || "",
    pro: env.STRIPE_PRICE_ID_PRO || "",
  },
};
