export const PLANS = {
  FREE: {
    name: "Free",
    price: 0,
    planId: null,
    features: ["10 AI requests/month", "Basic support", "Community access"],
  },
  BASIC: {
    name: "Basic",
    price: 9.99,
    planId: "basic",
    features: ["100 AI requests/month", "Email support", "Priority access"],
  },
  PRO: {
    name: "Pro",
    price: 29.99,
    planId: "pro",
    features: [
      "Unlimited AI requests",
      "Priority support",
      "Advanced features",
    ],
  },
} as const;
