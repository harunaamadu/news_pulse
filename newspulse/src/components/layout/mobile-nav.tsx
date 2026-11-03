"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { siteConfig } from "@/config/site";

export function MobileNav({ isAuthenticated }: { isAuthenticated: boolean }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-serif text-xl">{siteConfig.name}</SheetTitle>
          <SheetDescription className="sr-only">Site navigation</SheetDescription>
        </SheetHeader>

        <nav aria-label="Mobile" className="flex flex-col gap-6 px-4 pb-6">
          <ul className="space-y-1">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={close}
                  className="block rounded-md px-3 py-2 text-base font-medium hover:bg-accent"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="space-y-2">
            <p className="px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Sections
            </p>
            <ul className="space-y-1">
              {siteConfig.categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/category/${category.slug}`}
                    onClick={close}
                    className="block rounded-md px-3 py-2 text-sm hover:bg-accent"
                  >
                    {category.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {!isAuthenticated && (
            <div className="grid gap-2">
              <Button asChild onClick={close}>
                <Link href="/sign-up">Join us</Link>
              </Button>
              <Button variant="outline" asChild onClick={close}>
                <Link href="/sign-in">Sign in</Link>
              </Button>
            </div>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
}