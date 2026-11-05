import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { Role } from "@/generated/prisma/enums";
import { USERS_PAGE_SIZE } from "@/lib/queries/admin";

interface UsersPaginationProps {
  page: number;
  pageCount: number;
  total: number;
  q: string;
  role?: Role;
}

function buildHref(q: string, role: Role | undefined, page: number) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (role) params.set("role", role);
  if (page > 1) params.set("page", String(page));

  const query = params.toString();
  return query ? `/admin/users?${query}` : "/admin/users";
}

export function UsersPagination({
  page,
  pageCount,
  total,
  q,
  role,
}: UsersPaginationProps) {
  const from = (page - 1) * USERS_PAGE_SIZE + 1;
  const to = Math.min(page * USERS_PAGE_SIZE, total);

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-between gap-4"
    >
      <p className="text-sm text-muted-foreground" aria-live="polite">
        Showing {from}–{to} of {total}
      </p>

      <div className="flex items-center gap-2">
        {page > 1 ? (
          <Button variant="outline" size="sm" asChild>
            <Link href={buildHref(q, role, page - 1)} rel="prev">
              <ChevronLeft className="size-4" aria-hidden="true" />
              Previous
            </Link>
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled>
            <ChevronLeft className="size-4" aria-hidden="true" />
            Previous
          </Button>
        )}

        <span className="text-sm text-muted-foreground">
          Page {page} of {pageCount}
        </span>

        {page < pageCount ? (
          <Button variant="outline" size="sm" asChild>
            <Link href={buildHref(q, role, page + 1)} rel="next">
              Next
              <ChevronRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled>
            Next
            <ChevronRight className="size-4" aria-hidden="true" />
          </Button>
        )}
      </div>
    </nav>
  );
}