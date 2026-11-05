import { prisma } from "@/lib/prisma";

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/, "");
}

export async function generateUniqueSlug(title: string): Promise<string> {
  const base = slugify(title) || "story";
  let candidate = base;

  for (let attempt = 0; attempt < 5; attempt++) {
    const existing = await prisma.article.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });
    if (!existing) return candidate;

    candidate = `${base}-${Math.random().toString(36).slice(2, 6)}`;
  }

  return `${base}-${Date.now().toString(36)}`;
}