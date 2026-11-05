import type { Prisma } from "@/generated/prisma/client";
import type { StudioUser } from "@/lib/auth-guards";
import { prisma } from "@/lib/prisma";

// Editors see their own stories, admins see everything
function scopeFor(user: StudioUser): Prisma.ArticleWhereInput {
  return user.role === "ADMIN" ? {} : { authorId: user.id };
}

export async function getStudioArticles(user: StudioUser) {
  return prisma.article.findMany({
    where: scopeFor(user),
    orderBy: { updatedAt: "desc" },
    include: {
      category: { select: { name: true } },
      author: { select: { name: true } },
      _count: { select: { comments: true, bookmarks: true } },
    },
  });
}

export async function getStudioStats(user: StudioUser) {
  const scope = scopeFor(user);

  const [published, drafts, comments, bookmarks] = await Promise.all([
    prisma.article.count({ where: { ...scope, status: "PUBLISHED" } }),
    prisma.article.count({ where: { ...scope, status: "DRAFT" } }),
    prisma.comment.count({ where: { article: scope } }),
    prisma.bookmark.count({ where: { article: scope } }),
  ]);

  return { published, drafts, comments, bookmarks };
}

export async function getArticleForEdit(id: string) {
  return prisma.article.findUnique({
    where: { id },
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      content: true,
      coverImage: true,
      featured: true,
      status: true,
      categoryId: true,
      authorId: true,
    },
  });
}

export async function getCategoryOptions() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });
}