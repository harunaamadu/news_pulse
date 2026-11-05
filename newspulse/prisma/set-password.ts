import bcrypt from "bcryptjs";

import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient();

async function main() {
  const [email, password] = process.argv.slice(2);

  if (!email || !password) {
    console.error("Usage: npm run user:password -- <email> <password>");
    process.exit(1);
  }
  if (password.length < 8 || password.length > 72) {
    console.error("Password must be between 8 and 72 characters.");
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.update({
    where: { email: email.toLowerCase() },
    data: { passwordHash },
    select: { email: true, role: true },
  });

  console.log(`Password set for ${user.email} (role: ${user.role}).`);
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());