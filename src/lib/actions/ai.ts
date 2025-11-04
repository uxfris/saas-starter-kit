"use server";

import { redirect } from "next/navigation";
import { getUser } from "@/lib/services/supabase/server";
import { openai, MODELS } from "@/lib/services/openai/client";
import { prisma } from "@/lib/db/prisma";
import { aiPromptSchema } from "@/lib/validations/ai";

export async function generateCompletion(formData: FormData) {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  const rawData = {
    prompt: formData.get("prompt"),
  };

  const validatedData = aiPromptSchema.safeParse(rawData);

  if (!validatedData.success) {
    return {
      error: "Invalid prompt",
    };
  }

  try {
    const completion = await openai.chat.completions.create({
      model: MODELS.GPT35,
      messages: [
        {
          role: "user",
          content: validatedData.data.prompt,
        },
      ],
      max_tokens: 500,
    });

    const response = completion.choices[0]?.message?.content || "";
    const tokens = completion.usage?.total_tokens || 0;
    const cost = (tokens / 1000) * 0.002; // Approximate cost

    // Log the request
    await prisma.aIRequest.create({
      data: {
        userId: user.id,
        prompt: validatedData.data.prompt,
        response,
        model: MODELS.GPT35,
        tokens,
        cost,
      },
    });

    return {
      success: true,
      response,
      tokens,
    };
  } catch (error) {
    console.error("OpenAI error:", error);
    return {
      error: "Failed to generate completion",
    };
  }
}

export async function getAIHistory() {
  const user = await getUser();

  if (!user) {
    return [];
  }

  const requests = await prisma.aIRequest.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return requests;
}
