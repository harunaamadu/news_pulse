"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { ToggleFollowResult } from "@/types";

export async function toggleFollowCategoryAction(
  categoryId: string,
): Promise<ToggleFollowResult> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return { ok: false, reason: "unauthenticated" };

  try {
    // Look the slug up server-side instead of trusting the client
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      select: { slug: true },
    });
    if (!category) return { ok: false, reason: "failed" };

    const { count } = await prisma.categoryFollow.deleteMany({
      where: { userId, categoryId },
    });
    const following = count === 0;

    if (following) {
      await prisma.categoryFollow.upsert({
        where: { userId_categoryId: { userId, categoryId } },
        update: {},
        create: { userId, categoryId },
      });
    }

    revalidatePath("/");
    revalidatePath("/topics");
    revalidatePath(`/category/${category.slug}`);

    return { ok: true, following };
  } catch {
    return { ok: false, reason: "failed" };
  }
}