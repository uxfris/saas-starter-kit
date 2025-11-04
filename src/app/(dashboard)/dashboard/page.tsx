import { getUser } from "@/lib/services/supabase/server";
import { prisma } from "@/lib/db/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

async function getDashboardStats(userId: string) {
  const [aiRequestCount, subscription] = await Promise.all([
    prisma.aIRequest.count({
      where: { userId },
    }),
    prisma.subscription.findUnique({
      where: { userId },
    }),
  ]);

  return { aiRequestCount, subscription };
}

export default async function DashboardPage() {
  const user = await getUser();
  const stats = await getDashboardStats(user!.id);

  return (
    <div className="px-4 sm:px-0">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Welcome Back</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{user?.email}</p>
            <p className="text-sm text-gray-500 mt-2">
              Account created:{" "}
              {new Date(user?.created_at || "").toLocaleDateString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.aiRequestCount}</p>
            <p className="text-sm text-gray-500 mt-2">Total requests made</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subscription Status</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold capitalize">
              {stats.subscription?.status || "Free"}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {stats.subscription?.status === "active"
                ? "Active subscription"
                : "No active subscription"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <a
                href="/ai"
                className="block p-4 border rounded-lg hover:bg-gray-50 transition"
              >
                <h3 className="font-semibold">Try AI Assistant</h3>
                <p className="text-sm text-gray-500">
                  Generate content with OpenAI
                </p>
              </a>
              <a
                href="/billing"
                className="block p-4 border rounded-lg hover:bg-gray-50 transition"
              >
                <h3 className="font-semibold">Manage Billing</h3>
                <p className="text-sm text-gray-500">
                  View plans and subscriptions
                </p>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
