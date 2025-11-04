import OpenAI from "openai";
import { env } from "@/env.mjs";

export const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

export const MODELS = {
  GPT4: "gpt-4-turbo-preview",
  GPT35: "gpt-3.5-turbo",
  GPT4O: "gpt-4o-mini",
} as const;
