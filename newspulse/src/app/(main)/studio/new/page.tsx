import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { ArticleForm } from "@/components/studio/article-form";
import { requireStudioUser } from "@/lib/auth-guards";
import { getCategoryOptions } from "@/lib/queries/studio";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = { title: "New story" };

function StudioFormSkeleton() {
  return (
    <div
      className="mx-auto w-full max-w-3xl space-y-6 py-10"
      aria-busy="true"
      aria-live="polite"
    >
      <span className="sr-only">Loading editor…</span>

      {/* Page heading */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>

      {/* Title */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Excerpt */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-20 w-full" />
      </div>

      {/* Category + read time */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>

      {/* Cover image */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="aspect-3/2 w-full" />
      </div>

      {/* Content editor */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-72 w-full" />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
}

async function NewStoryContent() {
  await requireStudioUser("/studio/new");
  const categories = await getCategoryOptions();
  
  return <ArticleForm categories={categories} />;
}

export default async function NewStoryPage() {
  return (
    <Container className="space-y-8 py-8 sm:py-10">
      <header className="space-y-3 border-b-2 border-foreground pb-6">
        <Link
          href="/studio"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to studio
        </Link>
        <h1 className="text-4xl font-bold">New story</h1>
      </header>

      <Suspense fallback={<StudioFormSkeleton />}>
        <NewStoryContent />
      </Suspense>
    </Container>
  );
}
