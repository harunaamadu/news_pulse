import Link from "next/link";

import { auth } from "@/auth";
import { CategoryBar } from "@/components/layout/category-bar";
import { Container } from "@/components/layout/container";
import { MainNav } from "@/components/layout/main-nav";
import { MobileNav } from "@/components/layout/mobile-nav";
import { SiteLogo } from "@/components/layout/site-logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { UserMenu } from "@/components/shared/user-menu";
import { Button } from "@/components/ui/button";

export async function SiteHeader() {
  const session = await auth();
  const user = session?.user;

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container className="flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-1">
          <MobileNav isAuthenticated={Boolean(user)} />
          <SiteLogo />
        </div>

        <MainNav />

        <div className="flex items-center gap-1">
          <ThemeToggle />
          {user ? (
            <UserMenu user={user} />
          ) : (
            <div className="hidden items-center gap-1 sm:flex">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/sign-in">Sign in</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/sign-up">Join us</Link>
              </Button>
            </div>
          )}
        </div>
      </Container>

      <div className="border-t">
        <Container>
          <CategoryBar />
        </Container>
      </div>
    </header>
  );
}