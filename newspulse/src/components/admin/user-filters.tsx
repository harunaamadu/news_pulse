import { Search } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Role } from "@/generated/prisma/enums";
import { ROLES, ROLE_LABELS } from "@/lib/admin";

const selectClass =
  "h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 dark:bg-input/30";

interface UserFiltersProps {
  q: string;
  role?: Role;
}

// A plain GET form: it works without JavaScript and keeps filters in the URL
export function UserFilters({ q, role }: UserFiltersProps) {
  const hasFilters = Boolean(q || role);

  return (
    <form
      action="/admin/users"
      role="search"
      className="flex flex-wrap items-center gap-2"
    >
      <div className="relative min-w-60 flex-1 sm:max-w-sm">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <label htmlFor="user-search" className="sr-only">
          Search users
        </label>
        <Input
          id="user-search"
          name="q"
          type="search"
          defaultValue={q}
          maxLength={100}
          placeholder="Search name or email…"
          className="pl-9"
        />
      </div>

      <label htmlFor="user-role" className="sr-only">
        Filter by role
      </label>
      <select id="user-role" name="role" defaultValue={role ?? ""} className={selectClass}>
        <option value="">All roles</option>
        {ROLES.map((value) => (
          <option key={value} value={value}>
            {ROLE_LABELS[value]}
          </option>
        ))}
      </select>

      <Button type="submit">Apply</Button>
      {hasFilters && (
        <Button variant="ghost" asChild>
          <Link href="/admin/users">Clear</Link>
        </Button>
      )}
    </form>
  );
}