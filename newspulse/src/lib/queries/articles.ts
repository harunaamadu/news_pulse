import { cache } from "react";

import { prisma } from "@/lib/prisma";
import { articleWithRelations } from "@/types";

const published = { status: "PUBLISHED" } as const;

export async function getFeaturedArticle() {
  return prisma.article.findFirst({
    where: { ...published, featured: true },
    orderBy: { publishedAt: "desc" },
    ...articleWithRelations,
  });
}

export async function getLatestArticles(take = 12) {
  return prisma.article.findMany({
    where: published,
    orderBy: { publishedAt: "desc" },
    take,
    ...articleWithRelations,
  });
}

// cache() dedupes the call between generateMetadata and the page
export const getArticleBySlug = cache(async (slug: string) => {
  return prisma.article.findFirst({
    where: { ...published, slug },
    ...articleWithRelations,
  });
});

export async function getArticlesByCategory(slug: string, take = 24) {
  return prisma.article.findMany({
    where: { ...published, category: { slug } },
    orderBy: { publishedAt: "desc" },
    take,
    ...articleWithRelations,
  });
}

export async function getRelatedArticles(
  articleId: string,
  categoryId: string,
  take = 3,
) {
  const sameCategory = await prisma.article.findMany({
    where: { ...published, categoryId, id: { not: articleId } },
    orderBy: { publishedAt: "desc" },
    take,
    ...articleWithRelations,
  });

  if (sameCategory.length >= take) return sameCategory;

  // Top up with the latest stories from elsewhere
  const filler = await prisma.article.findMany({
    where: {
      ...published,
      id: { notIn: [articleId, ...sameCategory.map((article) => article.id)] },
    },
    orderBy: { publishedAt: "desc" },
    take: take - sameCategory.length,
    ...articleWithRelations,
  });

  return [...sameCategory, ...filler];
}

export const PAGE_SIZE = 12;

interface ArticlesPageOptions {
  categorySlug?: string;
  cursor?: string;
  take?: number;
}

export async function getArticlesPage({
  categorySlug,
  cursor,
  take = PAGE_SIZE,
}: ArticlesPageOptions = {}) {
  // Fetch one extra row to learn whether another page exists
  const rows = await prisma.article.findMany({
    where: {
      ...published,
      ...(categorySlug ? { category: { slug: categorySlug } } : {}),
    },
    // id is the tiebreaker, so identical timestamps can't skip or repeat rows
    orderBy: [{ publishedAt: "desc" }, { id: "desc" }],
    take: take + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    ...articleWithRelations,
  });

  const hasMore = rows.length > take;
  const items = hasMore ? rows.slice(0, take) : rows;

  return { items, nextCursor: hasMore ? items[items.length - 1].id : null };
}

export async function countPublishedArticles(categorySlug?: string) {
  return prisma.article.count({
    where: {
      ...published,
      ...(categorySlug ? { category: { slug: categorySlug } } : {}),
    },
  });
}