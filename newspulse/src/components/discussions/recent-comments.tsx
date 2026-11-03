import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate } from "@/lib/format";
import type { getRecentComments } from "@/lib/queries/comments";
import { getInitials } from "@/lib/utils";

type RecentComment = Awaited<ReturnType<typeof getRecentComments>>[number];

export function RecentComments({ comments }: { comments: RecentComment[] }) {
  if (comments.length === 0) return null;

  return (
    <aside
      aria-labelledby="recent-comments-heading"
      className="rounded-2xl border bg-card p-6"
    >
      <h2
        id="recent-comments-heading"
        className="border-b-2 border-foreground pb-2 text-xl font-semibold"
      >
        Recent comments
      </h2>

      <ul className="mt-2 divide-y">
        {comments.map((comment) => (
          <li key={comment.id} className="flex gap-3 py-4">
            <Avatar className="size-8 shrink-0">
              <AvatarImage src={comment.author.image ?? undefined} alt="" />
              <AvatarFallback className="text-xs font-medium">
                {getInitials(comment.author.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 space-y-1">
              <p className="text-sm">
                <span className="font-medium">
                  {comment.author.name ?? "Reader"}
                </span>{" "}
                <span className="text-muted-foreground">on</span>{" "}
                <Link
                  href={`/article/${comment.article.slug}#comments`}
                  className="font-serif font-semibold hover:underline"
                >
                  {comment.article.title}
                </Link>
              </p>
              <p className="line-clamp-2 text-sm text-muted-foreground">
                {comment.body}
              </p>
              <time
                dateTime={comment.createdAt.toISOString()}
                className="text-xs text-muted-foreground"
              >
                {formatDate(comment.createdAt)}
              </time>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}