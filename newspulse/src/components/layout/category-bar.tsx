"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const items = [
  { label: "Latest", href: "/" },
  ...siteConfig.categories.map((category) => ({
    label: category.label,
    href: `/category/${category.slug}`,
  })),
];

const navClassName =
  "no-scrollbar -mx-1 flex items-center gap-1 overflow-x-auto py-2";
const linkClassName =
  "relative shrink-0 rounded-sm px-3.5 py-1.5 text-sm font-medium transition-colors";

export function CategoryBarFallback() {
  return (
    <nav aria-label="Categories" className={navClassName}>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            linkClassName,
            "text-muted-foreground hover:text-foreground",
          )}
        >
          <span className="relative z-10">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}

export function CategoryBar() {
  const pathname = usePathname();

  return (
    <nav aria-label="Categories" className={navClassName}>
      {items.map((item) => {
        const active = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              linkClassName,
              active
                ? "text-background"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {active && (
              <motion.span
                layoutId="category-pill"
                className="absolute inset-0 rounded-sm bg-primary"
                transition={{ type: "spring", stiffness: 400, damping: 34 }}
              />
            )}
            <span className="relative z-10">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}