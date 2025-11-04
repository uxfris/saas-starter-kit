"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/services/supabase/server";
import { prisma } from "@/lib/db/prisma";
import { loginSchema, signupSchema } from "@/lib/validations/auth";
import { logger } from "../utils/logger";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const validatedData = loginSchema.safeParse(rawData);

  if (!validatedData.success) {
    return {
      error: "Invalid email or password format",
    };
  }

  const { data, error } = await supabase.auth.signInWithPassword(
    validatedData.data
  );

  if (error) {
    return {
      error: error.message,
    };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
    name: formData.get("name"),
  };

  const validatedData = signupSchema.safeParse(rawData);

  if (!validatedData.success) {
    logger.error(
      "Signup validation error:",
      JSON.stringify(validatedData.error)
    );
    return {
      error: validatedData.error.message,
    };
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email: validatedData.data.email,
    },
  });

  if (existingUser) {
    return {
      error: "User already exists",
    };
  }

  const userData = {
    email: validatedData.data.email,
    password: validatedData.data.password,
    options: {
      data: {
        name: validatedData.data.name,
      },
    },
  };

  logger.info("User data:", JSON.stringify(userData));

  const { data, error } = await supabase.auth.signUp(userData);

  if (error) {
    logger.error("Signup error:", JSON.stringify(error));
    return {
      error: error.message,
    };
  }

  // Create user in database
  if (data.user) {
    await prisma.user.create({
      data: {
        id: data.user.id,
        email: data.user.email!,
        name: validatedData.data.name,
      },
    });
    revalidatePath("/", "layout");
    redirect("/dashboard");
  }
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
