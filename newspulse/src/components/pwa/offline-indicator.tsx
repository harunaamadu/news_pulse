"use client";

import { AnimatePresence, motion } from "framer-motion";
import { WifiOff } from "lucide-react";
import { useSyncExternalStore } from "react";

function subscribe(onChange: () => void) {
  window.addEventListener("online", onChange);
  window.addEventListener("offline", onChange);

  return () => {
    window.removeEventListener("online", onChange);
    window.removeEventListener("offline", onChange);
  };
}

const getSnapshot = () => navigator.onLine;
const getServerSnapshot = () => true; // assume online during SSR

export function OfflineIndicator() {
  const online = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <AnimatePresence>
      {!online && (
        <motion.div
          role="status"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 30 }}
          className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-md items-center gap-3 rounded-xl border bg-card px-4 py-3 text-sm shadow-lg"
        >
          <WifiOff className="size-4 shrink-0 text-brand" aria-hidden="true" />
          <span className="flex-1">You&apos;re offline.</span>
          {/* Plain anchor on purpose: offline.html is a static file, not a route */}
          <a
            href="/offline.html"
            className="font-medium underline-offset-4 hover:underline"
          >
            Saved stories
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}