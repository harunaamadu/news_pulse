"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { updateUserRoleAction } from "@/actions/admin-actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Role } from "@/generated/prisma/enums";
import { ROLES, ROLE_LABELS } from "@/lib/admin";

interface RoleSelectProps {
  userId: string;
  userName: string;
  initialRole: Role;
  disabled?: boolean;
}

export function RoleSelect({
  userId,
  userName,
  initialRole,
  disabled,
}: RoleSelectProps) {
  const [role, setRole] = useState<Role>(initialRole);
  const [isPending, startTransition] = useTransition();

  function handleChange(next: string) {
    const previous = role;
    setRole(next as Role); // optimistic

    startTransition(async () => {
      const result = await updateUserRoleAction(userId, next);

      if (!result.ok) {
        setRole(previous); // roll back
        toast.error(result.error);
        return;
      }
      toast.success(result.message);
    });
  }

  return (
    <Select
      value={role}
      onValueChange={handleChange}
      disabled={disabled || isPending}
    >
      <SelectTrigger
        className="h-8 w-28"
        aria-label={`Role for ${userName}`}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {ROLES.map((value) => (
          <SelectItem key={value} value={value}>
            {ROLE_LABELS[value]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}