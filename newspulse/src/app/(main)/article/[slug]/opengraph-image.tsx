import { createOgImage } from "@/lib/og-image";
import { getArticleBySlug } from "@/lib/queries/articles";

export const alt = "NewsPulse story";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  return createOgImage({
    title: article?.title ?? "NewsPulse",
    eyebrow: article?.category.name,
  });
}