"use server";

import { revalidatePath } from "next/cache";
import { notifyAdminsOfContactMessage } from "@/lib/notifications";

import { prisma } from "@/lib/prisma";
import {
  checkRateLimit,
  getClientIp,
  rateLimitMessage,
} from "@/lib/rate-limit";
import { contactSchema } from "@/lib/validations";
import type { ActionState } from "@/types";

function readString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export async function submitContactAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  // Honeypot: real people never see this field. Bots that fill it get a
  // success screen, so they learn nothing about why they were dropped.
  if (readString(formData, "website") !== "") return { success: true };

  const raw = {
    name: readString(formData, "name"),
    email: readString(formData, "email"),
    topic: readString(formData, "topic"),
    message: readString(formData, "message"),
  };

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors, values: raw };
  }

  const limit = await checkRateLimit("contact", await getClientIp());
  if (!limit.ok) {
    return { error: rateLimitMessage(limit.retryAfter), values: raw };
  }

  let created: { id: string };

  try {
    created = await prisma.contactMessage.create({
      data: parsed.data,
      select: { id: true },
    });
  } catch {
    return {
      error: "Couldn't send your message. Please try again in a moment.",
      values: raw,
    };
  }

  await notifyAdminsOfContactMessage({
    id: created.id,
    name: parsed.data.name,
    topic: parsed.data.topic,
    message: parsed.data.message,
  });

  revalidatePath("/admin/messages");
  return { success: true };
}
