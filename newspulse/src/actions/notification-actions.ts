"use server";

import { z } from "zod";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const idSchema = z.string().min(1).max(50);

export async function markNotificationReadAction(
  id: string,
): Promise<{ ok: boolean }> {
  const session = await auth();
  const userId = session?.user?.id;
  const parsed = idSchema.safeParse(id);

  if (!userId || !parsed.success) return { ok: false };

  try {
    // userId in the filter guarantees readers can only touch their own rows
    await prisma.notification.updateMany({
      where: { id: parsed.data, userId, readAt: null },
      data: { readAt: new Date() },
    });
    return { ok: true };
  } catch {
    return { ok: false };
  }
}

export async function markAllNotificationsReadAction(): Promise<{
  ok: boolean;
}> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return { ok: false };

  try {
    await prisma.notification.updateMany({
      where: { userId, readAt: null },
      data: { readAt: new Date() },
    });
    return { ok: true };
  } catch {
    return { ok: false };
  }
}
