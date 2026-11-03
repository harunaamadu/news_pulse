import { prisma } from "@/lib/prisma";
import { articleWithRelations } from "@/types";

export async function isArticleBookmarked(
  userId: string,
  articleId: string,
): Promise<boolean> {
  const bookmark = await prisma.bookmark.findUnique({
    where: { userId_articleId: { userId, articleId } },
    select: { userId: true },
  });

  return Boolean(bookmark);
}

export async function getUserBookmarks(userId: string) {
  const bookmarks = await prisma.bookmark.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { article: articleWithRelations },
  });

  return bookmarks.map((bookmark) => bookmark.article);
}