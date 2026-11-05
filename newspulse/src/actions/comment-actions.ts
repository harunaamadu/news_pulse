"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { createReplyNotification } from "@/lib/notifications";
import { prisma } from "@/lib/prisma";
import { commentSchema } from "@/lib/validations";
import type { ActionState } from "@/types";

import { checkRateLimit, rateLimitMessage } from "@/lib/rate-limit";

export async function addCommentAction(
  articleId: string,
  parentId: string | null,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return { error: "Sign in to join the discussion." };

  const raw = formData.get("body");
  const body = typeof raw === "string" ? raw : "";

  const limit = await checkRateLimit("comment", userId);
  if (!limit.ok) {
    return { error: rateLimitMessage(limit.retryAfter), values: { body } };
  }

  const parsed = commentSchema.safeParse({ body });
  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors,
      values: { body },
    };
  }

  // Use the slug from the database, never from the client
  const article = await prisma.article.findUnique({
    where: { id: articleId },
    select: { id: true, slug: true, title: true },
  });
  if (!article) {
    return { error: "This story no longer exists.", values: { body } };
  }

  // Keep threads one level deep: replies to a reply attach to its parent
  let threadParentId: string | null = null;
  let replyTargetAuthorId: string | null = null;
  if (parentId) {
    const parent = await prisma.comment.findFirst({
      where: { id: parentId, articleId },
      select: { id: true, parentId: true, authorId: true },
    });
    if (!parent) {
      return {
        error: "The comment you're replying to no longer exists.",
        values: { body },
      };
    }
    threadParentId = parent.parentId ?? parent.id;
    replyTargetAuthorId = parent.authorId;
  }

  try {
    await prisma.comment.create({
      data: {
        body: parsed.data.body,
        articleId,
        authorId: userId,
        parentId: threadParentId,
      },
    });
  } catch {
    return {
      error: "Couldn't post your comment. Please try again.",
      values: { body },
    };
  }

  // Tell the author being replied to (but never notify yourself)
  if (replyTargetAuthorId && replyTargetAuthorId !== userId) {
    await createReplyNotification({
      recipientId: replyTargetAuthorId,
      actorName: session.user.name ?? "Someone",
      articleSlug: article.slug,
      articleTitle: article.title,
      commentBody: parsed.data.body,
    });
  }

  revalidatePath(`/article/${article.slug}`);
  revalidatePath("/discussions");

  return { success: true };
}

export async function deleteCommentAction(
  commentId: string,
): Promise<{ ok: boolean }> {
  const session = await auth();
  const user = session?.user;

  if (!user?.id) return { ok: false };

  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    select: { authorId: true, article: { select: { slug: true } } },
  });
  if (!comment) return { ok: false };

  // Read the role from the database: the token's role can be stale after a demotion
  const actor = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true },
  });
  // Authorization is enforced here, not just in the UI
  const canDelete = comment.authorId === user.id || actor?.role === "ADMIN";
  if (!canDelete) return { ok: false };

  try {
    await prisma.comment.delete({ where: { id: commentId } });
  } catch {
    return { ok: false };
  }

  revalidatePath(`/article/${comment.article.slug}`);
  revalidatePath("/discussions");

  return { ok: true };
}
