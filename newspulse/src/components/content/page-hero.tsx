import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { Reveal } from "@/components/shared/motion-primitives";

interface PageHeroProps {
  kicker: string;
  title: string;
  intro: string;
  back?: { href: string; label: string };
  meta?: ReactNode;
}

export function PageHero({ kicker, title, intro, back, meta }: PageHeroProps) {
  return (
    <Reveal>
      <header className="space-y-4 border-b-2 border-foreground pb-8">
        {back && (
          <Link
            href={back.href}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            {back.label}
          </Link>
        )}
        <p className="text-sm font-semibold uppercase tracking-widest text-brand">
          {kicker}
        </p>
        <h1 className="text-4xl font-bold sm:text-5xl">{title}</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">{intro}</p>
        {meta}
      </header>
    </Reveal>
  );
}