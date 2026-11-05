import { prisma } from "@/lib/prisma";

function truncate(text: string, max: number): string {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length > max ? `${clean.slice(0, max - 1)}…` : clean;
}

interface ReplyNotificationInput {
  recipientId: string;
  actorName: string;
  articleSlug: string;
  articleTitle: string;
  commentBody: string;
}

// Never throws: a failed notification must not fail the comment itself
export async function createReplyNotification(input: ReplyNotificationInput) {
  try {
    await prisma.notification.create({
      data: {
        userId: input.recipientId,
        type: "COMMENT_REPLY",
        title: `${input.actorName} replied to your comment`,
        body: `On “${input.articleTitle}”: ${truncate(input.commentBody, 100)}`,
        href: `/article/${input.articleSlug}#comments`,
      },
    });
  } catch (error) {
    console.error("Failed to create reply notification", error);
  }
}

interface ArticleNotificationInput {
  id: string;
  slug: string;
  title: string;
  categoryId: string;
  authorId: string;
}

// Returns how many notifications were created. Safe to call twice.
export async function notifyFollowersOfArticle(
  article: ArticleNotificationInput,
): Promise<number> {
  const followers = await prisma.categoryFollow.findMany({
    where: {
      categoryId: article.categoryId,
      userId: { not: article.authorId },
    },
    select: { userId: true },
  });

  if (followers.length === 0) return 0;

  const { count } = await prisma.notification.createMany({
    data: followers.map(({ userId }) => ({
      userId,
      type: "NEW_ARTICLE" as const,
      title: "New story from a topic you follow",
      body: article.title,
      href: `/article/${article.slug}`,
      dedupeKey: `article:${article.id}`,
    })),
    skipDuplicates: true,
  });

  return count;
}