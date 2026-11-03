"use client";

import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";

import { addCommentAction } from "@/actions/comment-actions";
import { SubmitButton } from "@/components/auth/submit-button";
import { Textarea } from "@/components/ui/textarea";
import type { ActionState } from "@/types";

const initialState: ActionState = {};

interface CommentFormProps {
  articleId: string;
  parentId?: string | null;
  placeholder?: string;
  submitLabel?: string;
  autoFocus?: boolean;
  onSuccess?: () => void;
}

export function CommentForm({
  articleId,
  parentId = null,
  placeholder = "Share your thoughts…",
  submitLabel = "Post comment",
  autoFocus = false,
  onSuccess,
}: CommentFormProps) {
  const boundAction = addCommentAction.bind(null, articleId, parentId);
  const [state, formAction] = useActionState(boundAction, initialState);

  // Keep the latest callback without re-running the success effect
  const onSuccessRef = useRef(onSuccess);
  useEffect(() => {
    onSuccessRef.current = onSuccess;
  });

  useEffect(() => {
    if (!state.success) return;
    toast.success(parentId ? "Reply posted" : "Comment posted");
    onSuccessRef.current?.();
  }, [state, parentId]);

  const fieldId = `comment-${parentId ?? articleId}`;
  const errorId = `${fieldId}-error`;
  const error = state.error ?? state.fieldErrors?.body?.[0];

  return (
    <form action={formAction} className="space-y-3">
      <label htmlFor={fieldId} className="sr-only">
        {parentId ? "Write a reply" : "Write a comment"}
      </label>
      <Textarea
        id={fieldId}
        name="body"
        rows={parentId ? 3 : 4}
        maxLength={1000}
        required
        autoFocus={autoFocus}
        placeholder={placeholder}
        defaultValue={state.values?.body}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className="resize-y"
      />
      {error && (
        <p id={errorId} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      <div className="flex justify-end">
        <SubmitButton size="sm">{submitLabel}</SubmitButton>
      </div>
    </form>
  );
}