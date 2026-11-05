import { PrismaClient, type Role } from "../src/generated/prisma/client";

const prisma = new PrismaClient();
const roles: Role[] = ["USER", "EDITOR", "ADMIN"];

async function main() {
  const [email, role] = process.argv.slice(2);

  if (!email || !roles.includes(role as Role)) {
    console.error("Usage: npm run user:role -- <email> <USER|EDITOR|ADMIN>");
    process.exit(1);
  }

  const user = await prisma.user.update({
    where: { email: email.toLowerCase() },
    data: { role: role as Role },
    select: { email: true, role: true },
  });

  console.log(`${user.email} is now ${user.role}.`);
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());