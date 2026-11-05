"use client";

import { motion } from "framer-motion";
import { Check, Plus } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { toggleFollowCategoryAction } from "@/actions/follow-actions";
import { Button } from "@/components/ui/button";

interface FollowButtonProps {
  categoryId: string;
  categoryName: string;
  initialFollowing: boolean;
  isAuthenticated: boolean;
  size?: "sm" | "default";
}

export function FollowButton({
  categoryId,
  categoryName,
  initialFollowing,
  isAuthenticated,
  size = "sm",
}: FollowButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [following, setFollowing] = useState(initialFollowing);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!isAuthenticated) {
      router.push(`/sign-in?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    const next = !following;
    setFollowing(next); // optimistic

    startTransition(async () => {
      const result = await toggleFollowCategoryAction(categoryId);

      if (!result.ok) {
        setFollowing(!next); // roll back
        toast.error("Couldn't update your topics. Please try again.");
        return;
      }

      setFollowing(result.following);
      toast.success(
        result.following
          ? `You're following ${categoryName}`
          : `Unfollowed ${categoryName}`,
      );
    });
  }

  return (
    <Button
      type="button"
      size={size}
      variant={following ? "secondary" : "default"}
      onClick={handleClick}
      disabled={isPending}
    >
      <motion.span
        key={String(following)}
        initial={{ scale: 0.5, rotate: -45 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 20 }}
        className="inline-flex"
      >
        {following ? (
          <Check className="size-4" aria-hidden="true" />
        ) : (
          <Plus className="size-4" aria-hidden="true" />
        )}
      </motion.span>
      {following ? "Following" : "Follow"}
      <span className="sr-only"> {categoryName}</span>
    </Button>
  );
}