import { ExternalLink, Pencil } from "lucide-react";
import Link from "next/link";

import { DeleteArticleButton } from "@/components/studio/delete-article-button";
import { StatusBadge } from "@/components/studio/status-badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { StudioUser } from "@/lib/auth-guards";
import { formatDate } from "@/lib/format";
import type { getStudioArticles } from "@/lib/queries/studio";

type StudioArticle = Awaited<ReturnType<typeof getStudioArticles>>[number];

interface ArticlesTableProps {
  articles: StudioArticle[];
  user: StudioUser;
}

export function ArticlesTable({ articles, user }: ArticlesTableProps) {
  const isAdmin = user.role === "ADMIN";

  return (
    <div className="overflow-hidden rounded-2xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Story</TableHead>
            <TableHead className="hidden md:table-cell">Section</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden sm:table-cell">Updated</TableHead>
            <TableHead className="hidden text-right lg:table-cell">Comments</TableHead>
            <TableHead className="text-right">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {articles.map((article) => (
            <TableRow key={article.id}>
              <TableCell className="max-w-xs">
                <Link
                  href={`/studio/${article.id}/edit`}
                  className="line-clamp-2 font-serif font-semibold hover:underline"
                >
                  {article.title}
                </Link>
                {isAdmin && (
                  <p className="text-xs text-muted-foreground">
                    by {article.author.name ?? "Unknown"}
                  </p>
                )}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {article.category.name}
              </TableCell>
              <TableCell>
                <StatusBadge status={article.status} />
              </TableCell>
              <TableCell className="hidden whitespace-nowrap text-muted-foreground sm:table-cell">
                {formatDate(article.updatedAt)}
              </TableCell>
              <TableCell className="hidden text-right tabular-nums lg:table-cell">
                {article._count.comments}
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-1">
                  {article.status === "PUBLISHED" && (
                    <Button variant="ghost" size="icon" asChild>
                      <Link
                        href={`/article/${article.slug}`}
                        aria-label={`View "${article.title}" on the site`}
                      >
                        <ExternalLink className="size-4" />
                      </Link>
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" asChild>
                    <Link
                      href={`/studio/${article.id}/edit`}
                      aria-label={`Edit "${article.title}"`}
                    >
                      <Pencil className="size-4" />
                    </Link>
                  </Button>
                  <DeleteArticleButton
                    articleId={article.id}
                    title={article.title}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}