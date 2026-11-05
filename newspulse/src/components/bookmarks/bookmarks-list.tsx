"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Bookmark, X } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { toggleBookmarkAction } from "@/actions/bookmark-actions";
import { ArticleCard } from "@/components/articles/article-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import type { ArticleWithRelations } from "@/types";

export function BookmarksList({ articles }: { articles: ArticleWithRelations[] }) {
  const [items, setItems] = useState(articles);
  const [, startTransition] = useTransition();

  function handleRemove(article: ArticleWithRelations) {
    const previous = items;
    setItems((current) => current.filter((item) => item.id !== article.id));

    startTransition(async () => {
      const result = await toggleBookmarkAction(article.id, article.slug);

      if (!result.ok || result.bookmarked) {
        setItems(previous); // roll back
        toast.error("Couldn't remove that bookmark. Please try again.");
        return;
      }

      toast.success("Removed from bookmarks");
    });
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={Bookmark}
        title="Nothing saved yet"
        description="Tap Save on any story to keep it here for later."
      >
        <Button asChild className="mt-2">
          <Link href="/">Browse stories</Link>
        </Button>
      </EmptyState>
    );
  }

  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <AnimatePresence mode="popLayout">
        {items.map((article) => (
          <motion.li
            key={article.id}
            layout
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.25 }}
            className="relative"
          >
            <ArticleCard article={article} />
            <Button
              type="button"
              variant="secondary"
              size="icon"
              onClick={() => handleRemove(article)}
              aria-label={`Remove "${article.title}" from bookmarks`}
              className="absolute right-3 top-3 z-20 size-8 rounded-full bg-background/90 shadow supports-backdrop-filter:backdrop-blur backdrop-blur"
            >
              <X className="size-4" aria-hidden="true" />
            </Button>
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}