"use client";

import { motion } from "framer-motion";
import { Bookmark } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { toggleBookmarkAction } from "@/actions/bookmark-actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BookmarkButtonProps {
  articleId: string;
  slug: string;
  initialBookmarked: boolean;
  isAuthenticated: boolean;
}

export function BookmarkButton({
  articleId,
  slug,
  initialBookmarked,
  isAuthenticated,
}: BookmarkButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!isAuthenticated) {
      router.push(`/sign-in?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    const next = !bookmarked;
    setBookmarked(next); // optimistic

    startTransition(async () => {
      const result = await toggleBookmarkAction(articleId, slug);

      if (!result.ok) {
        setBookmarked(!next); // roll back
        toast.error("Couldn't update your bookmark. Please try again.");
        return;
      }

      setBookmarked(result.bookmarked);
      toast.success(
        result.bookmarked ? "Saved to your bookmarks" : "Removed from bookmarks",
      );
    });
  }

  return (
    <Button
      type="button"
      size="sm"
      variant={bookmarked ? "default" : "outline"}
      onClick={handleClick}
      disabled={isPending}
      aria-pressed={bookmarked}
    >
      <motion.span
        key={String(bookmarked)}
        initial={{ scale: 0.6 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 18 }}
        className="inline-flex"
      >
        <Bookmark
          className={cn("size-4", bookmarked && "fill-current")}
          aria-hidden="true"
        />
      </motion.span>
      {bookmarked ? "Saved" : "Save"}
    </Button>
  );
}