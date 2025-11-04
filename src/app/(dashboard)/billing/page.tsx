import { getSubscriptionStatus } from "@/lib/actions/billing";
import { PricingCards } from "@/components/dashboard/pricing-cards";
import { SubscriptionDetails } from "@/components/dashboard/subscription-details";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function BillingPage() {
  const subscription = await getSubscriptionStatus();

  return (
    <div className="px-4 sm:px-0">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Billing & Subscription
      </h1>

      {subscription?.status === "active" ? (
        <SubscriptionDetails subscription={subscription} />
      ) : (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg">
              You are currently on the <strong>Free</strong> plan.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Upgrade to unlock more features and increase your usage limits.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Available Plans
        </h2>
        <PricingCards currentStatus={subscription?.status} />
      </div>
    </div>
  );
}
