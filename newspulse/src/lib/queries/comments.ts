import { prisma } from "@/lib/prisma";
import { articleWithRelations, commentWithReplies } from "@/types";

export const COMMENTS_PAGE_SIZE = 10;

export async function getCommentsPage(
  articleId: string,
  cursor?: string,
  take = COMMENTS_PAGE_SIZE,
) {
  const rows = await prisma.comment.findMany({
    where: { articleId, parentId: null, article: { status: "PUBLISHED" } },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take: take + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    ...commentWithReplies,
  });

  const hasMore = rows.length > take;
  const items = hasMore ? rows.slice(0, take) : rows;

  return { items, nextCursor: hasMore ? items[items.length - 1].id : null };
}

// Counts replies too, so the heading matches what readers see
export async function getCommentCount(articleId: string) {
  return prisma.comment.count({ where: { articleId } });
}

export async function getMostDiscussedArticles(take = 8) {
  return prisma.article.findMany({
    where: { status: "PUBLISHED", comments: { some: {} } },
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
    where: { article: { status: "PUBLISHED" } },
    orderBy: { createdAt: "desc" },
    take,
    include: {
      author: { select: { id: true, name: true, image: true } },
      article: { select: { title: true, slug: true } },
    },
  });
}
