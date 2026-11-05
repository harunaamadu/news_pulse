import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageHero } from "@/components/content/page-hero";
import { PolicyArticle } from "@/components/content/policy-article";
import { Container } from "@/components/layout/container";
import { getStandard, listStandards } from "@/content/standards";

interface StandardPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return listStandards().map((standard) => ({ slug: standard.slug }));
}

export async function generateMetadata({
  params,
}: StandardPageProps): Promise<Metadata> {
  const { slug } = await params;
  const standard = getStandard(slug);

  if (!standard) return { title: "Page not found" };

  return {
    title: standard.label,
    description: standard.summary,
    alternates: { canonical: `/standards/${standard.slug}` },
  };
}

export default async function StandardPage({ params }: StandardPageProps) {
  const { slug } = await params;
  const standard = getStandard(slug);

  if (!standard) notFound();

  const others = listStandards().filter((item) => item.slug !== standard.slug);

  return (
    <Container className="space-y-10 py-8 sm:py-10">
      <PageHero
        kicker="Standards & Integrity"
        title={standard.label}
        intro={standard.summary}
        back={{ href: "/standards", label: "All standards" }}
      />
      <PolicyArticle standard={standard} others={others} />
    </Container>
  );
}