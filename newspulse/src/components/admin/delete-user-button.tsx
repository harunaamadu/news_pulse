"use client";

import { Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { deleteUserAction } from "@/actions/admin-actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface DeleteUserButtonProps {
  userId: string;
  userName: string;
  blockedReason?: string;
}

export function DeleteUserButton({
  userId,
  userName,
  blockedReason,
}: DeleteUserButtonProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteUserAction(userId);

      if (result.ok) toast.success(result.message);
      else toast.error(result.error);
      setOpen(false);
    });
  }

  if (blockedReason) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled
        title={blockedReason}
        aria-label={`Can't delete ${userName}: ${blockedReason}`}
      >
        <Trash2 className="size-4" aria-hidden="true" />
      </Button>
    );
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={`Delete ${userName}`}
          className="text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="size-4" aria-hidden="true" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {userName}?</AlertDialogTitle>
          <AlertDialogDescription>
            Their account, bookmarks, followed topics and notifications will be
            permanently removed, along with their comments and any replies to
            those comments. This can&apos;t be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            onClick={(event) => {
              event.preventDefault();
              handleDelete();
            }}
          >
            {isPending ? "Deleting…" : "Delete user"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}