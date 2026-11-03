"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CornerDownRight } from "lucide-react";
import { useState } from "react";

import { CommentForm } from "@/components/comments/comment-form";
import { DeleteCommentButton } from "@/components/comments/delete-comment-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { Role } from "@/generated/prisma/enums"; // added /enums to the import path
import { formatDate } from "@/lib/format";
import { cn, getInitials } from "@/lib/utils";
import type { CommentWithAuthor } from "@/types";

interface CommentItemProps {
  comment: CommentWithAuthor;
  replies?: CommentWithAuthor[];
  articleId: string;
  currentUser: { id: string; role: Role } | null;
  isReply?: boolean;
}

export function CommentItem({
  comment,
  replies = [],
  articleId,
  currentUser,
  isReply = false,
}: CommentItemProps) {
  const [replying, setReplying] = useState(false);

  const canDelete =
    currentUser !== null &&
    (currentUser.id === comment.authorId || currentUser.role === "ADMIN");

  return (
    <div className="flex gap-3">
      <Avatar className={cn("shrink-0", isReply ? "size-8" : "size-10")}>
        <AvatarImage src={comment.author.image ?? undefined} alt="" />
        <AvatarFallback className="text-xs font-medium">
          {getInitials(comment.author.name)}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex flex-wrap items-baseline gap-x-2 text-sm">
          <span className="font-medium">{comment.author.name ?? "Reader"}</span>
          <time
            dateTime={comment.createdAt.toISOString()}
            className="text-xs text-muted-foreground"
          >
            {formatDate(comment.createdAt)}
          </time>
        </div>

        <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
          {comment.body}
        </p>

        <div className="-ml-2 flex items-center gap-1">
          {!isReply && currentUser && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              aria-expanded={replying}
              onClick={() => setReplying((value) => !value)}
              className="h-auto px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <CornerDownRight className="size-3.5" aria-hidden="true" />
              {replying ? "Cancel" : "Reply"}
            </Button>
          )}
          {canDelete && (
            <DeleteCommentButton
              commentId={comment.id}
              hasReplies={replies.length > 0}
            />
          )}
        </div>

        <AnimatePresence initial={false}>
          {replying && (
            <motion.div
              key="reply-form"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="pt-1">
                <CommentForm
                  articleId={articleId}
                  parentId={comment.id}
                  placeholder={`Reply to ${comment.author.name ?? "this comment"}…`}
                  submitLabel="Post reply"
                  autoFocus
                  onSuccess={() => setReplying(false)}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {replies.length > 0 && (
          <ul className="space-y-5 border-l pl-4 pt-3">
            {replies.map((reply) => (
              <li key={reply.id}>
                <CommentItem
                  comment={reply}
                  articleId={articleId}
                  currentUser={currentUser}
                  isReply
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}