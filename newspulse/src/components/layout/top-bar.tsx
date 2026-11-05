import { PenSquare, ShieldCheck, SlidersHorizontal, Zap } from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";

import { auth } from "@/auth";
import { Container } from "@/components/layout/container";
import { FlashTicker, type FlashItem } from "@/components/layout/flash-ticker";
import { LiveSync } from "@/components/layout/live-sync";
import { siteConfig } from "@/config/site";
import { getFlashArticles } from "@/lib/queries/articles";
import { getCityWeather } from "@/lib/weather";

function shortTag(category: { name: string; slug: string }): string {
  const configured = siteConfig.categories.find(
    (item) => item.slug === category.slug,
  );
  return configured?.short ?? category.name.slice(0, 6).toUpperCase();
}

export async function TopBar() {
  const [session, flash, weather] = await Promise.all([
    auth(),
    getFlashArticles(6),
    getCityWeather(),
  ]);

  const items: FlashItem[] = flash.map((article) => ({
    id: article.id,
    slug: article.slug,
    title: article.title,
    tag: shortTag(article.category),
    publishedAt: article.publishedAt.toISOString(),
  }));

  // Links only: the pages themselves check the role in the database
  const role = session?.user?.role;
  const roleLink =
    role === "ADMIN"
      ? { href: "/admin", label: "Admin", icon: ShieldCheck }
      : role === "EDITOR"
        ? { href: "/studio", label: "Studio", icon: PenSquare }
        : null;

  return (
    <div className="border-b border-white/10 bg-neutral-950 text-neutral-200">
      <Container className="flex h-10 items-center gap-4">
        <span className="inline-flex shrink-0 items-center gap-2 rounded border-[0.02mm]! border-rose-300/70 bg-rose-300/15 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-rose-400">
          <span className="relative flex size-2 scale-80" aria-hidden="true">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-rose-400 opacity-70 motion-reduce:animate-none" />
            <span className="relative inline-flex size-2 rounded-full bg-rose-400" />
          </span>
          <Zap className="size-3.5" aria-hidden="true" />
          Flash
        </span>

        <span className="hidden h-4 w-px bg-white/20 sm:block" aria-hidden="true" />

        <FlashTicker items={items} />

        <div className="hidden shrink-0 items-center gap-5 text-xs lg:flex">
          {weather.length > 0 && (
            <p
              className="flex items-center gap-2 text-neutral-400"
              title="Temperatures update every 15 minutes"
            >
              <span className="sr-only">Current weather: </span>
              {weather.map((city, index) => (
                <Fragment key={city.name}>
                  {index > 0 && <span aria-hidden="true">·</span>}
                  <span>
                    {city.name}{" "}
                    <span className="tabular-nums text-neutral-100">
                      {city.temperature}°C
                    </span>
                  </span>
                </Fragment>
              ))}
            </p>
          )}

          <LiveSync />

          <Link
            href="/topics"
            className="inline-flex items-center gap-1.5 font-medium uppercase tracking-wider text-neutral-400 transition-colors hover:text-white"
          >
            <SlidersHorizontal className="size-3.5" aria-hidden="true" />
            Personalize feed
          </Link>

          {roleLink && (
            <>
              <span className="text-neutral-600" aria-hidden="true">
                ·
              </span>
              <Link
                href={roleLink.href}
                className="inline-flex items-center gap-1.5 font-semibold uppercase tracking-wider text-neutral-200 transition-colors hover:text-white"
              >
                <roleLink.icon
                  className="size-3.5 text-emerald-400"
                  aria-hidden="true"
                />
                {roleLink.label}
              </Link>
            </>
          )}
        </div>
      </Container>
    </div>
  );
}

// Same height as the real bar, so nothing jumps when it streams in
export function TopBarSkeleton() {
  return (
    <div
      className="h-10 border-b border-white/10 bg-neutral-950"
      aria-hidden="true"
    />
  );
}