import { FilePenLine, Mail, Newspaper } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { z } from "zod";

import { auth } from "@/auth";
import { ContactForm } from "@/components/contact/contact-form";
import { PageHero } from "@/components/content/page-hero";
import { Container } from "@/components/layout/container";
import { Skeleton } from "@/components/ui/skeleton";
import { editorialEmail } from "@/content/standards";
import { CONTACT_TOPIC_VALUES } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Send a question, a correction request, a story tip or a press enquiry to the NewsPulse editors.",
  alternates: { canonical: "/contact" },
};

interface ContactPageProps {
  searchParams: Promise<{ topic?: string | string[] }>;
}

const topicSchema = z.enum(CONTACT_TOPIC_VALUES).catch("GENERAL");

export default function ContactPage({ searchParams }: ContactPageProps) {
  return (
    <Container className="space-y-10 py-8 sm:py-10">
      <PageHero
        kicker="Contact"
        title="Get in touch"
        intro="Questions, corrections, tips and press enquiries all reach the editors. Tell us what you need and we'll point it at the right person."
      />

      <div className="grid gap-8 lg:grid-cols-3">
        <section
          aria-labelledby="contact-form-heading"
          className="rounded-2xl border bg-card p-6 sm:p-8 lg:col-span-2"
        >
          <h2 id="contact-form-heading" className="mb-6 text-2xl font-semibold">
            Send us a message
          </h2>
          <Suspense fallback={<Skeleton className="h-96 rounded-xl" />}>
            <ContactFormSection searchParams={searchParams} />
          </Suspense>
        </section>

        <aside aria-label="Other ways to reach us" className="space-y-4">
          <div className="space-y-2 rounded-2xl border p-5">
            <Mail className="size-5 text-brand" aria-hidden="true" />
            <h2 className="font-sans text-base font-semibold">Email the editors</h2>
            <p className="text-sm text-muted-foreground">
              Prefer your own mail app? Write to us directly.
            </p>
            <a
              href={`mailto:${editorialEmail}`}
              className="inline-block break-all text-sm font-medium underline-offset-4 hover:underline"
            >
              {editorialEmail}
            </a>
          </div>

          <div className="space-y-2 rounded-2xl border p-5">
            <FilePenLine className="size-5 text-brand" aria-hidden="true" />
            <h2 className="font-sans text-base font-semibold">Spotted a mistake?</h2>
            <p className="text-sm text-muted-foreground">
              Read how we handle corrections, then tell us what we got wrong.
            </p>
            <Link
              href="/contact?topic=correction"
              className="inline-block text-sm font-medium underline-offset-4 hover:underline"
            >
              Report an error
            </Link>
          </div>

          <div className="space-y-2 rounded-2xl border p-5">
            <Newspaper className="size-5 text-brand" aria-hidden="true" />
            <h2 className="font-sans text-base font-semibold">Our standards</h2>
            <p className="text-sm text-muted-foreground">
              How we report, check facts and keep our work independent.
            </p>
            <Link
              href="/standards"
              className="inline-block text-sm font-medium underline-offset-4 hover:underline"
            >
              Read our standards
            </Link>
          </div>
        </aside>
      </div>
    </Container>
  );
}

async function ContactFormSection({ searchParams }: ContactPageProps) {
  const [session, raw] = await Promise.all([auth(), searchParams]);
  const rawTopic = Array.isArray(raw.topic) ? raw.topic[0] : raw.topic;

  return (
    <ContactForm
      defaults={{
        name: session?.user?.name ?? "",
        email: session?.user?.email ?? "",
        topic: topicSchema.parse(rawTopic?.toUpperCase()),
      }}
    />
  );
}