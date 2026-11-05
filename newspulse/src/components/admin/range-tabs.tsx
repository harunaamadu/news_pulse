"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import { RANGES, type RangeDays } from "@/lib/admin";
import { cn } from "@/lib/utils";

export function RangeTabs({ value }: { value: RangeDays }) {
  return (
    <div
      role="group"
      aria-label="Date range"
      className="inline-flex rounded-lg border bg-muted/40 p-0.5"
    >
      {RANGES.map((range) => {
        const active = range === value;

        return (
          <Link
            key={range}
            href={`/admin?range=${range}`}
            scroll={false}
            aria-current={active ? "true" : undefined}
            className={cn(
              "relative rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              active
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {active && (
              <motion.span
                layoutId="range-pill"
                className="absolute inset-0 rounded-md bg-background shadow-sm"
                transition={{ type: "spring", stiffness: 400, damping: 34 }}
              />
            )}
            <span className="relative z-10">Last {range} days</span>
          </Link>
        );
      })}
    </div>
  );
}