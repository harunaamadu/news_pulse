import { CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Container } from "@/components/layout/container";
import { ArticleForm } from "@/components/studio/article-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { canManageArticle, requireStudioUser } from "@/lib/auth-guards";
import { getArticleForEdit, getCategoryOptions } from "@/lib/queries/studio";

export const metadata: Metadata = { title: "Edit story" };

interface EditStoryPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ notice?: string }>;
}

const notices: Record<string, { title: string; description: string }> = {
  created: {
    title: "Draft created",
    description: "It's private until you publish it.",
  },
  published: {
    title: "Story published",
    description: "It's live now, and readers following this section were notified.",
  },
};

export default async function EditStoryPage({
  params,
  searchParams,
}: EditStoryPageProps) {
  const { id } = await params;
  const user = await requireStudioUser(`/studio/${id}/edit`);

  const [article, categories, { notice }] = await Promise.all([
    getArticleForEdit(id),
    getCategoryOptions(),
    searchParams,
  ]);

  // Same response for "missing" and "not yours", so ids can't be probed
  if (!article || !canManageArticle(user, article.authorId)) notFound();

  const banner = notice ? notices[notice] : undefined;

  return (
    <Container className="space-y-8 py-8 sm:py-10">
      <header className="space-y-3 border-b-2 border-foreground pb-6">
        <Link
          href="/studio"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to studio
        </Link>
        <h1 className="text-4xl font-bold">Edit story</h1>
      </header>

      {banner && (
        <Alert>
          <CheckCircle2 className="size-4" aria-hidden="true" />
          <AlertTitle>{banner.title}</AlertTitle>
          <AlertDescription>{banner.description}</AlertDescription>
        </Alert>
      )}

      <ArticleForm categories={categories} article={article} />
    </Container>
  );
}