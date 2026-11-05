import type { Metadata } from "next";

import { auth } from "@/auth";
import { Container } from "@/components/layout/container";
import {
  Reveal,
  StaggerGroup,
  StaggerItem,
} from "@/components/shared/motion-primitives";
import { TopicCard } from "@/components/topics/topic-card";
import {
  getCategoriesWithCounts,
  getFollowedCategoryIds,
} from "@/lib/queries/follows";

export const metadata: Metadata = {
  title: "Topics",
  description: "Follow the topics you care about to personalize your feed.",
};

export default async function TopicsPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const [categories, followedIds] = await Promise.all([
    getCategoriesWithCounts(),
    userId ? getFollowedCategoryIds(userId) : Promise.resolve([] as string[]),
  ]);
  const followed = new Set(followedIds);

  return (
    <Container className="space-y-8 py-8 sm:py-10">
      <Reveal>
        <header className="space-y-3 border-b-2 border-foreground pb-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand">
            Personalize
          </p>
          <h1 className="text-4xl font-bold sm:text-5xl">Choose your topics</h1>
          <p className="max-w-2xl text-muted-foreground">
            Follow the sections you care about and they&apos;ll appear in your
            &ldquo;For you&rdquo; feed on the home page.
          </p>
        </header>
      </Reveal>

      <StaggerGroup
        as="ul"
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {categories.map((category) => (
          <StaggerItem as="li" key={category.id}>
            <TopicCard
              category={category}
              isFollowing={followed.has(category.id)}
              isAuthenticated={Boolean(userId)}
            />
          </StaggerItem>
        ))}
      </StaggerGroup>
    </Container>
  );
}