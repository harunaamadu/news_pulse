import { prisma } from "@/lib/prisma";
// import { PrismaClient } from "../src/generated/prisma/client";

// const prisma = new PrismaClient();

const categories = [
  { slug: "world", name: "World" },
  { slug: "technology", name: "Technology" },
  { slug: "business", name: "Business" },
  { slug: "culture", name: "Culture" },
  { slug: "science", name: "Science" },
  { slug: "sports", name: "Sports" },
];

async function main() {
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name },
      create: category,
    });
  }
  console.log(`Seeded ${categories.length} categories.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());