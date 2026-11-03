import { MessageSquare } from "lucide-react";
import Link from "next/link";

import { ArticleMeta } from "@/components/articles/article-meta";
import { CategoryBadge } from "@/components/articles/category-badge";
import {
  StaggerGroup,
  StaggerItem,
} from "@/components/shared/motion-primitives";
import type { getMostDiscussedArticles } from "@/lib/queries/comments";

type DiscussedArticle = Awaited<
  ReturnType<typeof getMostDiscussedArticles>
>[number];

export function DiscussionList({ articles }: { articles: DiscussedArticle[] }) {
  return (
    <StaggerGroup as="ul" className="divide-y overflow-hidden rounded-2xl border bg-card">
      {articles.map((article, index) => (
        <StaggerItem
          as="li"
          key={article.id}
          className="group relative flex items-start gap-4 p-5 transition-colors hover:bg-muted/40"
        >
          <span
            aria-hidden="true"
            className="w-8 shrink-0 font-serif text-4xl font-bold tabular-nums text-muted-foreground/30 transition-colors group-hover:text-brand"
          >
            {index + 1}
          </span>

          <div className="min-w-0 flex-1 space-y-1.5">
            <CategoryBadge
              name={article.category.name}
              slug={article.category.slug}
            />
            <h3 className="font-serif text-lg font-semibold leading-snug">
              <Link
                href={`/article/${article.slug}#comments`}
                className="after:absolute after:inset-0 hover:underline focus-visible:underline focus-visible:outline-none"
              >
                {article.title}
              </Link>
            </h3>
            <ArticleMeta article={article} />
          </div>

          <div className="flex shrink-0 items-center gap-1.5 text-sm font-medium text-muted-foreground">
            <MessageSquare className="size-4" aria-hidden="true" />
            {article._count.comments}
            <span className="sr-only">comments</span>
          </div>
        </StaggerItem>
      ))}
    </StaggerGroup>
  );
}