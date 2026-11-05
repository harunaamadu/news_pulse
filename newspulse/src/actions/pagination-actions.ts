"use server";

import { z } from "zod";

import { getArticlesPage } from "@/lib/queries/articles";
import { getCommentsPage } from "@/lib/queries/comments";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import type { ArticleWithRelations, CommentWithReplies } from "@/types";

const idSchema = z.string().min(1).max(50);
const slugSchema = z.string().min(1).max(80);

export type LoadMoreArticlesResult =
  | { ok: true; items: ArticleWithRelations[]; nextCursor: string | null }
  | { ok: false };

export type LoadMoreCommentsResult =
  | { ok: true; items: CommentWithReplies[]; nextCursor: string | null }
  | { ok: false };

export async function loadMoreArticlesAction(
  categorySlug: string | null,
  cursor: string,
): Promise<LoadMoreArticlesResult> {
  const parsedCursor = idSchema.safeParse(cursor);
  const parsedSlug = categorySlug === null ? null : slugSchema.safeParse(categorySlug);

  if (!parsedCursor.success || (parsedSlug && !parsedSlug.success)) {
    return { ok: false };
  }

  const limit = await checkRateLimit("browse", await getClientIp());
  if (!limit.ok) return { ok: false };

  try {
    const page = await getArticlesPage({
      cursor: parsedCursor.data,
      categorySlug: parsedSlug?.success ? parsedSlug.data : undefined,
    });
    return { ok: true, ...page };
  } catch {
    return { ok: false };
  }
}

export async function loadMoreCommentsAction(
  articleId: string,
  cursor: string,
): Promise<LoadMoreCommentsResult> {
  const parsedArticle = idSchema.safeParse(articleId);
  const parsedCursor = idSchema.safeParse(cursor);

  if (!parsedArticle.success || !parsedCursor.success) return { ok: false };

  const limit = await checkRateLimit("browse", await getClientIp());
  if (!limit.ok) return { ok: false };

  try {
    const page = await getCommentsPage(parsedArticle.data, parsedCursor.data);
    return { ok: true, ...page };
  } catch {
    return { ok: false };
  }
}