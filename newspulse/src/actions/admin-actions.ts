"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { ROLE_LABELS } from "@/lib/admin";
import { getAdminUser } from "@/lib/auth-guards";
import { prisma } from "@/lib/prisma";

export type AdminActionResult =
  | { ok: true; message: string }
  | { ok: false; error: string };

const roleSchema = z.enum(["USER", "EDITOR", "ADMIN"]);
const idSchema = z.string().min(1).max(50);

const NO_ACCESS = "You don't have access to this action.";

function revalidateAdmin() {
  revalidatePath("/admin");
  revalidatePath("/admin/users");
}

export async function updateUserRoleAction(
  userId: string,
  role: string,
): Promise<AdminActionResult> {
  const admin = await getAdminUser();
  if (!admin) return { ok: false, error: NO_ACCESS };

  const id = idSchema.safeParse(userId);
  const nextRole = roleSchema.safeParse(role);
  if (!id.success || !nextRole.success) {
    return { ok: false, error: "Invalid request." };
  }
  if (id.data === admin.id) {
    return { ok: false, error: "You can't change your own role." };
  }

  try {
    const result = await prisma.$transaction(
      async (tx): Promise<AdminActionResult> => {
        const target = await tx.user.findUnique({
          where: { id: id.data },
          select: { name: true, email: true, role: true },
        });
        if (!target) return { ok: false, error: "This user no longer exists." };

        if (target.role === nextRole.data) {
          return { ok: true, message: "That's already their role." };
        }

        if (target.role === "ADMIN") {
          const admins = await tx.user.count({ where: { role: "ADMIN" } });
          if (admins <= 1) {
            return { ok: false, error: "At least one admin must remain." };
          }
        }

        await tx.user.update({
          where: { id: id.data },
          data: { role: nextRole.data },
        });

        return {
          ok: true,
          message: `${target.name ?? target.email} is now ${ROLE_LABELS[nextRole.data]}.`,
        };
      },
    );

    if (result.ok) {
      revalidateAdmin();
      revalidatePath("/studio");
    }
    return result;
  } catch {
    return { ok: false, error: "Couldn't update that role. Please try again." };
  }
}

export async function deleteUserAction(
  userId: string,
): Promise<AdminActionResult> {
  const admin = await getAdminUser();
  if (!admin) return { ok: false, error: NO_ACCESS };

  const id = idSchema.safeParse(userId);
  if (!id.success) return { ok: false, error: "Invalid request." };
  if (id.data === admin.id) {
    return { ok: false, error: "You can't delete your own account here." };
  }

  const target = await prisma.user.findUnique({
    where: { id: id.data },
    select: {
      name: true,
      email: true,
      role: true,
      _count: { select: { articles: true } },
    },
  });
  if (!target) return { ok: false, error: "This user no longer exists." };

  if (target.role === "ADMIN") {
    return { ok: false, error: "Change this admin's role before deleting them." };
  }
  // Stories cascade-delete with their author, so refuse instead of losing content
  if (target._count.articles > 0) {
    return {
      ok: false,
      error: `They have ${target._count.articles} stor${target._count.articles === 1 ? "y" : "ies"}. Delete those first.`,
    };
  }

  try {
    await prisma.user.delete({ where: { id: id.data } });
  } catch {
    return { ok: false, error: "Couldn't delete that user. Please try again." };
  }

  revalidateAdmin();
  return { ok: true, message: `${target.name ?? target.email} was deleted.` };
}