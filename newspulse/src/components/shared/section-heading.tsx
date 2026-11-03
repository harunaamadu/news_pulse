import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface SectionHeadingProps {
  title: string;
  href?: string;
  linkLabel?: string;
}

export function SectionHeading({
  title,
  href,
  linkLabel = "View all",
}: SectionHeadingProps) {
  return (
    <div className="flex items-end justify-between gap-4 border-b-2 border-foreground pb-2">
      <h2 className="text-2xl font-semibold">{title}</h2>
      {href && (
        <Link
          href={href}
          className="group inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          {linkLabel}
          <ArrowRight
            className="size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
            aria-hidden="true"
          />
        </Link>
      )}
    </div>
  );
}