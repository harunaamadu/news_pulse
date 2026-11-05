"use client";

import { Loader2 } from "lucide-react";
import { useState, useTransition } from "react";

import { loadMoreCommentsAction } from "@/actions/pagination-actions";
import { CommentItem } from "@/components/comments/comment-item";
import { Button } from "@/components/ui/button";
import type { Role } from "@/generated/prisma/enums";
import type { CommentWithReplies } from "@/types";

interface CommentListProps {
  articleId: string;
  initialComments: CommentWithReplies[];
  initialCursor: string | null;
  currentUser: { id: string; role: Role } | null;
}

export function CommentList({
  articleId,
  initialComments,
  initialCursor,
  currentUser,
}: CommentListProps) {
  const [comments, setComments] = useState(initialComments);
  const [cursor, setCursor] = useState(initialCursor);
  const [failed, setFailed] = useState(false);
  const [isPending, startTransition] = useTransition();

  function loadMore() {
    if (!cursor) return;
    setFailed(false);

    startTransition(async () => {
      const result = await loadMoreCommentsAction(articleId, cursor);

      if (!result.ok) {
        setFailed(true);
        return;
      }

      setComments((current) => {
        const seen = new Set(current.map((comment) => comment.id));
        return [...current, ...result.items.filter((comment) => !seen.has(comment.id))];
      });
      setCursor(result.nextCursor);
    });
  }

  return (
    <div className="space-y-8">
      <ul className="space-y-8">
        {comments.map((comment) => (
          <li key={comment.id}>
            <CommentItem
              comment={comment}
              replies={comment.replies}
              articleId={articleId}
              currentUser={currentUser}
            />
          </li>
        ))}
      </ul>

      {failed && (
        <p role="alert" className="text-center text-sm text-destructive">
          Couldn&apos;t load more comments. Please try again.
        </p>
      )}

      {cursor && (
        <div className="flex justify-center">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={loadMore}
            disabled={isPending}
          >
            {isPending && <Loader2 className="animate-spin" aria-hidden="true" />}
            {isPending ? "Loading…" : "Load more comments"}
          </Button>
        </div>
      )}
    </div>
  );
}