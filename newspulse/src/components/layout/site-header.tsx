import { Suspense } from "react";
import Link from "next/link";

import { auth } from "@/auth";
import {
  CategoryBar,
  CategoryBarFallback,
} from "@/components/layout/category-bar";
import { Container } from "@/components/layout/container";
import { MainNav, MainNavFallback } from "@/components/layout/main-nav";
import { MobileNav } from "@/components/layout/mobile-nav";
import { SiteLogo } from "@/components/layout/site-logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { UserMenu } from "@/components/shared/user-menu";
import { Button } from "@/components/ui/button";

import { SearchCommand } from "@/components/search/search-command";
import { NotificationBell } from "@/components/notifications/notification-bell";

async function HeaderMobileNav() {
  const session = await auth();
  return <MobileNav isAuthenticated={Boolean(session?.user)} />;
}

async function HeaderAuth() {
  const session = await auth();
  const user = session?.user;

  if (user) return <UserMenu user={user} />;

  return (
    <div className="hidden items-center gap-1 sm:flex">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/sign-in">Sign in</Link>
      </Button>
      <Button size="sm" asChild>
        <Link href="/sign-up">Join us</Link>
      </Button>
    </div>
  );
}

async function HeaderNotifications() {
  const session = await auth();
  return session?.user ? <NotificationBell /> : null;
}

function HeaderAuthFallback() {
  return (
    <div
      className="hidden h-8 w-36 animate-pulse rounded-md bg-muted sm:block"
      aria-hidden="true"
    />
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/80">
      <Container className="flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-1">
          <Suspense fallback={<MobileNav isAuthenticated={false} />}>
            <HeaderMobileNav />
          </Suspense>
          <SiteLogo />
        </div>

        <Suspense fallback={<MainNavFallback />}>
          <MainNav />
        </Suspense>

        <div className="flex items-center gap-2.5">
          <SearchCommand />
          <Suspense fallback={null}>
            <HeaderNotifications />
          </Suspense>
          <ThemeToggle />
          <Suspense fallback={<HeaderAuthFallback />}>
            <HeaderAuth />
          </Suspense>
        </div>
      </Container>

      <div className="border-t">
        <Container>
          <Suspense fallback={<CategoryBarFallback />}>
            <CategoryBar />
          </Suspense>
        </Container>
      </div>
    </header>
  );
}
