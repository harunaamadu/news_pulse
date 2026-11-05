import { prisma } from "@/lib/prisma";

export async function getNotifications(userId: string, take = 10) {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take,
  });
}

export async function getUnreadCount(userId: string) {
  return prisma.notification.count({ where: { userId, readAt: null } });
}