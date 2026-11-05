import { Bookmark, MessageSquare, Newspaper, Users } from "lucide-react";

import { ChartCard } from "@/components/admin/admin-shell";
import {
  CategoryChart,
  EngagementChart,
  RoleChart,
  SignupsChart,
} from "@/components/admin/admin-charts";
import { RecentSignups, TopStories } from "@/components/admin/admin-lists";
import { KpiCard } from "@/components/admin/kpi-card";
import { computeDelta, formatNumber, type RangeDays } from "@/lib/admin";
import {
  getActivitySeries,
  getAdminKpis,
  getCategoryStats,
  getRecentSignups,
  getRoleBreakdown,
  getTopStories,
} from "@/lib/queries/admin";

export async function KpiSection({ days }: { days: RangeDays }) {
  const [kpis, series] = await Promise.all([
    getAdminKpis(days),
    getActivitySeries(days),
  ]);

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <KpiCard
        label="Readers"
        value={kpis.totalUsers}
        caption={`+${formatNumber(kpis.newUsers)} in the last ${days} days`}
        delta={computeDelta(kpis.newUsers, kpis.prevUsers)}
        days={days}
        icon={Users}
        series={series.map((point) => point.signups)}
        color="var(--brand)"
      />
      <KpiCard
        label="Published stories"
        value={kpis.totalStories}
        caption={`+${formatNumber(kpis.newStories)} in the last ${days} days`}
        delta={computeDelta(kpis.newStories, kpis.prevStories)}
        days={days}
        icon={Newspaper}
        series={series.map((point) => point.stories)}
        color="var(--chart-1)"
      />
      <KpiCard
        label="Comments"
        value={kpis.newComments}
        caption={`Posted in the last ${days} days`}
        delta={computeDelta(kpis.newComments, kpis.prevComments)}
        days={days}
        icon={MessageSquare}
        series={series.map((point) => point.comments)}
        color="var(--chart-2)"
      />
      <KpiCard
        label="Bookmarks"
        value={kpis.newBookmarks}
        caption={`Saved in the last ${days} days`}
        delta={computeDelta(kpis.newBookmarks, kpis.prevBookmarks)}
        days={days}
        icon={Bookmark}
        series={series.map((point) => point.bookmarks)}
        color="var(--chart-4)"
      />
    </div>
  );
}

export async function ChartsSection({ days }: { days: RangeDays }) {
  const [series, roles, categories] = await Promise.all([
    getActivitySeries(days),
    getRoleBreakdown(),
    getCategoryStats(),
  ]);

  const newReaders = series.reduce((sum, point) => sum + point.signups, 0);
  const interactions = series.reduce(
    (sum, point) => sum + point.comments + point.bookmarks,
    0,
  );

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <ChartCard
        className="lg:col-span-2"
        title="Reader growth"
        description={`New accounts per day over the last ${days} days`}
        stat={
          <p className="text-right">
            <span className="block font-serif text-2xl font-bold tabular-nums">
              {formatNumber(newReaders)}
            </span>
            <span className="text-xs text-muted-foreground">new readers</span>
          </p>
        }
      >
        <SignupsChart data={series} />
      </ChartCard>

      <ChartCard title="Who's on NewsPulse" description="Accounts by role">
        <RoleChart data={roles} />
      </ChartCard>

      <ChartCard
        className="lg:col-span-2"
        title="Reader engagement"
        description="Comments and bookmarks per day"
        stat={
          <p className="text-right">
            <span className="block font-serif text-2xl font-bold tabular-nums">
              {formatNumber(interactions)}
            </span>
            <span className="text-xs text-muted-foreground">interactions</span>
          </p>
        }
      >
        <EngagementChart data={series} />
      </ChartCard>

      <ChartCard
        title="Supply vs. demand"
        description="Published stories against followers, by section"
      >
        <CategoryChart data={categories} />
      </ChartCard>
    </div>
  );
}

export async function ListsSection() {
  const [topStories, recentSignups] = await Promise.all([
    getTopStories(),
    getRecentSignups(),
  ]);

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <ChartCard
        className="lg:col-span-2"
        title="Top stories"
        description="Ranked by comments and bookmarks, all time"
      >
        <TopStories stories={topStories} />
      </ChartCard>

      <ChartCard title="Newest members" description="The latest sign-ups">
        <RecentSignups users={recentSignups} />
      </ChartCard>
    </div>
  );
}