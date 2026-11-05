import { Minus, TrendingDown, TrendingUp, type LucideIcon } from "lucide-react";

import { Sparkline } from "@/components/admin/admin-charts";
import { formatNumber, type Delta } from "@/lib/admin";
import { cn } from "@/lib/utils";

function DeltaChip({ delta, days }: { delta: Delta; days: number }) {
  let icon = <Minus className="size-3.5" aria-hidden="true" />;
  let label = "No change";
  let tone = "text-muted-foreground";

  if (delta.kind === "new") {
    icon = <TrendingUp className="size-3.5" aria-hidden="true" />;
    label = "New activity";
    tone = "text-emerald-600 dark:text-emerald-400";
  } else if (delta.kind === "change") {
    const up = delta.percent > 0;
    icon = up ? (
      <TrendingUp className="size-3.5" aria-hidden="true" />
    ) : (
      <TrendingDown className="size-3.5" aria-hidden="true" />
    );
    label = `${up ? "Up" : "Down"} ${Math.abs(delta.percent)}%`;
    tone = up ? "text-emerald-600 dark:text-emerald-400" : "text-destructive";
  }

  return (
    <p className="flex items-center gap-1.5 text-xs">
      <span className={cn("inline-flex items-center gap-1 font-medium", tone)}>
        {icon}
        {label}
      </span>
      <span className="text-muted-foreground">vs previous {days} days</span>
    </p>
  );
}

interface KpiCardProps {
  label: string;
  value: number;
  caption: string;
  delta: Delta;
  days: number;
  icon: LucideIcon;
  series: number[];
  color: string;
}

export function KpiCard({
  label,
  value,
  caption,
  delta,
  days,
  icon: Icon,
  series,
  color,
}: KpiCardProps) {
  return (
    <div className="space-y-3 rounded-2xl border bg-card p-5 transition-shadow duration-300 hover:shadow-lg">
      <div className="flex items-center justify-between">
        <h2 className="font-sans text-sm font-medium text-muted-foreground">
          {label}
        </h2>
        <span
          className="flex size-8 items-center justify-center rounded-lg"
          style={{ color, backgroundColor: `color-mix(in oklab, ${color} 14%, transparent)` }}
        >
          <Icon className="size-4" aria-hidden="true" />
        </span>
      </div>

      <div>
        <p className="font-serif text-4xl font-bold tabular-nums">
          {formatNumber(value)}
        </p>
        <p className="text-xs text-muted-foreground">{caption}</p>
      </div>

      <Sparkline values={series} color={color} />
      <DeltaChip delta={delta} days={days} />
    </div>
  );
}