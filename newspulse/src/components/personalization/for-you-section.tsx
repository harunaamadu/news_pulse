import { ArticleGrid } from "@/components/articles/article-grid";
import { TopicsPrompt } from "@/components/personalization/topics-prompt";
import { SectionHeading } from "@/components/shared/section-heading";
import { Skeleton } from "@/components/ui/skeleton";
import { getFollowCount, getPersonalizedFeed } from "@/lib/queries/follows";

interface ForYouSectionProps {
  userId: string;
  excludeId?: string;
}

export async function ForYouSection({ userId, excludeId }: ForYouSectionProps) {
  const [followCount, articles] = await Promise.all([
    getFollowCount(userId),
    getPersonalizedFeed(userId, { excludeId, take: 3 }),
  ]);

  if (followCount === 0) return <TopicsPrompt />;

  return (
    <section aria-labelledby="for-you-heading" className="space-y-6">
      <SectionHeading title="For you" href="/topics" linkLabel="Manage topics" />
      <h2 id="for-you-heading" className="sr-only">
        For you
      </h2>

      {articles.length === 0 ? (
        <p className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
          No new stories from your topics yet. Check back soon.
        </p>
      ) : (
        <ArticleGrid articles={articles} />
      )}
    </section>
  );
}

export function ForYouSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true">
      <Skeleton className="h-8 w-40" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-72 rounded-xl" />
        ))}
      </div>
    </div>
  );
}