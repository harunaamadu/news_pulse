"use client";

import { RotateCcw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";

interface ErrorViewProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export function ErrorView({ error, reset }: ErrorViewProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60svh] flex-col items-center justify-center gap-4 p-6 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-brand">
        Something went wrong
      </p>
      <h1 className="text-4xl font-semibold">
        We hit a snag printing this page
      </h1>
      <p className="max-w-md text-muted-foreground">
        It&apos;s on our side, not yours. Try again, or head back to the front
        page.
      </p>
      {error.digest && (
        <p className="text-xs text-muted-foreground">
          Reference: <code>{error.digest}</code>
        </p>
      )}
      <div className="flex gap-2">
        <Button onClick={reset}>
          <RotateCcw className="size-4" aria-hidden="true" />
          Try again
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">Front page</Link>
        </Button>
      </div>
    </div>
  );
}
