import { cache } from "react";
import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";
import type { Role } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";

export type StudioUser = { id: string; name: string | null; role: Role };

function isEditorRole(role: Role): boolean {
  return role === "EDITOR" || role === "ADMIN";
}

// Reads the role from the database, not the JWT, so role changes apply
// immediately and a stale token can never grant access
const loadStudioUser = cache(async () => {
  const session = await auth();
  const id = session?.user?.id;
  if (!id) return { kind: "anonymous" as const };

  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, role: true },
  });
  if (!user || !isEditorRole(user.role)) return { kind: "forbidden" as const };

  return { kind: "ok" as const, user };
});

export async function getStudioUser(): Promise<StudioUser | null> {
  const result = await loadStudioUser();
  return result.kind === "ok" ? result.user : null;
}

// For pages: sends signed-out visitors to sign in, hides the studio from others
export async function requireStudioUser(
  callbackUrl = "/studio",
): Promise<StudioUser> {
  const result = await loadStudioUser();

  if (result.kind === "anonymous") {
    redirect(`/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }
  if (result.kind === "forbidden") notFound();

  return result.user;
}

export function canManageArticle(user: StudioUser, authorId: string): boolean {
  return user.role === "ADMIN" || user.id === authorId;
}

export async function getAdminUser(): Promise<StudioUser | null> {
  const result = await loadStudioUser();
  return result.kind === "ok" && result.user.role === "ADMIN"
    ? result.user
    : null;
}

// Same 404 for "not an admin" as for "page doesn't exist"
export async function requireAdminUser(
  callbackUrl = "/admin",
): Promise<StudioUser> {
  const result = await loadStudioUser();

  if (result.kind === "anonymous") {
    redirect(`/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }
  if (result.kind === "forbidden" || result.user.role !== "ADMIN") notFound();

  return result.user;
}
