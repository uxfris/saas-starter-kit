import { getAIHistory } from "@/lib/actions/ai";
import { AIForm } from "@/components/dashboard/ai-form";
import { AIHistory } from "@/components/dashboard/ai-history";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AIPage() {
  const history = await getAIHistory();

  return (
    <div className="px-4 sm:px-0">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">AI Assistant</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Generate Content</CardTitle>
          </CardHeader>
          <CardContent>
            <AIForm />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent History</CardTitle>
          </CardHeader>
          <CardContent>
            <AIHistory history={history} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
