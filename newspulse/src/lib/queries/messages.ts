import { prisma } from "@/lib/prisma";

// Open messages first, then handled ones, newest first within each group
export async function getContactMessages(take = 50) {
  return prisma.contactMessage.findMany({
    orderBy: [
      { handledAt: { sort: "asc", nulls: "first" } },
      { createdAt: "desc" },
    ],
    take,
  });
}

export async function getOpenMessageCount() {
  return prisma.contactMessage.count({ where: { handledAt: null } });
}