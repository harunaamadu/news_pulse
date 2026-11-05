"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useState, useTransition } from "react";

import { loadMoreArticlesAction } from "@/actions/pagination-actions";
import { ArticleCard } from "@/components/articles/article-card";
import { Button } from "@/components/ui/button";
import type { ArticleWithRelations } from "@/types";

interface PaginatedArticleGridProps {
  categorySlug: string | null;
  initialItems: ArticleWithRelations[];
  initialCursor: string | null;
}

export function PaginatedArticleGrid({
  categorySlug,
  initialItems,
  initialCursor,
}: PaginatedArticleGridProps) {
  const [items, setItems] = useState(initialItems);
  const [cursor, setCursor] = useState(initialCursor);
  const [failed, setFailed] = useState(false);
  const [isPending, startTransition] = useTransition();

  function loadMore() {
    if (!cursor) return;
    setFailed(false);

    startTransition(async () => {
      const result = await loadMoreArticlesAction(categorySlug, cursor);

      if (!result.ok) {
        setFailed(true);
        return;
      }

      setItems((current) => {
        const seen = new Set(current.map((article) => article.id));
        return [...current, ...result.items.filter((article) => !seen.has(article.id))];
      });
      setCursor(result.nextCursor);
    });
  }

  if (items.length === 0) {
    return (
      <p className="rounded-xl border border-dashed p-10 text-center text-muted-foreground">
        No stories to show yet. Check back soon.
      </p>
    );
  }

  return (
    <div className="space-y-8">
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((article) => (
          <motion.li
            key={article.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <ArticleCard article={article} />
          </motion.li>
        ))}
      </ul>

      <p className="sr-only" aria-live="polite">
        {items.length} stories shown
      </p>

      {failed && (
        <p role="alert" className="text-center text-sm text-destructive">
          Couldn&apos;t load more stories. Please try again.
        </p>
      )}

      {cursor && (
        <div className="flex justify-center">
          <Button
            type="button"
            variant="outline"
            onClick={loadMore}
            disabled={isPending}
          >
            {isPending && <Loader2 className="animate-spin" aria-hidden="true" />}
            {isPending ? "Loading…" : "Load more stories"}
          </Button>
        </div>
      )}
    </div>
  );
}