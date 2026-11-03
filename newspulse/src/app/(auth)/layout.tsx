import { Newspaper } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { siteConfig } from "@/config/site";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-primary p-10 text-primary-foreground lg:flex">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-primary-foreground/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 -left-16 size-96 rounded-full bg-primary-foreground/5 blur-3xl"
        />

        <Link
          href="/"
          className="relative flex items-center gap-2 text-lg font-semibold"
        >
          <Newspaper className="size-5" aria-hidden="true" />
          {siteConfig.name}
        </Link>

        <div className="relative space-y-3">
          <p className="font-serif text-3xl font-semibold leading-tight">
            Stay informed. Stay ahead. Read what matters, wherever you are.
          </p>
          <p className="text-sm text-primary-foreground/70">
            Personalized feeds · Offline reading · Live alerts
          </p>
        </div>
      </aside>

      <main className="flex flex-col items-center justify-center gap-8 p-6 sm:p-10">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold lg:hidden"
        >
          <Newspaper className="size-5" aria-hidden="true" />
          {siteConfig.name}
        </Link>
        {children}
      </main>
    </div>
  );
}
