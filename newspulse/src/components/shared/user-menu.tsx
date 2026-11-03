"use client";

import { Bookmark, LogOut } from "lucide-react";
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

interface UserMenuProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function UserMenu({ user }: UserMenuProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full" aria-label="Open account menu">
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
          <p className="truncate text-sm font-medium">{user.name ?? "Reader"}</p>
          {user.email && (
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
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