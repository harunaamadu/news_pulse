import { ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";

import { AdminNav } from "@/components/admin/admin-nav";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/shared/motion-primitives";
import { cn } from "@/lib/utils";

interface AdminShellProps {
  title: string;
  description: string;
  actions?: ReactNode;
  children: ReactNode;
}

// Rendered by each page AFTER its access check, never from a layout:
// a layout would flash the admin chrome to non-admins on the 404 page
export function AdminShell({
  title,
  description,
  actions,
  children,
}: AdminShellProps) {
  return (
    <Container className="space-y-8 py-8 sm:py-10">
      <Reveal>
        <header className="space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="space-y-3">
              <p className="inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-widest text-brand">
                <ShieldCheck className="size-4" aria-hidden="true" />
                Admin
              </p>
              <h1 className="text-4xl font-bold sm:text-5xl">{title}</h1>
              <p className="max-w-2xl text-muted-foreground">{description}</p>
            </div>
            {actions}
          </div>
          <div className="border-b">
            <AdminNav />
          </div>
        </header>
      </Reveal>

      {children}
    </Container>
  );
}

interface ChartCardProps {
  title: string;
  description: string;
  stat?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function ChartCard({
  title,
  description,
  stat,
  className,
  children,
}: ChartCardProps) {
  return (
    <section className={cn("space-y-4 rounded-2xl border bg-card p-5", className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h2 className="font-sans text-base font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {stat}
      </div>
      {children}
    </section>
  );
}