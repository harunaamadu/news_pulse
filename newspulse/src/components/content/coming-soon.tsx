import { Hourglass } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export function ComingSoon({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed px-6 py-20 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-brand/10 text-brand">
        <Hourglass className="size-6" aria-hidden="true" />
      </div>
      <h2 className="text-2xl font-semibold">{label} is on its way</h2>
      <p className="max-w-md text-muted-foreground">
        We&apos;re still building this one. In the meantime, there&apos;s plenty
        to read.
      </p>
      <div className="flex flex-wrap justify-center gap-2 pt-2">
        <Button asChild>
          <Link href="/">Browse stories</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/topics">Choose your topics</Link>
        </Button>
      </div>
    </div>
  );
}