import { Newspaper } from "lucide-react";

import { PaginatedArticleGrid } from "@/components/articles/paginated-article-grid";
import { EmptyState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { getArticlesPage } from "@/lib/queries/articles";

export async function FeatureStories({ categorySlug }: { categorySlug: string }) {
  const page = await getArticlesPage({ categorySlug });

  if (page.items.length === 0) {
    return (
      <EmptyState
        icon={Newspaper}
        title="No stories here yet"
        description="New stories will appear here as soon as they are published."
      />
    );
  }

  return (
    <PaginatedArticleGrid
      key={categorySlug}
      categorySlug={categorySlug}
      initialItems={page.items}
      initialCursor={page.nextCursor}
    />
  );
}

export function FeatureStoriesSkeleton() {
  return (
    <div
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      aria-busy="true"
    >
      {Array.from({ length: 3 }).map((_, index) => (
        <Skeleton key={index} className="h-72 rounded-xl" />
      ))}
    </div>
  );
}