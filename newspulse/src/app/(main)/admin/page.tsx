import type { Metadata } from "next";
import { Suspense } from "react";

import { AdminShell } from "@/components/admin/admin-shell";
import {
  AdminPageSkeleton,
  ChartsSkeleton,
  KpiSkeleton,
  ListsSkeleton,
} from "@/components/admin/admin-skeletons";
import {
  ChartsSection,
  KpiSection,
  ListsSection,
} from "@/components/admin/overview-sections";
import { RangeTabs } from "@/components/admin/range-tabs";
import { parseRange } from "@/lib/admin";
import { requireAdminUser } from "@/lib/auth-guards";

export const metadata: Metadata = { title: "Overview" };

interface AdminPageProps {
  searchParams: Promise<{ range?: string | string[] }>;
}

export default function AdminPage({ searchParams }: AdminPageProps) {
  return (
    <Suspense fallback={<AdminPageSkeleton />}>
      <AdminOverview searchParams={searchParams} />
    </Suspense>
  );
}

async function AdminOverview({ searchParams }: AdminPageProps) {
  await requireAdminUser("/admin");
  const days = parseRange((await searchParams).range);

  return (
    <AdminShell
      title="Overview"
      description="How NewsPulse is growing, what readers do, and which stories drive it."
      actions={<RangeTabs value={days} />}
    >
      <div className="space-y-4">
        <Suspense fallback={<KpiSkeleton />}>
          <KpiSection days={days} />
        </Suspense>
        <Suspense fallback={<ChartsSkeleton />}>
          <ChartsSection days={days} />
        </Suspense>
        <Suspense fallback={<ListsSkeleton />}>
          <ListsSection />
        </Suspense>
      </div>
    </AdminShell>
  );
}