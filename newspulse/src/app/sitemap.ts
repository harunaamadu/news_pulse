import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";
import { prisma } from "@/lib/prisma";

// Rebuilt at most once an hour
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;

  const [categories, articles] = await Promise.all([
    prisma.category.findMany({ select: { slug: true } }),
    prisma.article.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      take: 5000, // well under the 50,000-URL sitemap limit
      select: { slug: true, updatedAt: true },
    }),
  ]);

  return [
    { url: base, changeFrequency: "hourly", priority: 1 },
    { url: `${base}/topics`, changeFrequency: "weekly", priority: 0.5 },
    { url: `${base}/discussions`, changeFrequency: "daily", priority: 0.5 },
    ...categories.map((category) => ({
      url: `${base}/category/${category.slug}`,
      changeFrequency: "daily" as const,
      priority: 0.7,
    })),
    ...articles.map((article) => ({
      url: `${base}/article/${article.slug}`,
      lastModified: article.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}