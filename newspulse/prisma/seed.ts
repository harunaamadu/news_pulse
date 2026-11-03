import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient();

const categories = [
  { slug: "world", name: "World" },
  { slug: "technology", name: "Technology" },
  { slug: "business", name: "Business" },
  { slug: "culture", name: "Culture" },
  { slug: "science", name: "Science" },
  { slug: "sports", name: "Sports" },
];

const articles = [
  {
    slug: "cities-rethink-public-transport",
    title: "Cities Rethink Public Transport After a Decade of Gridlock",
    excerpt:
      "From bus-only lanes to fare-free pilots, urban planners are testing bold ideas to move people faster.",
    category: "world",
    featured: true,
    readTimeMinutes: 7,
  },
  {
    slug: "the-quiet-rise-of-on-device-ai",
    title: "The Quiet Rise of On-Device AI",
    excerpt:
      "Smaller models running locally are changing what phones and laptops can do without a connection.",
    category: "technology",
    featured: false,
    readTimeMinutes: 6,
  },
  {
    slug: "small-businesses-adapt-to-new-payments",
    title: "Small Businesses Adapt to a New Wave of Digital Payments",
    excerpt:
      "Mobile money and instant transfers are reshaping how local shops get paid, and how they grow.",
    category: "business",
    featured: false,
    readTimeMinutes: 5,
  },
  {
    slug: "why-live-music-is-booming-again",
    title: "Why Live Music Is Booming Again",
    excerpt:
      "Festivals and intimate venues are thriving as audiences chase shared, unfiltered experiences.",
    category: "culture",
    featured: false,
    readTimeMinutes: 4,
  },
  {
    slug: "inside-the-race-for-better-batteries",
    title: "Inside the Race for Better Batteries",
    excerpt:
      "Researchers are chasing denser, cheaper and safer storage, and the finish line keeps moving.",
    category: "science",
    featured: false,
    readTimeMinutes: 8,
  },
  {
    slug: "grassroots-football-finds-its-voice",
    title: "Grassroots Football Finds Its Voice",
    excerpt:
      "Community clubs are building pathways for young players, and rewriting who gets scouted.",
    category: "sports",
    featured: false,
    readTimeMinutes: 5,
  },
];

const placeholderBody = (
  _title: string,
) => `This is placeholder article content for development. Replace it with real
editorial copy or connect a CMS later.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat
a ante venenatis dapibus posuere velit aliquet. Maecenas faucibus mollis
interdum.

### Key takeaways

- Readers want clear, trustworthy reporting.
- Context matters as much as the headline.
- Good design makes long reads feel effortless.
`;

async function main() {
  const author = await prisma.user.upsert({
    where: { email: "editor@newspulse.dev" },
    update: { content: placeholderBody(article.title) },
    create: {
      email: "editor@newspulse.dev",
      name: "NewsPulse Editorial",
      role: "EDITOR",
    },
  });

  const categoryIds = new Map<string, string>();
  for (const category of categories) {
    const record = await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name },
      create: category,
    });
    categoryIds.set(category.slug, record.id);
  }

  for (const [index, article] of articles.entries()) {
    const categoryId = categoryIds.get(article.category);
    if (!categoryId) continue;

    await prisma.article.upsert({
      where: { slug: article.slug },
      update: {},
      create: {
        slug: article.slug,
        title: article.title,
        excerpt: article.excerpt,
        content: placeholderBody(article.title),
        coverImage: `https://picsum.photos/seed/${article.slug}/1200/800`,
        readTimeMinutes: article.readTimeMinutes,
        featured: article.featured,
        publishedAt: new Date(Date.now() - index * 1000 * 60 * 60 * 6),
        authorId: author.id,
        categoryId,
      },
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
