import Link from "next/link";

import { cn } from "@/lib/utils";

interface CategoryBadgeProps {
  name: string;
  slug: string;
  variant?: "text" | "solid";
  className?: string;
}

export function CategoryBadge({
  name,
  slug,
  variant = "text",
  className,
}: CategoryBadgeProps) {
  return (
    <Link
      href={`/category/${slug}`}
      // relative z-10 keeps this link clickable above the card's stretched title link
      className={cn(
        "relative z-10 inline-block text-xs font-semibold uppercase tracking-wider",
        variant === "text" &&
          "text-brand underline-offset-4 hover:underline",
        variant === "solid" &&
          "rounded-full bg-brand px-3 py-1 text-white transition-opacity hover:opacity-90",
        className,
      )}
    >
      {name}
    </Link>
  );
}