// import { PrismaClient } from "../src/generated/prisma/client";
import { notifyFollowersOfArticle } from "../src/lib/notifications";

import { prisma } from "@/lib/prisma";

async function main() {
  const articles = await prisma.article.findMany({
    orderBy: { publishedAt: "desc" },
    select: { id: true, slug: true, title: true, categoryId: true, authorId: true },
  });

  for (const article of articles) {
    const count = await notifyFollowersOfArticle(article);
    if (count > 0) {
      console.log(`Notified ${count} follower(s) about "${article.title}".`);
      return;
    }
  }

  console.log("Nothing to notify. Follow a topic on /topics first.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());