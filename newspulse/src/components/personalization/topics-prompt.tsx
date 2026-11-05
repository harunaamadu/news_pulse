import { Sparkles } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export function TopicsPrompt() {
  return (
    <section
      aria-labelledby="topics-prompt-heading"
      className="flex flex-col gap-4 rounded-2xl border bg-muted/30 p-6 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex items-start gap-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
          <Sparkles className="size-5" aria-hidden="true" />
        </div>
        <div className="space-y-1">
          <h2 id="topics-prompt-heading" className="text-xl font-semibold">
            Make NewsPulse yours
          </h2>
          <p className="text-sm text-muted-foreground">
            Follow the topics you care about and get a feed built around them.
          </p>
        </div>
      </div>
      <Button asChild className="shrink-0">
        <Link href="/topics">Choose topics</Link>
      </Button>
    </section>
  );
}