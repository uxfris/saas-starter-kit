"use client";

import { createPortalSession } from "@/lib/actions/billing";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Subscription } from "@prisma/client";

export function SubscriptionDetails({
  subscription,
}: {
  subscription: Subscription;
}) {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Current Subscription</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <p className="text-lg font-semibold capitalize">
              {subscription.status}
            </p>
          </div>
          {subscription.currentPeriodEnd && (
            <div>
              <p className="text-sm text-gray-500">
                {subscription.cancelAtPeriodEnd ? "Ends on" : "Renews on"}
              </p>
              <p className="text-lg font-semibold">
                {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
              </p>
            </div>
          )}
          <form action={createPortalSession}>
            <Button type="submit" variant="outline">
              Manage Subscription
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
