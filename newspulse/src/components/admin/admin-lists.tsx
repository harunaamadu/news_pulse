import { Bookmark, MessageSquare } from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ROLE_LABELS, type TopStory } from "@/lib/admin";
import { formatDate } from "@/lib/format";
import { getInitials } from "@/lib/utils";
import type { Role } from "@/generated/prisma/enums";

export function TopStories({ stories }: { stories: TopStory[] }) {
  if (stories.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No published stories yet.
      </p>
    );
  }

  const max = Math.max(
    1,
    ...stories.map((story) => story.comments + story.bookmarks),
  );

  return (
    <ol className="divide-y">
      {stories.map((story, index) => {
        const score = story.comments + story.bookmarks;

        return (
          <li key={story.id} className="group flex items-center gap-4 py-3">
            <span
              aria-hidden="true"
              className="w-6 shrink-0 font-serif text-2xl font-bold tabular-nums text-muted-foreground/40 transition-colors group-hover:text-brand"
            >
              {index + 1}
            </span>

            <div className="min-w-0 flex-1 space-y-1.5">
              <div className="flex items-baseline justify-between gap-3">
                <Link
                  href={`/article/${story.slug}`}
                  className="truncate font-serif text-sm font-semibold hover:underline"
                >
                  {story.title}
                </Link>
                <span className="hidden shrink-0 text-xs text-muted-foreground sm:block">
                  {story.category}
                </span>
              </div>

              <div
                className="h-1.5 overflow-hidden rounded-full bg-muted"
                role="presentation"
              >
                <div
                  className="h-full rounded-full bg-brand transition-[width] duration-700"
                  style={{ width: `${Math.max(4, (score / max) * 100)}%` }}
                />
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-3 text-xs tabular-nums text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <MessageSquare className="size-3.5" aria-hidden="true" />
                {story.comments}
                <span className="sr-only">comments</span>
              </span>
              <span className="inline-flex items-center gap-1">
                <Bookmark className="size-3.5" aria-hidden="true" />
                {story.bookmarks}
                <span className="sr-only">bookmarks</span>
              </span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

interface RecentSignupsProps {
  users: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    role: Role;
    createdAt: Date;
  }[];
}

export function RecentSignups({ users }: RecentSignupsProps) {
  if (users.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No members yet.
      </p>
    );
  }

  return (
    <ul className="divide-y">
      {users.map((user) => (
        <li key={user.id} className="flex items-center gap-3 py-3">
          <Avatar className="size-9">
            <AvatarImage src={user.image ?? undefined} alt="" />
            <AvatarFallback className="text-xs font-medium">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">
              {user.name ?? "Unnamed"}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {formatDate(user.createdAt)}
            </p>
          </div>
          {user.role !== "USER" && (
            <Badge variant="secondary">{ROLE_LABELS[user.role]}</Badge>
          )}
        </li>
      ))}
    </ul>
  );
}