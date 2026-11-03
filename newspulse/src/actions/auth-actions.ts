"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";

import { signIn, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { signInSchema, signUpSchema } from "@/lib/validations";
import type { ActionState } from "@/types";

function readString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export async function signInAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const raw = {
    email: readString(formData, "email"),
    password: readString(formData, "password"),
  };

  const parsed = signInSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors,
      values: { email: raw.email },
    };
  }

  try {
    await signIn("credentials", {
      ...parsed.data,
      redirectTo: readString(formData, "callbackUrl") || "/",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        error:
          error.type === "CredentialsSignin"
            ? "Invalid email or password."
            : "Something went wrong. Please try again.",
        values: { email: parsed.data.email },
      };
    }
    throw error; // lets Next.js handle the success redirect
  }

  return {};
}

export async function signUpAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const raw = {
    name: readString(formData, "name"),
    email: readString(formData, "email"),
    password: readString(formData, "password"),
  };

  const parsed = signUpSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors,
      values: { name: raw.name, email: raw.email },
    };
  }

  const { name, email, password } = parsed.data;
  const values = { name, email };

  const existing = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });
  if (existing) {
    return {
      fieldErrors: { email: ["An account with this email already exists."] },
      values,
    };
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.create({ data: { name, email, passwordHash } });

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: readString(formData, "callbackUrl") || "/",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Account created. Please sign in.", values };
    }
    throw error;
  }

  return {};
}

export async function oauthSignInAction(
  provider: "github" | "google",
  callbackUrl?: string,
): Promise<void> {
  await signIn(provider, { redirectTo: callbackUrl || "/" });
}

export async function signOutAction(): Promise<void> {
  await signOut({ redirectTo: "/" });
}