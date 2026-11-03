"use client";

import Link from "next/link";

import { Container } from "@/components/layout/container";
import { SiteLogo } from "@/components/layout/site-logo";
import { siteConfig } from "@/config/site";
import { useEffect, useState } from "react";

const accountLinks = [
  { label: "Sign in", href: "/sign-in" },
  { label: "Create account", href: "/sign-up" },
  { label: "Bookmarks", href: "/bookmarks" },
  { label: "Discussions", href: "/discussions" },
];

interface SiteFooterProps {
  currentYear?: number;
}

export function SiteFooter({ currentYear }: SiteFooterProps) {
  const [year, setYear] = useState(currentYear);

  useEffect(() => {
    // Safely sync to the client runtime year after mounting
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="border-t bg-muted/30">
      <Container className="py-12">
        <div className="grid gap-10 md:grid-cols-3">
          <div className="space-y-4">
            <SiteLogo />
            <p className="max-w-xs text-sm text-muted-foreground">
              {siteConfig.description}
            </p>
          </div>

          <nav aria-label="Sections" className="space-y-3">
            <h2 className="font-sans text-sm font-semibold">Sections</h2>
            <ul className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
              {siteConfig.categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/category/${category.slug}`}
                    className="transition-colors hover:text-foreground"
                  >
                    {category.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Account" className="space-y-3">
            <h2 className="font-sans text-sm font-semibold">Your account</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {accountLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <p className="mt-10 border-t pt-6 text-sm text-muted-foreground">
          &copy; {year} {siteConfig.name}. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
