import { SearchX } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { z } from "zod";

import { AdminShell } from "@/components/admin/admin-shell";
import { AdminPageSkeleton } from "@/components/admin/admin-skeletons";
import { UserFilters } from "@/components/admin/user-filters";
import { UsersPagination } from "@/components/admin/users-pagination";
import { UsersTable } from "@/components/admin/users-table";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { requireAdminUser } from "@/lib/auth-guards";
import { getAdminUsers } from "@/lib/queries/admin";

export const metadata: Metadata = { title: "Users" };

type SearchParams = Record<string, string | string[] | undefined>;

interface UsersPageProps {
  searchParams: Promise<SearchParams>;
}

// Anything malformed in the URL quietly falls back to a safe default
const querySchema = z.object({
  q: z.string().trim().max(100).catch(""),
  role: z.enum(["USER", "EDITOR", "ADMIN"]).optional().catch(undefined),
  page: z.coerce.number().int().min(1).max(10_000).catch(1),
});

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default function UsersPage({ searchParams }: UsersPageProps) {
  return (
    <Suspense fallback={<AdminPageSkeleton />}>
      <UsersContent searchParams={searchParams} />
    </Suspense>
  );
}

async function UsersContent({ searchParams }: UsersPageProps) {
  const admin = await requireAdminUser("/admin/users");

  const raw = await searchParams;
  const { q, role, page } = querySchema.parse({
    q: first(raw.q),
    role: first(raw.role),
    page: first(raw.page),
  });

  const result = await getAdminUsers({ q: q || undefined, role, page });

  return (
    <AdminShell
      title="Users"
      description="Promote readers to editors, manage admins and remove accounts."
      actions={
        <p className="text-sm text-muted-foreground">
          {result.total} {result.total === 1 ? "account" : "accounts"}
        </p>
      }
    >
      <div className="space-y-4">
        <UserFilters q={q} role={role} />

        {result.users.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title="No users found"
            description="Try a different name or email, or clear the filters."
          >
            <Button variant="outline" asChild className="mt-2">
              <Link href="/admin/users">Clear filters</Link>
            </Button>
          </EmptyState>
        ) : (
          <>
            <UsersTable users={result.users} currentUserId={admin.id} />
            <UsersPagination
              page={result.page}
              pageCount={result.pageCount}
              total={result.total}
              q={q}
              role={role}
            />
          </>
        )}
      </div>
    </AdminShell>
  );
}