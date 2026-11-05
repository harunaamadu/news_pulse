import { MessageSquare } from "lucide-react";
import Link from "next/link";

import { auth } from "@/auth";
import { CommentForm } from "@/components/comments/comment-form";
import { CommentList } from "@/components/comments/comment-list";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getCommentCount, getCommentsPage } from "@/lib/queries/comments";

interface CommentSectionProps {
  articleId: string;
  slug: string;
}

export async function CommentSection({ articleId, slug }: CommentSectionProps) {
  const [session, page, total] = await Promise.all([
    auth(),
    getCommentsPage(articleId),
    getCommentCount(articleId),
  ]);

  const user = session?.user;
  const currentUser = user?.id ? { id: user.id, role: user.role } : null;
  const signInHref = `/sign-in?callbackUrl=${encodeURIComponent(`/article/${slug}`)}`;

  return (
    <section
      id="comments"
      aria-labelledby="comments-heading"
      className="scroll-mt-32 space-y-8 border-t pt-10"
    >
      <h2 id="comments-heading" className="text-2xl font-semibold">
        Discussion <span className="text-muted-foreground">({total})</span>
      </h2>

      {currentUser ? (
        <CommentForm articleId={articleId} />
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-xl border bg-muted/30 p-6 text-center">
          <p className="text-sm text-muted-foreground">
            Join the conversation. Sign in to comment on this story.
          </p>
          <div className="flex gap-2">
            <Button size="sm" asChild>
              <Link href={signInHref}>Sign in</Link>
            </Button>
            <Button size="sm" variant="outline" asChild>
              <Link href="/sign-up">Create account</Link>
            </Button>
          </div>
        </div>
      )}

      {page.items.length === 0 ? (
        <p className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
          <MessageSquare className="size-4" aria-hidden="true" />
          No comments yet. Start the conversation.
        </p>
      ) : (
        // key resets loaded pages whenever a comment is added or removed
        <CommentList
          key={`${total}:${page.items[0].id}`}
          articleId={articleId}
          initialComments={page.items}
          initialCursor={page.nextCursor}
          currentUser={currentUser}
        />
      )}
    </section>
  );
}

export function CommentsSkeleton() {
  return (
    <div className="space-y-6 border-t pt-10" aria-busy="true">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-28 w-full rounded-xl" />
      {Array.from({ length: 2 }).map((_, index) => (
        <div key={index} className="flex gap-3">
          <Skeleton className="size-10 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}