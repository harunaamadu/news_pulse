"use client";

import { Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { deleteCommentAction } from "@/actions/comment-actions";
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

interface DeleteCommentButtonProps {
  commentId: string;
  hasReplies: boolean;
}

export function DeleteCommentButton({
  commentId,
  hasReplies,
}: DeleteCommentButtonProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteCommentAction(commentId);

      if (result.ok) {
        toast.success("Comment deleted");
      } else {
        toast.error("Couldn't delete that comment.");
      }
      setOpen(false);
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-auto px-2 py-1 text-xs text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="size-3.5" aria-hidden="true" />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this comment?</AlertDialogTitle>
          <AlertDialogDescription>
            {hasReplies && "Replies to it will be deleted too. "}
            This can&apos;t be undone.
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
            {isPending ? "Deleting…" : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}