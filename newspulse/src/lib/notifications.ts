import { prisma } from "@/lib/prisma";
import { topicLabel } from "@/lib/contact";

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

interface ContactNotificationInput {
  id: string;
  name: string;
  topic: string;
  message: string;
}

export async function notifyAdminsOfContactMessage(
  input: ContactNotificationInput,
): Promise<void> {
  try {
    const admins = await prisma.user.findMany({
      where: { role: "ADMIN" },
      select: { id: true },
    });
    if (admins.length === 0) return;

    await prisma.notification.createMany({
      data: admins.map(({ id }) => ({
        userId: id,
        type: "CONTACT_MESSAGE" as const,
        title: `New message from ${input.name}`,
        body: `${topicLabel(input.topic)}: ${truncate(input.message, 100)}`,
        href: "/admin/messages",
        dedupeKey: `contact:${input.id}`,
      })),
      skipDuplicates: true,
    });
  } catch (error) {
    console.error("Failed to notify admins of contact message", error);
  }
}