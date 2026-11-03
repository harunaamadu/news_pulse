import { prisma } from "@/lib/prisma";
import { articleWithRelations, commentWithReplies } from "@/types";

export async function getCommentsForArticle(articleId: string) {
  return prisma.comment.findMany({
    where: { articleId, parentId: null },
    orderBy: { createdAt: "desc" },
    ...commentWithReplies,
  });
}

export async function getMostDiscussedArticles(take = 8) {
  return prisma.article.findMany({
    where: { comments: { some: {} } },
    orderBy: [{ comments: { _count: "desc" } }, { publishedAt: "desc" }],
    take,
    include: {
      ...articleWithRelations.include,
      _count: { select: { comments: true } },
    },
  });
}

export async function getRecentComments(take = 6) {
  return prisma.comment.findMany({
    orderBy: { createdAt: "desc" },
    take,
    include: {
      author: { select: { id: true, name: true, image: true } },
      article: { select: { title: true, slug: true } },
    },
  });
}