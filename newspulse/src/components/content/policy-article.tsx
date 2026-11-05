import { Mail } from "lucide-react";
import Link from "next/link";

import { editorialEmail, type Standard } from "@/content/standards";
import { formatDate } from "@/lib/format";

interface PolicyArticleProps {
  standard: Standard;
  others: Standard[];
}

export function PolicyArticle({ standard, others }: PolicyArticleProps) {
  return (
    <div className="grid gap-10 lg:grid-cols-[14rem_minmax(0,1fr)]">
      <aside className="lg:sticky lg:top-40 lg:self-start">
        <nav aria-label="On this page" className="space-y-3">
          <h2 className="font-sans text-sm font-semibold">On this page</h2>
          <ul className="space-y-1 border-l text-sm">
            {standard.sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="-ml-px block border-l border-transparent py-1 pl-4 text-muted-foreground transition-colors hover:border-brand hover:text-foreground"
                >
                  {section.heading}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <div className="min-w-0 space-y-12">
        <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-serif prose-headings:tracking-tight prose-p:leading-relaxed">
          {standard.sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              aria-labelledby={`${section.id}-heading`}
              className="scroll-mt-32"
            >
              <h2 id={`${section.id}-heading`}>{section.heading}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {section.bullets && (
                <ul>
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border bg-muted/30 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h2 className="font-sans text-base font-semibold">
              Questions or concerns?
            </h2>
            <p className="text-sm text-muted-foreground">
              Write to the editors and we&apos;ll look into it.
            </p>
          </div>
          <a
            href={`mailto:${editorialEmail}`}
            className="inline-flex items-center gap-2 text-sm font-medium underline-offset-4 hover:underline"
          >
            <Mail className="size-4" aria-hidden="true" />
            {editorialEmail}
          </a>
        </div>

        <nav aria-label="Other standards" className="space-y-4 border-t pt-8">
          <h2 className="font-sans text-sm font-semibold">
            More on our standards
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {others.map((other) => (
              <li key={other.slug}>
                <Link
                  href={`/standards/${other.slug}`}
                  className="block h-full rounded-xl border p-4 transition-colors hover:bg-muted/50"
                >
                  <span className="block font-serif font-semibold">
                    {other.label}
                  </span>
                  <span className="mt-1 line-clamp-2 block text-sm text-muted-foreground">
                    {other.summary}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <p className="text-sm text-muted-foreground">
          Last updated{" "}
          <time dateTime={standard.updated}>
            {formatDate(new Date(standard.updated))}
          </time>
        </p>
      </div>
    </div>
  );
}