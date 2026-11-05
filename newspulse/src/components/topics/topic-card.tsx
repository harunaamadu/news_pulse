import Link from "next/link";

import { CategoryIcon } from "@/components/topics/category-icon";
import { FollowButton } from "@/components/topics/follow-button";

interface TopicCardProps {
  category: {
    id: string;
    slug: string;
    name: string;
    description: string | null;
    _count: { articles: number; followers: number };
  };
  isFollowing: boolean;
  isAuthenticated: boolean;
}

export function TopicCard({
  category,
  isFollowing,
  isAuthenticated,
}: TopicCardProps) {
  const { articles, followers } = category._count;

  return (
    <div className="group flex h-full flex-col gap-4 rounded-2xl border bg-card p-6 transition-shadow duration-300 hover:shadow-lg">
      <div className="flex size-12 items-center justify-center rounded-xl bg-brand/10 text-brand transition-colors group-hover:bg-brand group-hover:text-white">
        <CategoryIcon slug={category.slug} className="size-6" />
      </div>

      <div className="flex-1 space-y-1.5">
        <h2 className="text-xl font-semibold">
          <Link
            href={`/category/${category.slug}`}
            className="hover:underline focus-visible:underline focus-visible:outline-none"
          >
            {category.name}
          </Link>
        </h2>
        <p className="text-sm text-muted-foreground">
          {category.description ?? `Stories and analysis from ${category.name}.`}
        </p>
      </div>

      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          {articles} {articles === 1 ? "story" : "stories"} · {followers}{" "}
          {followers === 1 ? "follower" : "followers"}
        </p>
        <FollowButton
          categoryId={category.id}
          categoryName={category.name}
          initialFollowing={isFollowing}
          isAuthenticated={isAuthenticated}
        />
      </div>
    </div>
  );
}