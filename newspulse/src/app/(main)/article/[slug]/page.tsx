import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { auth } from "@/auth";
import { ArticleContent } from "@/components/articles/article-content";
import { ArticleGrid } from "@/components/articles/article-grid";
import { BookmarkButton } from "@/components/articles/bookmark-button";
import { CategoryBadge } from "@/components/articles/category-badge";
import { ReadingProgress } from "@/components/articles/reading-progress";
import { ShareButton } from "@/components/articles/share-button";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/shared/motion-primitives";
import { SectionHeading } from "@/components/shared/section-heading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { siteConfig } from "@/config/site";
import { formatDate, formatReadTime } from "@/lib/format";
import { getArticleBySlug, getRelatedArticles } from "@/lib/queries/articles";
import { isArticleBookmarked } from "@/lib/queries/bookmarks";
import { getInitials } from "@/lib/utils";

import { Suspense } from "react";

import {
  CommentSection,
  CommentsSkeleton,
} from "@/components/comments/comment-section";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) return { title: "Story not found" };

  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `/article/${article.slug}` },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt,
      publishedTime: article.publishedAt.toISOString(),
      authors: article.author.name ? [article.author.name] : undefined,
      images: [article.coverImage],
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) notFound();

  const session = await auth();
  const userId = session?.user?.id;

  const [bookmarked, related] = await Promise.all([
    userId ? isArticleBookmarked(userId, article.id) : Promise.resolve(false),
    getRelatedArticles(article.id, article.categoryId),
  ]);

  const authorName = article.author.name ?? siteConfig.name;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    image: [article.coverImage],
    datePublished: article.publishedAt.toISOString(),
    dateModified: article.updatedAt.toISOString(),
    author: [{ "@type": "Person", name: authorName }],
    publisher: { "@type": "Organization", name: siteConfig.name },
    mainEntityOfPage: `${siteConfig.url}/article/${article.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        // "<" is escaped so article text can never close the script tag
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <ReadingProgress targetId="article-body" />

      <article>
        <Container className="max-w-3xl pt-8 sm:pt-12">
          <Reveal>
            <header className="space-y-6">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link href="/">Home</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link href={`/category/${article.category.slug}`}>
                        {article.category.name}
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>

              <div className="space-y-4">
                <CategoryBadge
                  name={article.category.name}
                  slug={article.category.slug}
                  variant="solid"
                />
                <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
                  {article.title}
                </h1>
                <p className="text-xl text-muted-foreground">
                  {article.excerpt}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 border-y py-4">
                <div className="flex items-center gap-3">
                  <Avatar className="size-10">
                    <AvatarImage
                      src={article.author.image ?? undefined}
                      alt=""
                    />
                    <AvatarFallback className="text-xs font-medium">
                      {getInitials(article.author.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-sm">
                    <p className="font-medium">{authorName}</p>
                    <p className="text-muted-foreground">
                      <time dateTime={article.publishedAt.toISOString()}>
                        {formatDate(article.publishedAt)}
                      </time>
                      {" · "}
                      {formatReadTime(article.readTimeMinutes)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <BookmarkButton
                    articleId={article.id}
                    slug={article.slug}
                    initialBookmarked={bookmarked}
                    isAuthenticated={Boolean(userId)}
                  />
                  <ShareButton title={article.title} />
                </div>
              </div>
            </header>
          </Reveal>
        </Container>

        <Container className="mt-8 max-w-5xl">
          <div className="relative aspect-video overflow-hidden rounded-2xl bg-muted">
            <Image
              src={article.coverImage}
              alt=""
              fill
              priority
              sizes="(min-width: 1024px) 64rem, 100vw"
              className="object-cover"
            />
          </div>
        </Container>

        <Container className="max-w-3xl py-10 sm:py-12">
          <div id="article-body">
            <ArticleContent content={article.content} />
          </div>
        </Container>
      </article>

      <Container className="max-w-3xl pb-12">
        <Suspense fallback={<CommentsSkeleton />}>
          <CommentSection articleId={article.id} slug={article.slug} />
        </Suspense>
      </Container>

      {related.length > 0 && (
        <section
          aria-label="More to read"
          className="border-t bg-muted/30 py-12"
        >
          <Container className="space-y-6">
            <SectionHeading title="More to read" />
            <ArticleGrid articles={related} />
          </Container>
        </section>
      )}
    </>
  );
}
