import type { Prisma } from "@/generated/prisma/client";

export const articleWithRelations = {
  include: {
    author: { select: { id: true, name: true, image: true } },
    category: { select: { id: true, name: true, slug: true } },
  },
} satisfies Prisma.ArticleDefaultArgs;

export type ArticleWithRelations = Prisma.ArticleGetPayload<
  typeof articleWithRelations
>;

export type ActionState = {
  error?: string;
  fieldErrors?: Partial<Record<string, string[]>>;
  values?: Record<string, string>;
  success?: boolean;
};

const authorSelect = {
  select: { id: true, name: true, image: true },
} satisfies Prisma.UserDefaultArgs;

export const commentWithAuthor = {
  include: { author: authorSelect },
} satisfies Prisma.CommentDefaultArgs;

export type CommentWithAuthor = Prisma.CommentGetPayload<
  typeof commentWithAuthor
>;

export const commentWithReplies = {
  include: {
    author: authorSelect,
    replies: {
      orderBy: { createdAt: "asc" },
      include: { author: authorSelect },
    },
  },
} satisfies Prisma.CommentDefaultArgs;

export type CommentWithReplies = Prisma.CommentGetPayload<
  typeof commentWithReplies
>;

export type ToggleBookmarkResult =
  | { ok: true; bookmarked: boolean }
  | { ok: false; reason: "unauthenticated" | "failed" };