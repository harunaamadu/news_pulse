import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { auth } from "@/auth";
import { PaginatedArticleGrid } from "@/components/articles/paginated-article-grid";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/shared/motion-primitives";
import { FollowButton } from "@/components/topics/follow-button";
import {
  countPublishedArticles,
  getArticlesPage,
} from "@/lib/queries/articles";
import { getCategoryBySlug } from "@/lib/queries/categories";
import { isFollowingCategory } from "@/lib/queries/follows";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

function describe(name: string, description: string | null) {
  return description ?? `The latest ${name} stories from NewsPulse.`;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) return { title: "Section not found" };

  return {
    title: category.name,
    description: describe(category.name, category.description),
    alternates: { canonical: `/category/${category.slug}` },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) notFound();

  const session = await auth();
  const userId = session?.user?.id;

  const [page, total, following] = await Promise.all([
    getArticlesPage({ categorySlug: slug }),
    countPublishedArticles(slug),
    userId ? isFollowingCategory(userId, category.id) : Promise.resolve(false),
  ]);

  return (
    <Container className="space-y-8 py-8 sm:py-10">
      <Reveal>
        <header className="space-y-3 border-b-2 border-foreground pb-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand">
            Section
          </p>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h1 className="text-4xl font-bold sm:text-5xl">{category.name}</h1>
            <FollowButton
              categoryId={category.id}
              categoryName={category.name}
              initialFollowing={following}
              isAuthenticated={Boolean(userId)}
              size="default"
            />
          </div>
          <p className="max-w-2xl text-muted-foreground">
            {describe(category.name, category.description)}
          </p>
          <p className="text-sm text-muted-foreground">
            {total} {total === 1 ? "story" : "stories"}
          </p>
        </header>
      </Reveal>

      {/* key resets the loaded pages when moving between sections */}
      <PaginatedArticleGrid
        key={slug}
        categorySlug={slug}
        initialItems={page.items}
        initialCursor={page.nextCursor}
      />
    </Container>
  );
}