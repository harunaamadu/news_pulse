import { ArticleCard } from "@/components/articles/article-card";
import {
  StaggerGroup,
  StaggerItem,
} from "@/components/shared/motion-primitives";
import type { ArticleWithRelations } from "@/types";

export function ArticleGrid({ articles }: { articles: ArticleWithRelations[] }) {
  if (articles.length === 0) {
    return (
      <p className="rounded-xl border border-dashed p-10 text-center text-muted-foreground">
        No stories to show yet. Check back soon.
      </p>
    );
  }

  return (
    <StaggerGroup
      as="ul"
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {articles.map((article) => (
        <StaggerItem as="li" key={article.id}>
          <ArticleCard article={article} />
        </StaggerItem>
      ))}
    </StaggerGroup>
  );
}