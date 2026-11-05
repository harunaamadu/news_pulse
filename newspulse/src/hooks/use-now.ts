import { useSyncExternalStore } from "react";

function subscribe(onChange: () => void) {
  const timer = setInterval(onChange, 30_000);
  return () => clearInterval(timer);
}

// Rounded to the minute, so the snapshot is stable between ticks
const getSnapshot = (): number | null =>
  Math.floor(Date.now() / 60_000) * 60_000;

const getServerSnapshot = (): number | null => null;

export function useNow(): number | null {
  return useSyncExternalStore<number | null>(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
}