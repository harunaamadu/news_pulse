import { prisma } from "@/lib/prisma";
import { articleWithRelations } from "@/types";

export async function getFollowedCategoryIds(
  userId: string,
): Promise<string[]> {
  const rows = await prisma.categoryFollow.findMany({
    where: { userId },
    select: { categoryId: true },
  });

  return rows.map((row) => row.categoryId);
}

export async function isFollowingCategory(
  userId: string,
  categoryId: string,
): Promise<boolean> {
  const follow = await prisma.categoryFollow.findUnique({
    where: { userId_categoryId: { userId, categoryId } },
    select: { userId: true },
  });

  return Boolean(follow);
}

export async function getFollowCount(userId: string): Promise<number> {
  return prisma.categoryFollow.count({ where: { userId } });
}

interface FeedOptions {
  excludeId?: string;
  take?: number;
}

export async function getPersonalizedFeed(
  userId: string,
  { excludeId, take = 3 }: FeedOptions = {},
) {
  return prisma.article.findMany({
    where: {
      status: "PUBLISHED",
      category: { followers: { some: { userId } } },
      ...(excludeId ? { id: { not: excludeId } } : {}),
    },
    orderBy: { publishedAt: "desc" },
    take,
    ...articleWithRelations,
  });
}

export async function getCategoriesWithCounts() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: {
          articles: { where: { status: "PUBLISHED" } },
          followers: true,
        },
      },
    },
  });
}
