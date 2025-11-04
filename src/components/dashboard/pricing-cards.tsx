"use client";

import { createCheckoutSession } from "@/lib/actions/billing";
import { PLANS } from "@/lib/services/stripe/pricing";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PricingCards({
  currentStatus,
}: {
  currentStatus?: string | null;
}) {
  const handleSubscribe = async (planId: string) => {
    await createCheckoutSession(planId);
  };

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Object.entries(PLANS).map(([key, plan]) => (
        <Card
          key={key}
          className={key === "PRO" ? "border-blue-500 border-2" : ""}
        >
          <CardHeader>
            <CardTitle>{plan.name}</CardTitle>
            <div className="mt-4">
              <span className="text-4xl font-bold">${plan.price}</span>
              <span className="text-gray-500">/month</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <svg
                    className="h-5 w-5 text-green-500 mr-2 shrink-0"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            {plan.planId ? (
              <form action={() => handleSubscribe(plan.planId ?? null)}>
                <Button
                  type="submit"
                  className="w-full"
                  variant={key === "PRO" ? "default" : "outline"}
                  disabled={currentStatus === "active"}
                >
                  {currentStatus === "active" ? "Current Plan" : "Subscribe"}
                </Button>
              </form>
            ) : (
              <Button className="w-full" variant="outline" disabled>
                {currentStatus === "active" ? "Free Plan" : "Current Plan"}
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
