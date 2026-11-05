import type { Metadata } from "next";
import Link from "next/link";

import { PageHero } from "@/components/content/page-hero";
import { StandardIcon } from "@/components/content/standard-icon";
import { Container } from "@/components/layout/container";
import {
  StaggerGroup,
  StaggerItem,
} from "@/components/shared/motion-primitives";
import { siteConfig } from "@/config/site";
import { listStandards } from "@/content/standards";

export const metadata: Metadata = {
  title: "Standards & Integrity",
  description:
    "The principles and practices that guide reporting at NewsPulse.",
  alternates: { canonical: "/standards" },
};

export default function StandardsPage() {
  const standards = listStandards();
  const intro =
    siteConfig.standardsAndIntegrity.find((item) => "paragraph" in item)
      ?.paragraph ??
    "The principles and practices that guide our reporting.";

  return (
    <Container className="space-y-10 py-8 sm:py-10">
      <PageHero
        kicker="About"
        title="Standards & Integrity"
        intro={intro}
      />

      <StaggerGroup as="ul" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {standards.map((standard) => (
          <StaggerItem as="li" key={standard.slug}>
            <div className="group relative flex h-full flex-col gap-4 rounded-2xl border bg-card p-6 transition-shadow duration-300 hover:shadow-lg has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-ring">
              <div className="flex size-12 items-center justify-center rounded-xl bg-brand/10 text-brand transition-colors group-hover:bg-brand group-hover:text-white">
                <StandardIcon slug={standard.slug} className="size-6" />
              </div>
              <div className="space-y-1.5">
                <h2 className="text-xl font-semibold">
                  <Link
                    href={`/standards/${standard.slug}`}
                    className="after:absolute after:inset-0 focus-visible:outline-none"
                  >
                    {standard.label}
                  </Link>
                </h2>
                <p className="text-sm text-muted-foreground">
                  {standard.summary}
                </p>
              </div>
            </div>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </Container>
  );
}