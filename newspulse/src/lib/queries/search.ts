import { prisma } from "@/lib/prisma";
import { articleWithRelations } from "@/types";

export async function searchArticles(query: string, take = 20) {
  return prisma.article.findMany({
    where: {
      status: "PUBLISHED",
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { excerpt: { contains: query, mode: "insensitive" } },
        { category: { name: { contains: query, mode: "insensitive" } } },
      ],
    },
    orderBy: { publishedAt: "desc" },
    take,
    ...articleWithRelations,
  });
}
