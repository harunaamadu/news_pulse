import Link from "next/link";

import { ArticleMeta } from "@/components/articles/article-meta";
import { CategoryBadge } from "@/components/articles/category-badge";
import {
  StaggerGroup,
  StaggerItem,
} from "@/components/shared/motion-primitives";
import type { ArticleWithRelations } from "@/types";

interface TrendingListProps {
  title: string;
  articles: ArticleWithRelations[];
}

export function TrendingList({ title, articles }: TrendingListProps) {
  if (articles.length === 0) return null;

  return (
    <aside aria-labelledby="trending-heading" className="rounded-2xl border bg-card p-6">
      <h2
        id="trending-heading"
        className="border-b-2 border-foreground pb-2 text-xl font-semibold"
      >
        {title}
      </h2>

      <StaggerGroup as="ul" className="mt-2 divide-y">
        {articles.map((article, index) => (
          <StaggerItem
            as="li"
            key={article.id}
            className="group relative flex gap-4 py-4"
          >
            <span
              aria-hidden="true"
              className="w-8 shrink-0 font-serif text-4xl font-bold tabular-nums text-muted-foreground/30 transition-colors group-hover:text-brand"
            >
              {index + 1}
            </span>
            <div className="space-y-1.5">
              <CategoryBadge
                name={article.category.name}
                slug={article.category.slug}
              />
              <h3 className="font-serif text-base font-semibold leading-snug">
                <Link
                  href={`/article/${article.slug}`}
                  className="after:absolute after:inset-0 hover:underline focus-visible:underline focus-visible:outline-none"
                >
                  {article.title}
                </Link>
              </h3>
              <ArticleMeta article={article} />
            </div>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </aside>
  );
}