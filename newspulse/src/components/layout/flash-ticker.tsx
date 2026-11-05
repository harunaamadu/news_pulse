"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, type FocusEvent } from "react";

import { Button } from "@/components/ui/button";
import { useNow } from "@/hooks/use-now";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { formatShortAgo } from "@/lib/format";

const ROTATE_MS = 6000;

export type FlashItem = {
  id: string;
  slug: string;
  title: string;
  tag: string;
  publishedAt: string;
};

const controlClass =
  "size-7 text-neutral-400 hover:bg-white/10 hover:text-white focus-visible:ring-white/40";

export function FlashTicker({ items }: { items: FlashItem[] }) {
  const now = useNow();
  const reducedMotion = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [interacting, setInteracting] = useState(false);

  const count = items.length;
  const position = count > 0 ? index % count : 0;
  const current = items[position];

  const paused = userPaused || reducedMotion;
  const running = !paused && !interacting && count > 1;

  // Restarts after every change, so each headline gets a full interval
  useEffect(() => {
    if (!running) return;

    const timer = setInterval(() => setIndex((value) => value + 1), ROTATE_MS);
    return () => clearInterval(timer);
  }, [running, position]);

  function go(delta: number) {
    setIndex((value) => (((value % count) + delta + count) % count));
  }

  function handleBlur(event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setInteracting(false);
    }
  }

  if (!current) {
    return (
      <p className="min-w-0 flex-1 truncate text-sm text-neutral-400">
        Fresh headlines will appear here.
      </p>
    );
  }

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Flash news"
      className="flex min-w-0 flex-1 items-center gap-3"
      onMouseEnter={() => setInteracting(true)}
      onMouseLeave={() => setInteracting(false)}
      onFocus={() => setInteracting(true)}
      onBlur={handleBlur}
    >
      <div
        className="relative h-7 min-w-0 flex-1 overflow-hidden"
        aria-live={running ? "off" : "polite"}
        aria-atomic="true"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={current.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${position + 1} of ${count}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="absolute inset-0 flex items-center gap-3"
          >
            <span className="shrink-0 rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-neutral-300">
              {current.tag}
            </span>
            <Link
              href={`/article/${current.slug}`}
              className="min-w-0 truncate text-sm font-medium text-neutral-100 underline-offset-4 hover:underline focus-visible:underline focus-visible:outline-none"
            >
              {current.title}
            </Link>
            {now !== null && (
              <span className="hidden shrink-0 font-mono text-xs text-neutral-500 sm:inline">
                ({formatShortAgo(current.publishedAt, now)})
              </span>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {count > 1 && (
        <div className="flex shrink-0 items-center gap-0.5">
          <span
            aria-hidden="true"
            className="mr-1.5 hidden text-xs tabular-nums text-neutral-400 sm:inline"
          >
            {position + 1}/{count}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={controlClass}
            onClick={() => go(-1)}
            aria-label="Previous headline"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={controlClass}
            onClick={() => setUserPaused((value) => !value)}
            disabled={reducedMotion}
            aria-label={
              reducedMotion
                ? "Auto-rotation is off because reduced motion is enabled"
                : paused
                  ? "Resume auto-rotation"
                  : "Pause auto-rotation"
            }
          >
            {paused ? <Play className="size-3.5" /> : <Pause className="size-3.5" />}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={controlClass}
            onClick={() => go(1)}
            aria-label="Next headline"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
}