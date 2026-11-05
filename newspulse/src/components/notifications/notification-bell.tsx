"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Bell, CheckCheck, MessageSquare, Newspaper } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

import {
  markAllNotificationsReadAction,
  markNotificationReadAction,
} from "@/actions/notification-actions";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { formatRelativeTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { NotificationItem } from "@/types";

const POLL_INTERVAL_MS = 60_000;

type Status = "loading" | "ready" | "error";

type NotificationsPayload = {
  unreadCount: number;
  items: NotificationItem[];
};

// Pure network call: no React state here, so effects can use it freely
async function fetchNotifications(
  signal?: AbortSignal,
): Promise<NotificationsPayload> {
  const response = await fetch("/api/notifications", {
    signal,
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Request failed");

  return (await response.json()) as NotificationsPayload;
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [status, setStatus] = useState<Status>("loading");
  const [, startTransition] = useTransition();

  const applyPayload = useCallback((data: NotificationsPayload) => {
    setItems(data.items);
    setUnreadCount(data.unreadCount);
    setStatus("ready");
  }, []);

  // Keep showing the last good data if a later poll fails
  const markFailed = useCallback(() => {
    setStatus((current) => (current === "ready" ? "ready" : "error"));
  }, []);

  // Used from event handlers only (open, mark read), never called in an effect
  const refresh = useCallback(() => {
    fetchNotifications().then(applyPayload).catch(markFailed);
  }, [applyPayload, markFailed]);

  // Initial load + visibility-aware polling.
  // State is only set inside promise callbacks, never synchronously here.
  useEffect(() => {
    const controller = new AbortController();

    const load = () => {
      fetchNotifications(controller.signal)
        .then((data) => {
          if (!controller.signal.aborted) applyPayload(data);
        })
        .catch(() => {
          if (!controller.signal.aborted) markFailed();
        });
    };

    const loadIfVisible = () => {
      if (document.visibilityState === "visible") load();
    };

    load();
    const interval = setInterval(loadIfVisible, POLL_INTERVAL_MS);
    document.addEventListener("visibilitychange", loadIfVisible);

    return () => {
      controller.abort();
      clearInterval(interval);
      document.removeEventListener("visibilitychange", loadIfVisible);
    };
  }, [applyPayload, markFailed]);

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next) refresh();
  }

  function markRead(item: NotificationItem) {
    if (item.read) return;

    setItems((current) =>
      current.map((entry) =>
        entry.id === item.id ? { ...entry, read: true } : entry,
      ),
    );
    setUnreadCount((count) => Math.max(0, count - 1));

    startTransition(async () => {
      const result = await markNotificationReadAction(item.id);
      if (!result.ok) refresh();
    });
  }

  function markAllRead() {
    setItems((current) => current.map((entry) => ({ ...entry, read: true })));
    setUnreadCount(0);

    startTransition(async () => {
      const result = await markAllNotificationsReadAction();
      if (!result.ok) {
        toast.error("Couldn't mark notifications as read.");
        refresh();
      }
    });
  }

  const badge = unreadCount > 9 ? "9+" : String(unreadCount);

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="relative"
          aria-label={
            unreadCount > 0
              ? `Notifications, ${unreadCount} unread`
              : "Notifications"
          }
        >
          <Bell className="size-4" />
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.span
                key="badge"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 22 }}
                aria-hidden="true"
                className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-semibold leading-none text-white"
              >
                {badge}
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-80 p-0 sm:w-96">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="font-sans text-sm font-semibold">Notifications</h2>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={markAllRead}
            disabled={unreadCount === 0}
            className="h-auto px-2 py-1 text-xs"
          >
            <CheckCheck className="size-3.5" aria-hidden="true" />
            Mark all read
          </Button>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {status === "loading" && (
            <div className="space-y-4 p-4" aria-busy="true">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex gap-3">
                  <Skeleton className="size-8 shrink-0 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3 w-3/4" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {status === "error" && (
            <p
              role="alert"
              className="p-6 text-center text-sm text-muted-foreground"
            >
              Couldn&apos;t load notifications. Try again in a moment.
            </p>
          )}

          {status === "ready" && items.length === 0 && (
            <div className="flex flex-col items-center gap-2 p-8 text-center">
              <Bell
                className="size-6 text-muted-foreground"
                aria-hidden="true"
              />
              <p className="text-sm font-medium">You&apos;re all caught up</p>
              <p className="text-xs text-muted-foreground">
                Replies and new stories from your topics will show up here.
              </p>
            </div>
          )}

          {status === "ready" && items.length > 0 && (
            <ul className="divide-y">
              {items.map((item) => {
                const Icon =
                  item.type === "COMMENT_REPLY" ? MessageSquare : Newspaper;

                return (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      onClick={() => {
                        markRead(item);
                        setOpen(false);
                      }}
                      className={cn(
                        "flex gap-3 px-4 py-3 transition-colors hover:bg-muted/50 focus-visible:bg-muted/50 focus-visible:outline-none",
                        !item.read && "bg-brand/5",
                      )}
                    >
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
                        <Icon className="size-4" aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1 space-y-0.5">
                        <span className="block text-sm font-medium leading-snug">
                          {item.title}
                        </span>
                        {item.body && (
                          <span className="line-clamp-2 block text-xs text-muted-foreground">
                            {item.body}
                          </span>
                        )}
                        <span className="block text-xs text-muted-foreground">
                          {formatRelativeTime(item.createdAt)}
                        </span>
                      </span>
                      {!item.read && (
                        <>
                          <span
                            aria-hidden="true"
                            className="mt-2 size-2 shrink-0 rounded-full bg-brand"
                          />
                          <span className="sr-only">Unread</span>
                        </>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
