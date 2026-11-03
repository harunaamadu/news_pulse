import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { BookmarksList } from "@/components/bookmarks/bookmarks-list";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/shared/motion-primitives";
import { getUserBookmarks } from "@/lib/queries/bookmarks";

export const metadata: Metadata = { title: "Bookmarks" };

export default async function BookmarksPage() {
  const session = await auth();
  const userId = session?.user?.id;

  // The proxy already guards this route; this is defense in depth
  if (!userId) redirect("/sign-in?callbackUrl=%2Fbookmarks");

  const articles = await getUserBookmarks(userId);

  return (
    <Container className="space-y-8 py-8 sm:py-10">
      <Reveal>
        <header className="space-y-3 border-b-2 border-foreground pb-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand">
            Your library
          </p>
          <h1 className="text-4xl font-bold sm:text-5xl">Bookmarks</h1>
          <p className="text-sm text-muted-foreground">
            {articles.length} saved {articles.length === 1 ? "story" : "stories"}
          </p>
        </header>
      </Reveal>

      <BookmarksList articles={articles} />
    </Container>
  );
}