"use client";

import { useFormStatus } from "react-dom";
import { generateCompletion } from "@/lib/actions/ai";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Generating..." : "Generate"}
    </Button>
  );
}

export function AIForm() {
  const [result, setResult] = useState<{
    response?: string;
    error?: string;
  } | null>(null);

  async function handleSubmit(formData: FormData) {
    const response = await generateCompletion(formData);
    setResult(response);
  }

  return (
    <div className="space-y-4">
      <form action={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="prompt"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Enter your prompt
          </label>
          <Textarea
            id="prompt"
            name="prompt"
            rows={4}
            placeholder="Write a short story about..."
            required
            className="w-full"
          />
        </div>
        <SubmitButton />
      </form>

      {result && (
        <div className="mt-4 p-4 border rounded-lg">
          {result.error ? (
            <p className="text-red-600">{result.error}</p>
          ) : (
            <div>
              <h3 className="font-semibold mb-2">Response:</h3>
              <p className="text-gray-700 whitespace-pre-wrap">
                {result.response}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
