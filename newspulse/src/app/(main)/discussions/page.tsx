import { MessageSquare } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { DiscussionList } from "@/components/discussions/discussion-list";
import { RecentComments } from "@/components/discussions/recent-comments";
import { Reveal } from "@/components/shared/motion-primitives";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import {
  getMostDiscussedArticles,
  getRecentComments,
} from "@/lib/queries/comments";

export const metadata: Metadata = {
  title: "Discussions",
  description: "See which stories readers are talking about.",
};

export default async function DiscussionsPage() {
  const [discussed, recent] = await Promise.all([
    getMostDiscussedArticles(),
    getRecentComments(),
  ]);

  return (
    <Container className="space-y-8 py-8 sm:py-10">
      <Reveal>
        <header className="space-y-3 border-b-2 border-foreground pb-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand">
            Community
          </p>
          <h1 className="text-4xl font-bold sm:text-5xl">Discussions</h1>
          <p className="max-w-2xl text-muted-foreground">
            The stories readers are talking about right now.
          </p>
        </header>
      </Reveal>

      {discussed.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="No conversations yet"
          description="Open any story and be the first to comment."
        >
          <Button asChild className="mt-2">
            <Link href="/">Browse stories</Link>
          </Button>
        </EmptyState>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <h2 className="text-2xl font-semibold">Most discussed</h2>
            <DiscussionList articles={discussed} />
          </div>
          <RecentComments comments={recent} />
        </div>
      )}
    </Container>
  );
}