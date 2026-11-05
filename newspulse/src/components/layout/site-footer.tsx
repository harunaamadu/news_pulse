import Link from "next/link";

import { Container } from "@/components/layout/container";
import { SiteLogo } from "@/components/layout/site-logo";
import { siteConfig } from "@/config/site";

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
  const year = currentYear ?? new Date().getFullYear();

  const standardInfo = siteConfig.standardsAndIntegrity.find(
    (s) => s.label === "Standard",
  );

  const integrityLinks = siteConfig.standardsAndIntegrity.filter(
    (s) => s.label !== "Standard",
  );

  return (
    <footer className="border-t bg-muted/30">
      <Container className="py-12">
        <div className="grid grid-cols-2 md:flex gap-10 w-full flex-wrap justify-between">
          <div className="space-y-4 basis-0 flex-1 col-span-2">
            <SiteLogo />
            <p className="text-sm text-muted-foreground">
              {siteConfig.description}
            </p>
          </div>

          <nav aria-label="Sections" className="space-y-3 *:flex-1">
            <h2 className="font-sans text-sm font-semibold">Sections</h2>
            <ul className="grid gap-2 text-sm text-muted-foreground">
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

          <nav aria-label="Sections" className="space-y-3">
            <h2 className="font-sans text-sm font-semibold">
              Features & Expeditions
            </h2>
            <ul className="grid gap-2 text-sm text-muted-foreground">
              {siteConfig.featuresAndExpeditions.map((f) => (
                <li key={f.slug}>
                  <Link
                    href={`/feature/${f.slug}`}
                    className={`transition-colors hover:text-foreground ${"disabled" in f && f.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {f.label}
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

          <nav aria-label="Company" className="space-y-3">
            <h2 className="font-sans text-sm font-semibold">Company</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/about"
                  className="transition-colors hover:text-foreground"
                >
                  About us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="transition-colors hover:text-foreground"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </nav>

          <nav
            aria-label="Standards & Integrity"
            className="space-y-3 basis-xs max-md:flex-1 col-span-2"
          >
            <h2 className="font-sans text-sm font-semibold">
              Standards & Integrity
            </h2>

            <div className="space-y-3 text-sm text-muted-foreground">
              {/* Render the core descriptive paragraph if it exists */}
              {standardInfo && "paragraph" in standardInfo && (
                <p className="text-foreground/80 leading-relaxed">
                  {standardInfo.paragraph}
                </p>
              )}

              {/* Render a single, clean unordered list containing your links */}
              <ul className="flex flex-wrap gap-x-4 gap-y-2 list-inside list-disc">
                {integrityLinks.map((s) => (
                  <li key={s.label}>
                    <Link
                      href={`/standards/${s.slug}`}
                      className="hover:text-foreground hover:underline transition-colors"
                    >
                      {s.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>

        <p className="mt-10 border-t pt-6 text-sm text-muted-foreground">
          &copy;{year}{" "}
          <em className="font-semibold text-primary">{siteConfig.name}</em>. All
          rights reserved.
        </p>
      </Container>
    </footer>
  );
}
