"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { deleteArticleAction } from "@/actions/studio-actions";
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

interface DeleteArticleButtonProps {
  articleId: string;
  title: string;
  redirectTo?: string;
  className?: string;
  variant?: "ghost" | "outline";
}

export function DeleteArticleButton({
  articleId,
  title,
  redirectTo,
  className,
  variant = "ghost",
}: DeleteArticleButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteArticleAction(articleId);

      if (!result.ok) {
        toast.error("Couldn't delete that story.");
        setOpen(false);
        return;
      }

      toast.success("Story deleted");
      setOpen(false);
      if (redirectTo) router.push(redirectTo);
      else router.refresh();
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          variant={variant}
          size="sm"
          className={className}
          aria-label={`Delete "${title}"`}
        >
          <Trash2 className="size-4" aria-hidden="true" />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this story?</AlertDialogTitle>
          <AlertDialogDescription>
            &ldquo;{title}&rdquo; and all of its comments and bookmarks will be
            permanently removed. This can&apos;t be undone.
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
            {isPending ? "Deleting…" : "Delete story"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}