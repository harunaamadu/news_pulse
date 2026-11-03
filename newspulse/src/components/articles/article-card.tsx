import Image from "next/image";
import Link from "next/link";

import { ArticleMeta } from "@/components/articles/article-meta";
import { CategoryBadge } from "@/components/articles/category-badge";
import type { ArticleWithRelations } from "@/types";

export function ArticleCard({ article }: { article: ArticleWithRelations }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border bg-card transition-shadow duration-300 hover:shadow-lg has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-ring">
      <div className="relative aspect-[3/2] overflow-hidden bg-muted">
        <Image
          src={article.coverImage}
          alt=""
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <CategoryBadge name={article.category.name} slug={article.category.slug} />

        <h3 className="text-xl font-semibold leading-snug">
          <Link
            href={`/article/${article.slug}`}
            className="after:absolute after:inset-0 after:z-0 focus-visible:outline-none"
          >
            {article.title}
          </Link>
        </h3>

        <p className="line-clamp-3 text-sm text-muted-foreground">
          {article.excerpt}
        </p>

        <ArticleMeta article={article} className="mt-auto pt-2" />
      </div>
    </article>
  );
}