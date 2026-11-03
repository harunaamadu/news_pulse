import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4 p-6 text-center">
      <p className="text-sm font-medium uppercase tracking-widest text-brand">
        404
      </p>
      <h1 className="text-4xl font-semibold">
        This page has gone off the press
      </h1>
      <p className="max-w-md text-muted-foreground">
        The story you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Button asChild>
        <Link href="/">Back to the front page</Link>
      </Button>
    </main>
  );
}
