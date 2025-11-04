import { z } from "zod";

export const aiPromptSchema = z.object({
  prompt: z.string().min(1, "Prompt is required").max(1000, "Prompt too long"),
});

export type AIPromptInput = z.infer<typeof aiPromptSchema>;
