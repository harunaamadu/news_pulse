import { DeleteUserButton } from "@/components/admin/delete-user-button";
import { RoleSelect } from "@/components/admin/role-select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PROVIDER_LABELS, type AdminUserRow } from "@/lib/admin";
import { formatDate } from "@/lib/format";
import { getInitials } from "@/lib/utils";

function getBlockedReason(user: AdminUserRow, isSelf: boolean) {
  if (isSelf) return "You can't delete your own account.";
  if (user.role === "ADMIN") return "Change this admin's role before deleting.";
  if (user._count.articles > 0) {
    const count = user._count.articles;
    return `Has ${count} ${count === 1 ? "story" : "stories"}. Delete those first.`;
  }
  return undefined;
}

interface UsersTableProps {
  users: AdminUserRow[];
  currentUserId: string;
}

export function UsersTable({ users, currentUserId }: UsersTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="hidden md:table-cell">Sign-in</TableHead>
            <TableHead className="hidden lg:table-cell">Activity</TableHead>
            <TableHead className="hidden sm:table-cell">Joined</TableHead>
            <TableHead className="text-right">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => {
            const isSelf = user.id === currentUserId;
            const displayName = user.name ?? user.email;

            return (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="size-9">
                      <AvatarImage src={user.image ?? undefined} alt="" />
                      <AvatarFallback className="text-xs font-medium">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="flex items-center gap-2 text-sm font-medium">
                        <span className="truncate">{user.name ?? "Unnamed"}</span>
                        {isSelf && <Badge variant="outline">You</Badge>}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  {/* key remounts the control when the server value changes */}
                  <RoleSelect
                    key={`${user.id}:${user.role}`}
                    userId={user.id}
                    userName={displayName}
                    initialRole={user.role}
                    disabled={isSelf}
                  />
                </TableCell>

                <TableCell className="hidden md:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {user.hasPassword && <Badge variant="secondary">Email</Badge>}
                    {user.providers.map((provider) => (
                      <Badge key={provider} variant="secondary">
                        {PROVIDER_LABELS[provider] ?? provider}
                      </Badge>
                    ))}
                  </div>
                </TableCell>

                <TableCell className="hidden whitespace-nowrap text-sm tabular-nums text-muted-foreground lg:table-cell">
                  {user._count.articles} stories · {user._count.comments} comments
                </TableCell>

                <TableCell className="hidden whitespace-nowrap text-muted-foreground sm:table-cell">
                  {formatDate(user.createdAt)}
                </TableCell>

                <TableCell className="text-right">
                  <DeleteUserButton
                    userId={user.id}
                    userName={displayName}
                    blockedReason={getBlockedReason(user, isSelf)}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}