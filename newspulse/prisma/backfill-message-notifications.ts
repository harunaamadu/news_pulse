import { prisma } from "@/lib/prisma";
import { notifyAdminsOfContactMessage } from "../src/lib/notifications";
// import { PrismaClient } from "../src/generated/prisma/client";

// const prisma = new PrismaClient();

async function main() {
  const open = await prisma.contactMessage.findMany({
    where: { handledAt: null },
    orderBy: { createdAt: "asc" },
  });

  for (const message of open) {
    // dedupeKey makes this safe to run more than once
    await notifyAdminsOfContactMessage(message);
  }

  console.log(`Processed ${open.length} open message(s).`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());