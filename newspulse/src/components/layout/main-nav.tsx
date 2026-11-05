"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { siteConfig } from "@/config/site";
import { isActivePath } from "@/lib/navigation";
import { cn } from "@/lib/utils";

const navClassName = "hidden items-center gap-1 md:flex";
const linkClassName =
  "relative rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-foreground";

export function MainNavFallback() {
  return (
    <nav aria-label="Main" className={navClassName}>
      {siteConfig.nav.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(linkClassName, "text-muted-foreground")}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Main" className={navClassName}>
      {siteConfig.nav.map((item) => {
        const active = isActivePath(pathname, item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              linkClassName,
              active ? "text-primary" : "text-muted-foreground",
            )}
          >
            {item.label}
            {active && (
              <motion.span
                layoutId="main-nav-indicator"
                className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-brand"
                transition={{ type: "spring", stiffness: 400, damping: 34 }}
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}