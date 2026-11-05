import { NextResponse } from "next/server";

import { markdownToHtml } from "@/lib/markdown";
import { getArticleBySlug } from "@/lib/queries/articles";
import type { OfflineArticle } from "@/types";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  try {
    const article = await getArticleBySlug(slug);

    if (!article) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const html = await markdownToHtml(article.content);

    const payload: Omit<OfflineArticle, "savedAt"> = {
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      html,
      category: article.category.name,
      author: article.author.name ?? "NewsPulse",
      publishedAt: article.publishedAt.toISOString(),
      readTimeMinutes: article.readTimeMinutes,
      coverImage: article.coverImage,
    };

    return NextResponse.json(payload);
  } catch {
    return NextResponse.json({ error: "Failed to load" }, { status: 500 });
  }
}