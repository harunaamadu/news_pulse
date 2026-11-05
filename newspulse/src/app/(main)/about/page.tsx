import {
  Bell,
  Download,
  MessageSquare,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { PageHero } from "@/components/content/page-hero";
import { StandardIcon } from "@/components/content/standard-icon";
import { Container } from "@/components/layout/container";
import {
  Reveal,
  StaggerGroup,
  StaggerItem,
} from "@/components/shared/motion-primitives";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { siteConfig } from "@/config/site";
import { listStandards } from "@/content/standards";
import { formatNumber } from "@/lib/admin";
import { countPublishedArticles } from "@/lib/queries/articles";

export const metadata: Metadata = {
  title: "About us",
  description:
    "NewsPulse is an editorial news platform built around personalized feeds, real-time alerts, offline reading and community discussion.",
  alternates: { canonical: "/about" },
};

const features: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Sparkles,
    title: "A feed that's yours",
    description:
      "Follow the sections you care about and your front page adapts, without hiding the day's biggest stories.",
  },
  {
    icon: Bell,
    title: "Alerts that matter",
    description:
      "Get notified about new stories in your topics and replies to your comments, and nothing more.",
  },
  {
    icon: Download,
    title: "Read anywhere",
    description:
      "Save a story and it stays readable offline: on a train, on a plane or on a patchy connection.",
  },
  {
    icon: MessageSquare,
    title: "Conversation, not noise",
    description:
      "Threaded discussion on every story, moderated under clear rules, so readers can think out loud together.",
  },
];

export default function AboutPage() {
  const standards = listStandards().slice(0, 3);

  return (
    <Container className="space-y-16 py-8 sm:py-10">
      <PageHero
        kicker="About"
        title="News that keeps up with you"
        intro="NewsPulse is an editorial news platform for readers who want depth, clarity and a front page that reflects what matters to them."
      />

      <Suspense fallback={<Skeleton className="h-28 rounded-2xl" />}>
        <AboutStats />
      </Suspense>

      <section aria-labelledby="different-heading" className="space-y-6">
        <h2 id="different-heading" className="text-3xl font-semibold">
          What makes NewsPulse different
        </h2>
        <StaggerGroup as="ul" className="grid gap-6 sm:grid-cols-2">
          {features.map(({ icon: Icon, title, description }) => (
            <StaggerItem as="li" key={title}>
              <div className="group flex h-full gap-4 rounded-2xl border bg-card p-6 transition-shadow duration-300 hover:shadow-lg">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand transition-colors group-hover:bg-brand group-hover:text-white">
                  <Icon className="size-6" aria-hidden="true" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-xl font-semibold">{title}</h3>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      <section aria-labelledby="how-heading" className="space-y-6">
        <div className="max-w-2xl space-y-3">
          <h2 id="how-heading" className="text-3xl font-semibold">
            How we work
          </h2>
          <p className="text-muted-foreground">
            Every story is reported, checked and edited before it reaches you,
            and when we get something wrong we say so plainly. These are the
            commitments behind that.
          </p>
        </div>

        <ul className="grid gap-4 sm:grid-cols-3">
          {standards.map((standard) => (
            <li key={standard.slug}>
              <Link
                href={`/standards/${standard.slug}`}
                className="group block h-full space-y-3 rounded-2xl border p-5 transition-colors hover:bg-muted/50"
              >
                <StandardIcon
                  slug={standard.slug}
                  className="size-6 text-brand"
                />
                <span className="block font-serif text-lg font-semibold">
                  {standard.label}
                </span>
                <span className="line-clamp-3 block text-sm text-muted-foreground">
                  {standard.summary}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <Button variant="link" asChild className="h-auto p-0">
          <Link href="/standards">See all our standards →</Link>
        </Button>
      </section>

      <Reveal>
        <section
          aria-labelledby="cta-heading"
          className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-neutral-950 p-8 text-neutral-100 sm:flex-row sm:items-center"
        >
          <div className="space-y-2">
            <h2 id="cta-heading" className="text-2xl font-semibold">
              Have a tip, a correction or a question?
            </h2>
            <p className="max-w-lg text-sm text-neutral-400">
              We read every message. Tell us what we should be covering, or what
              we got wrong.
            </p>
          </div>
          <Button asChild className="shrink-0">
            <Link href="/contact">Contact the editors</Link>
          </Button>
        </section>
      </Reveal>
    </Container>
  );
}

async function AboutStats() {
  const stories = await countPublishedArticles();

  const stats = [
    { label: "Stories published", value: stories },
    { label: "Sections covered", value: siteConfig.categories.length },
    { label: "Published standards", value: listStandards().length },
  ];

  return (
    <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl border bg-card p-6 text-center"
        >
          <dd className="font-serif text-4xl font-bold tabular-nums">
            {formatNumber(stat.value)}
          </dd>
          <dt className="mt-1 text-sm text-muted-foreground">{stat.label}</dt>
        </div>
      ))}
    </dl>
  );
}