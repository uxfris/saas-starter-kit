import type { AIRequest } from "@prisma/client";

export function AIHistory({ history }: { history: AIRequest[] }) {
  if (history.length === 0) {
    return (
      <p className="text-gray-500 text-sm">
        No history yet. Generate your first response!
      </p>
    );
  }

  return (
    <div className="space-y-4 max-h-96 overflow-y-auto">
      {history.map((request) => (
        <div key={request.id} className="border rounded-lg p-3">
          <p className="text-sm font-medium text-gray-900 mb-1">
            {request.prompt.slice(0, 100)}
            {request.prompt.length > 100 ? "..." : ""}
          </p>
          <p className="text-xs text-gray-500">
            {new Date(request.createdAt).toLocaleString()} • {request.tokens}{" "}
            tokens
          </p>
        </div>
      ))}
    </div>
  );
}
