"use client";

import Link from "next/link";
import { useTransition } from "react";

import { signOutAction } from "@/actions/auth-actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getInitials } from "@/lib/utils";

import { clearOfflineData } from "@/lib/offline/offline-store";
import { Bookmark, LayoutDashboard, LogOut, PenSquare } from "lucide-react";
import type { Role } from "@/generated/prisma/enums";

interface UserMenuProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: Role;
  };
}

export function UserMenu({ user }: UserMenuProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          aria-label="Open account menu"
        >
          <Avatar className="size-8">
            <AvatarImage src={user.image ?? undefined} alt="" />
            <AvatarFallback className="text-xs font-medium">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="space-y-0.5 font-normal">
          <p className="truncate text-sm font-medium">
            {user.name ?? "Reader"}
          </p>
          {user.email && (
            <p className="truncate text-xs text-muted-foreground">
              {user.email}
            </p>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {user.role === "ADMIN" && (
          <DropdownMenuItem asChild>
            <Link href="/admin">
              <LayoutDashboard className="size-4" aria-hidden="true" />
              Admin
            </Link>
          </DropdownMenuItem>
        )}

        {(user.role === "EDITOR" || user.role === "ADMIN") && (
          <DropdownMenuItem asChild>
            <Link href="/studio">
              <PenSquare className="size-4" aria-hidden="true" />
              Studio
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem asChild>
          <Link href="/bookmarks">
            <Bookmark className="size-4" aria-hidden="true" />
            Bookmarks
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={isPending}
          onSelect={(event) => {
            event.preventDefault();
            startTransition(async () => {
              await clearOfflineData();
              await signOutAction();
            });
          }}
        >
          <LogOut className="size-4" aria-hidden="true" />
          {isPending ? "Signing out…" : "Sign out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
