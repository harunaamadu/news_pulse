import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { ArticleMeta } from "@/components/articles/article-meta";
import { CategoryBadge } from "@/components/articles/category-badge";
import type { ArticleWithRelations } from "@/types";

export function FeaturedArticle({ article }: { article: ArticleWithRelations }) {
  return (
    <article className="group relative isolate flex min-h-[26rem] items-end overflow-hidden rounded-2xl border bg-muted sm:min-h-[32rem] lg:h-full">
      <Image
        src={article.coverImage}
        alt=""
        fill
        priority
        sizes="(min-width: 1024px) 66vw, 100vw"
        className="object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent"
      />

      <div className="relative z-10 w-full space-y-4 p-6 text-white sm:p-8">
        <CategoryBadge
          name={article.category.name}
          slug={article.category.slug}
          variant="solid"
        />

        <h2 className="max-w-3xl text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
          <Link
            href={`/article/${article.slug}`}
            className="after:absolute after:inset-0 after:z-0 focus-visible:outline-none"
          >
            {article.title}
          </Link>
        </h2>

        <p className="line-clamp-2 max-w-2xl text-base text-white/80 sm:text-lg">
          {article.excerpt}
        </p>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <ArticleMeta article={article} className="text-white/70" />
          <span className="inline-flex items-center gap-1 text-sm font-medium">
            Read story
            <ArrowUpRight
              className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none"
              aria-hidden="true"
            />
          </span>
        </div>
      </div>
    </article>
  );
}