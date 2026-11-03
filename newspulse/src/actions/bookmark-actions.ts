"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { ToggleBookmarkResult } from "@/types";

export async function toggleBookmarkAction(
  articleId: string,
  slug: string,
): Promise<ToggleBookmarkResult> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return { ok: false, reason: "unauthenticated" };

  try {
    // deleteMany never throws on "not found", which keeps double-clicks safe
    const { count } = await prisma.bookmark.deleteMany({
      where: { userId, articleId },
    });
    const bookmarked = count === 0;

    if (bookmarked) {
      await prisma.bookmark.upsert({
        where: { userId_articleId: { userId, articleId } },
        update: {},
        create: { userId, articleId },
      });
    }

    revalidatePath("/bookmarks");
    revalidatePath(`/article/${slug}`);

    return { ok: true, bookmarked };
  } catch {
    return { ok: false, reason: "failed" };
  }
}