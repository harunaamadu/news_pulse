"use client";

import { Link2, MessageCircle, Share2 } from "lucide-react";
import { toast } from "sonner";

import { XIcon } from "@/components/shared/brand-icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ShareButton({ title }: { title: string }) {
  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    } catch {
      toast.error("Couldn't copy the link");
    }
  }

  function openShareWindow(url: string) {
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function shareOnWhatsApp() {
    const text = `${title} ${window.location.href}`;
    openShareWindow(`https://wa.me/?text=${encodeURIComponent(text)}`);
  }

  function shareOnX() {
    const params = new URLSearchParams({
      text: title,
      url: window.location.href,
    });
    openShareWindow(`https://x.com/intent/post?${params.toString()}`);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" size="sm" variant="outline">
          <Share2 className="size-4" aria-hidden="true" />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={copyLink}>
          <Link2 className="size-4" aria-hidden="true" />
          Copy link
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={shareOnWhatsApp}>
          <MessageCircle className="size-4" aria-hidden="true" />
          WhatsApp
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={shareOnX}>
          <XIcon className="size-4" />
          Post on X
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}