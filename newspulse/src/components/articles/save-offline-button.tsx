"use client";

import { Check, Download } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  cacheCoverImage,
  getOfflineArticle,
  removeCachedCoverImage,
  removeOfflineArticle,
  saveOfflineArticle,
} from "@/lib/offline/offline-store";
import type { OfflineArticle } from "@/types";

export function SaveOfflineButton({ slug }: { slug: string }) {
  const [ready, setReady] = useState(false);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (typeof indexedDB === "undefined") return;

    let cancelled = false;
    getOfflineArticle(slug)
      .then((article) => {
        if (cancelled) return;
        setSaved(Boolean(article));
        setReady(true);
      })
      .catch(() => {
        /* storage unavailable (e.g. private mode): button stays disabled */
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  async function handleClick() {
    setBusy(true);

    try {
      if (saved) {
        const existing = await getOfflineArticle(slug);
        await removeOfflineArticle(slug);
        if (existing) await removeCachedCoverImage(existing.coverImage);

        setSaved(false);
        toast.success("Removed from offline reading");
        return;
      }

      const response = await fetch(
        `/api/articles/${encodeURIComponent(slug)}/offline`,
      );
      if (!response.ok) throw new Error("Request failed");

      const data = (await response.json()) as Omit<OfflineArticle, "savedAt">;
      await saveOfflineArticle({ ...data, savedAt: new Date().toISOString() });
      await cacheCoverImage(data.coverImage);

      setSaved(true);
      toast.success("Saved for offline reading");
    } catch {
      toast.error("Couldn't update offline reading. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Button
      type="button"
      size="sm"
      variant={saved ? "secondary" : "outline"}
      onClick={handleClick}
      disabled={!ready || busy}
      aria-pressed={saved}
    >
      {saved ? (
        <Check className="size-4" aria-hidden="true" />
      ) : (
        <Download className="size-4" aria-hidden="true" />
      )}
      {saved ? "Saved offline" : "Read offline"}
    </Button>
  );
}