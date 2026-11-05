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
  message?: string;
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

export type ToggleFollowResult =
  | { ok: true; following: boolean }
  | { ok: false; reason: "unauthenticated" | "failed" };

export type SearchResult = {
  id: string;
  slug: string;
  title: string;
  category: string;
};

export type NotificationItem = {
  id: string;
  type: "NEW_ARTICLE" | "COMMENT_REPLY" | "CONTACT_MESSAGE";
  title: string;
  body: string | null;
  href: string;
  createdAt: string; // ISO string, safe to send over JSON
  read: boolean;
};

export type OfflineArticle = {
  slug: string;
  title: string;
  excerpt: string;
  html: string; // server-rendered from Markdown (raw HTML is not passed through)
  category: string;
  author: string;
  publishedAt: string;
  readTimeMinutes: number;
  coverImage: string;
  savedAt: string;
};