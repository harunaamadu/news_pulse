"use client";

import { Check, RotateCcw } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

import { setMessageHandledAction } from "@/actions/admin-actions";
import { Button } from "@/components/ui/button";

interface HandledToggleProps {
  messageId: string;
  handled: boolean;
}

export function HandledToggle({ messageId, handled }: HandledToggleProps) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const result = await setMessageHandledAction(messageId, !handled);

      if (result.ok) toast.success(result.message);
      else toast.error(result.error);
    });
  }

  return (
    <Button
      type="button"
      size="sm"
      variant={handled ? "ghost" : "outline"}
      onClick={handleClick}
      disabled={isPending}
    >
      {handled ? (
        <RotateCcw className="size-4" aria-hidden="true" />
      ) : (
        <Check className="size-4" aria-hidden="true" />
      )}
      {handled ? "Reopen" : "Mark handled"}
    </Button>
  );
}