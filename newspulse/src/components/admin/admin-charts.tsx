"use client";

import { useId } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  ROLE_LABELS,
  formatNumber,
  formatShortDate,
  type ActivityPoint,
  type CategoryStat,
  type RoleCount,
} from "@/lib/admin";

function EmptyChart({ message }: { message: string }) {
  return (
    <div className="flex h-64 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
      {message}
    </div>
  );
}

/* ---------- Sparkline (inside KPI cards) ---------- */

export function Sparkline({
  values,
  color,
}: {
  values: number[];
  color: string;
}) {
  // useId contains characters that are invalid inside url(#...)
  const gradientId = `spark-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const data = values.map((value, index) => ({ index, value }));
  const config = { value: { label: "Value", color } } satisfies ChartConfig;

  return (
    <ChartContainer config={config} className="aspect-auto h-12 w-full">
      <AreaChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-value)" stopOpacity={0.35} />
            <stop offset="100%" stopColor="var(--color-value)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          dataKey="value"
          type="monotone"
          stroke="var(--color-value)"
          strokeWidth={2}
          fill={`url(#${gradientId})`}
          dot={false}
        />
      </AreaChart>
    </ChartContainer>
  );
}

/* ---------- Reader growth ---------- */

const signupsConfig = {
  signups: { label: "New readers", color: "var(--brand)" },
} satisfies ChartConfig;

export function SignupsChart({ data }: { data: ActivityPoint[] }) {
  const gradientId = `signups-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;

  if (data.every((point) => point.signups === 0)) {
    return <EmptyChart message="No new readers in this period." />;
  }

  return (
    <ChartContainer config={signupsConfig} className="aspect-auto h-64 w-full">
      <AreaChart data={data} margin={{ left: -12, right: 8, top: 8 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-signups)" stopOpacity={0.4} />
            <stop offset="100%" stopColor="var(--color-signups)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={28}
          tickFormatter={(value: string) => formatShortDate(value)}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={36}
          allowDecimals={false}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              indicator="line"
              labelFormatter={(value) => formatShortDate(String(value))}
            />
          }
        />
        <Area
          dataKey="signups"
          type="monotone"
          stroke="var(--color-signups)"
          strokeWidth={2.5}
          fill={`url(#${gradientId})`}
          activeDot={{ r: 5 }}
        />
      </AreaChart>
    </ChartContainer>
  );
}

/* ---------- Reader engagement ---------- */

const engagementConfig = {
  comments: { label: "Comments", color: "var(--chart-2)" },
  bookmarks: { label: "Bookmarks", color: "var(--chart-4)" },
} satisfies ChartConfig;

export function EngagementChart({ data }: { data: ActivityPoint[] }) {
  if (data.every((point) => point.comments + point.bookmarks === 0)) {
    return <EmptyChart message="No reader activity in this period." />;
  }

  return (
    <ChartContainer config={engagementConfig} className="aspect-auto h-64 w-full">
      <BarChart data={data} margin={{ left: -12, right: 8, top: 8 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={28}
          tickFormatter={(value: string) => formatShortDate(value)}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={36}
          allowDecimals={false}
        />
        <ChartTooltip
          cursor={{ fillOpacity: 0.08 }}
          content={
            <ChartTooltipContent
              labelFormatter={(value) => formatShortDate(String(value))}
            />
          }
        />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar
          dataKey="comments"
          stackId="engagement"
          fill="var(--color-comments)"
          radius={[0, 0, 3, 3]}
        />
        <Bar
          dataKey="bookmarks"
          stackId="engagement"
          fill="var(--color-bookmarks)"
          radius={[3, 3, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  );
}

/* ---------- Sections: stories vs followers ---------- */

const categoryConfig = {
  stories: { label: "Stories", color: "var(--chart-2)" },
  followers: { label: "Followers", color: "var(--brand)" },
} satisfies ChartConfig;

export function CategoryChart({ data }: { data: CategoryStat[] }) {
  if (data.length === 0) {
    return <EmptyChart message="No sections yet." />;
  }

  return (
    <ChartContainer config={categoryConfig} className="aspect-auto h-72 w-full">
      <BarChart data={data} layout="vertical" margin={{ left: 0, right: 12 }}>
        <CartesianGrid horizontal={false} />
        <YAxis
          dataKey="name"
          type="category"
          tickLine={false}
          axisLine={false}
          width={84}
        />
        <XAxis type="number" hide allowDecimals={false} />
        <ChartTooltip
          cursor={{ fillOpacity: 0.08 }}
          content={<ChartTooltipContent />}
        />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="stories" fill="var(--color-stories)" radius={4} />
        <Bar dataKey="followers" fill="var(--color-followers)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}

/* ---------- Role split donut ---------- */

const roleConfig = {
  count: { label: "Accounts" },
  USER: { label: ROLE_LABELS.USER, color: "var(--chart-2)" },
  EDITOR: { label: ROLE_LABELS.EDITOR, color: "var(--chart-4)" },
  ADMIN: { label: ROLE_LABELS.ADMIN, color: "var(--brand)" },
} satisfies ChartConfig;

export function RoleChart({ data }: { data: RoleCount[] }) {
  const total = data.reduce((sum, item) => sum + item.count, 0);
  const slices = data.map((item) => ({
    ...item,
    fill: `var(--color-${item.role})`,
  }));

  if (total === 0) return <EmptyChart message="No accounts yet." />;

  return (
    <ChartContainer config={roleConfig} className="mx-auto aspect-square max-h-72">
      <PieChart>
        <ChartTooltip
          content={<ChartTooltipContent hideLabel nameKey="role" />}
        />
        <Pie
          data={slices}
          dataKey="count"
          nameKey="role"
          innerRadius={64}
          strokeWidth={4}
          paddingAngle={2}
        >
          <Label
            content={({ viewBox }) => {
              if (!viewBox || !("cx" in viewBox)) return null;

              return (
                <text
                  x={viewBox.cx}
                  y={viewBox.cy}
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  <tspan
                    x={viewBox.cx}
                    y={viewBox.cy}
                    className="fill-foreground text-3xl font-bold"
                  >
                    {formatNumber(total)}
                  </tspan>
                  <tspan
                    x={viewBox.cx}
                    y={(viewBox.cy ?? 0) + 24}
                    className="fill-muted-foreground text-xs"
                  >
                    Accounts
                  </tspan>
                </text>
              );
            }}
          />
        </Pie>
        <ChartLegend content={<ChartLegendContent nameKey="role" />} />
      </PieChart>
    </ChartContainer>
  );
}