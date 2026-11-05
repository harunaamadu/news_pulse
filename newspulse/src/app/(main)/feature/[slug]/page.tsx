import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { ComingSoon } from "@/components/content/coming-soon";
import { Credits } from "@/components/content/credits";
import {
  FeatureStories,
  FeatureStoriesSkeleton,
} from "@/components/content/feature-stories";
import { PageHero } from "@/components/content/page-hero";
import { Container } from "@/components/layout/container";
import { siteConfig } from "@/config/site";
import { getFeature } from "@/content/features";

interface FeaturePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return siteConfig.featuresAndExpeditions.map((feature) => ({
    slug: feature.slug,
  }));
}

export async function generateMetadata({
  params,
}: FeaturePageProps): Promise<Metadata> {
  const { slug } = await params;
  const feature = getFeature(slug);

  if (!feature) return { title: "Page not found" };

  return {
    title: feature.label,
    description: feature.intro,
    alternates: { canonical: `/feature/${feature.slug}` },
    // Placeholder pages shouldn't be indexed until they have content
    ...(feature.soon ? { robots: { index: false, follow: true } } : {}),
  };
}

export default async function FeaturePage({ params }: FeaturePageProps) {
  const { slug } = await params;
  const feature = getFeature(slug);

  if (!feature) notFound();

  return (
    <Container className="space-y-10 py-8 sm:py-10">
      <PageHero
        kicker={feature.kicker}
        title={feature.label}
        intro={feature.intro}
      />

      {feature.soon ? (
        <ComingSoon label={feature.label} />
      ) : feature.credits ? (
        <Credits />
      ) : feature.categorySlug ? (
        <Suspense fallback={<FeatureStoriesSkeleton />}>
          <FeatureStories categorySlug={feature.categorySlug} />
        </Suspense>
      ) : null}
    </Container>
  );
}