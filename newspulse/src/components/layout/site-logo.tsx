import Link from "next/link";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function SiteLogo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label={`${siteConfig.name} home`}
      className={cn("flex items-center gap-2", className)}
    >
      <span className="relative flex size-2.5" aria-hidden="true">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60 motion-reduce:animate-none" />
        <span className="relative inline-flex size-2.5 rounded-full bg-primary" />
      </span>
      <span className="font-serif text-xl font-bold tracking-tight">
        News<span className="text-primary">Pulse</span>
      </span>
    </Link>
  );
}
