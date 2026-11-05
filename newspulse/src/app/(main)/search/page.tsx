import { Search, SearchX } from "lucide-react";
import type { Metadata } from "next";

import { ArticleGrid } from "@/components/articles/article-grid";
import { Container } from "@/components/layout/container";
import { EmptyState } from "@/components/shared/empty-state";
import { Reveal } from "@/components/shared/motion-primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { searchArticles } from "@/lib/queries/search";

interface SearchPageProps {
  searchParams: Promise<{ q?: string | string[] }>;
}

function readQuery(value: string | string[] | undefined): string {
  return (typeof value === "string" ? value : "").trim().slice(0, 100);
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const query = readQuery((await searchParams).q);

  return {
    title: query ? `Search: ${query}` : "Search",
    robots: { index: false },
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = readQuery((await searchParams).q);
  const hasQuery = query.length >= 2;
  const articles = hasQuery ? await searchArticles(query, 24) : [];

  return (
    <Container className="space-y-8 py-8 sm:py-10">
      <Reveal>
        <header className="space-y-4 border-b-2 border-foreground pb-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand">
            Search
          </p>
          <h1 className="text-4xl font-bold sm:text-5xl">
            {hasQuery ? <>Results for &ldquo;{query}&rdquo;</> : "Find a story"}
          </h1>

          {/* Plain GET form, so it works without JavaScript */}
          <form action="/search" role="search" className="flex max-w-xl gap-2">
            <label htmlFor="search-q" className="sr-only">
              Search stories
            </label>
            <Input
              id="search-q"
              name="q"
              type="search"
              defaultValue={query}
              placeholder="Search stories, topics…"
              minLength={2}
              maxLength={100}
              required
            />
            <Button type="submit">
              <Search className="size-4" aria-hidden="true" />
              Search
            </Button>
          </form>

          {hasQuery && (
            <p className="text-sm text-muted-foreground" aria-live="polite">
              {articles.length} {articles.length === 1 ? "story" : "stories"} found
            </p>
          )}
        </header>
      </Reveal>

      {!hasQuery ? (
        <EmptyState
          icon={Search}
          title="Search NewsPulse"
          description="Type at least 2 characters to search headlines, summaries and sections."
        />
      ) : articles.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No stories found"
          description="Try a different keyword or browse a section instead."
        />
      ) : (
        <ArticleGrid articles={articles} />
      )}
    </Container>
  );
}