"use client";

import { motion } from "framer-motion";
import { LayoutDashboard, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const items = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Users", href: "/admin/users", icon: Users },
] as const;

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Admin" className="-mb-px flex gap-1">
      {items.map(({ label, href, icon: Icon }) => {
        const active =
          href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative inline-flex items-center gap-2 px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="size-4" aria-hidden="true" />
            {label}
            {active && (
              <motion.span
                layoutId="admin-nav-indicator"
                className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-brand"
                transition={{ type: "spring", stiffness: 400, damping: 34 }}
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}