import { PrismaClient } from "../src/generated/prisma/client";
import { notifyAdminsOfContactMessage } from "../src/lib/notifications";

const prisma = new PrismaClient();

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