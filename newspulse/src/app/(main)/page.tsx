import { Suspense } from "react";

import { auth } from "@/auth";
import { ArticleGrid } from "@/components/articles/article-grid";
import { FeaturedArticle } from "@/components/articles/featured-article";
import { TrendingList } from "@/components/articles/trending-list";
import { Container } from "@/components/layout/container";
import {
  ForYouSection,
  ForYouSkeleton,
} from "@/components/personalization/for-you-section";
import { Reveal } from "@/components/shared/motion-primitives";
import { SectionHeading } from "@/components/shared/section-heading";
import {
  getFeaturedArticle,
  getLatestArticles,
} from "@/lib/queries/articles";

export default async function HomePage() {
  const [session, featured, latest] = await Promise.all([
    auth(),
    getFeaturedArticle(),
    getLatestArticles(13),
  ]);
  const userId = session?.user?.id;

  const hero = featured ?? latest[0];

  if (!hero) {
    return (
      <Container className="py-24 text-center">
        <h1 className="text-3xl font-semibold">No stories yet</h1>
        <p className="mt-2 text-muted-foreground">
          Run <code className="rounded bg-muted px-1.5 py-0.5">npm run db:seed</code> to add sample content.
        </p>
      </Container>
    );
  }

  const rest = latest.filter((article) => article.id !== hero.id);
  const inTheNews = rest.slice(0, 3);
  const moreStories = rest.slice(3);

  return (
    <Container className="space-y-14 py-8 sm:py-10">
      <Reveal>
        <section aria-label="Top stories" className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <FeaturedArticle article={hero} />
          </div>
          <TrendingList title="In the news" articles={inTheNews} />
        </section>
      </Reveal>

      {userId && (
        <Suspense fallback={<ForYouSkeleton />}>
          <ForYouSection userId={userId} excludeId={hero.id} />
        </Suspense>
      )}

      {moreStories.length > 0 && (
        <section aria-labelledby="latest-heading" className="space-y-6">
          <SectionHeading title="Latest stories" />
          <h2 id="latest-heading" className="sr-only">
            Latest stories
          </h2>
          <ArticleGrid articles={moreStories} />
        </section>
      )}
    </Container>
  );
}