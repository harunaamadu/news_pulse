"use client";

import { Wifi, WifiOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useOnlineStatus } from "@/hooks/use-online-status";
import { cn } from "@/lib/utils";

const REFRESH_MS = 5 * 60_000;

export function LiveSync() {
  const router = useRouter();
  const online = useOnlineStatus();

  // Re-fetches server data (headlines, weather) while the tab is visible
  useEffect(() => {
    if (!online) return;

    const timer = setInterval(() => {
      if (document.visibilityState === "visible") router.refresh();
    }, REFRESH_MS);

    return () => clearInterval(timer);
  }, [online, router]);

  return (
    <p
      role="status"
      title={
        online
          ? "Connected. Headlines refresh automatically."
          : "You're offline. Reconnect to refresh headlines."
      }
      className={cn(
        "inline-flex items-center gap-1.5 font-medium",
        online ? "text-emerald-400" : "text-amber-400",
      )}
    >
      {online ? (
        <Wifi className="size-4" aria-hidden="true" />
      ) : (
        <WifiOff className="size-4" aria-hidden="true" />
      )}
      {online ? "Live Sync" : "Offline"}
    </p>
  );
}