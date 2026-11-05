import { NextResponse } from "next/server";
import { z } from "zod";

import { searchArticles } from "@/lib/queries/search";
import type { SearchResult } from "@/types";

import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const querySchema = z.string().trim().min(2).max(100);

export async function GET(request: Request) {
  const limit = await checkRateLimit("search", await getClientIp());
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  const { searchParams } = new URL(request.url);
  const parsed = querySchema.safeParse(searchParams.get("q") ?? "");

  if (!parsed.success) {
    return NextResponse.json({ results: [] satisfies SearchResult[] });
  }

  try {
    const articles = await searchArticles(parsed.data, 6);

    const results: SearchResult[] = articles.map((article) => ({
      id: article.id,
      slug: article.slug,
      title: article.title,
      category: article.category.name,
    }));

    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
