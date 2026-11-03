import { cache } from "react";

import { prisma } from "@/lib/prisma";
import { articleWithRelations } from "@/types";

export async function getFeaturedArticle() {
  return prisma.article.findFirst({
    where: { featured: true },
    orderBy: { publishedAt: "desc" },
    ...articleWithRelations,
  });
}

export async function getLatestArticles(take = 12) {
  return prisma.article.findMany({
    orderBy: { publishedAt: "desc" },
    take,
    ...articleWithRelations,
  });
}

// cache() dedupes the call between generateMetadata and the page
export const getArticleBySlug = cache(async (slug: string) => {
  return prisma.article.findUnique({
    where: { slug },
    ...articleWithRelations,
  });
});

export async function getArticlesByCategory(slug: string, take = 24) {
  return prisma.article.findMany({
    where: { category: { slug } },
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
    where: { categoryId, id: { not: articleId } },
    orderBy: { publishedAt: "desc" },
    take,
    ...articleWithRelations,
  });

  if (sameCategory.length >= take) return sameCategory;

  // Top up with the latest stories from elsewhere
  const filler = await prisma.article.findMany({
    where: {
      id: { notIn: [articleId, ...sameCategory.map((article) => article.id)] },
    },
    orderBy: { publishedAt: "desc" },
    take: take - sameCategory.length,
    ...articleWithRelations,
  });

  return [...sameCategory, ...filler];
}