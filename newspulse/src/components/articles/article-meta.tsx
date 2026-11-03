import { Clock } from "lucide-react";

import { formatDate, formatReadTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { ArticleWithRelations } from "@/types";

interface ArticleMetaProps {
  article: Pick<ArticleWithRelations, "author" | "publishedAt" | "readTimeMinutes">;
  className?: string;
}

export function ArticleMeta({ article, className }: ArticleMetaProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-muted-foreground",
        className,
      )}
    >
      <span className="font-medium">{article.author.name ?? "NewsPulse"}</span>
      <span aria-hidden="true">·</span>
      <time dateTime={article.publishedAt.toISOString()}>
        {formatDate(article.publishedAt)}
      </time>
      <span aria-hidden="true">·</span>
      <span className="inline-flex items-center gap-1">
        <Clock className="size-3" aria-hidden="true" />
        {formatReadTime(article.readTimeMinutes)}
      </span>
    </div>
  );
}