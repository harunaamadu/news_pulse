import { FileText, Plus } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { EmptyState } from "@/components/shared/empty-state";
import { Reveal } from "@/components/shared/motion-primitives";
import { ArticlesTable } from "@/components/studio/articles-table";
import { StatsCards } from "@/components/studio/stats-cards";
import { Button } from "@/components/ui/button";
import { requireStudioUser } from "@/lib/auth-guards";
import { getStudioArticles, getStudioStats } from "@/lib/queries/studio";

export default async function StudioPage() {
  const user = await requireStudioUser("/studio");

  const [articles, stats] = await Promise.all([
    getStudioArticles(user),
    getStudioStats(user),
  ]);

  return (
    <Container className="space-y-8 py-8 sm:py-10">
      <Reveal>
        <header className="flex flex-wrap items-end justify-between gap-4 border-b-2 border-foreground pb-6">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand">
              Studio
            </p>
            <h1 className="text-4xl font-bold sm:text-5xl">Your stories</h1>
            <p className="text-muted-foreground">
              {user.role === "ADMIN"
                ? "Managing every story on NewsPulse."
                : "Write, edit and publish your stories."}
            </p>
          </div>
          <Button asChild>
            <Link href="/studio/new">
              <Plus className="size-4" aria-hidden="true" />
              New story
            </Link>
          </Button>
        </header>
      </Reveal>

      <StatsCards stats={stats} />

      {articles.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No stories yet"
          description="Start with a draft. Nothing goes public until you publish."
        >
          <Button asChild className="mt-2">
            <Link href="/studio/new">Write your first story</Link>
          </Button>
        </EmptyState>
      ) : (
        <ArticlesTable articles={articles} user={user} />
      )}
    </Container>
  );
}