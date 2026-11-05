import { Reply } from "lucide-react";

import { HandledToggle } from "@/components/admin/handled-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { topicLabel } from "@/lib/contact";
import { formatDate } from "@/lib/format";
import type { getContactMessages } from "@/lib/queries/messages";
import { cn } from "@/lib/utils";

type Message = Awaited<ReturnType<typeof getContactMessages>>[number];

export function MessageList({ messages }: { messages: Message[] }) {
  return (
    <ul className="space-y-4">
      {messages.map((message) => {
        const handled = message.handledAt !== null;
        const subject = encodeURIComponent(`Re: ${topicLabel(message.topic)}`);

        return (
          <li
            key={message.id}
            className={cn(
              "space-y-4 rounded-2xl border bg-card p-5",
              handled && "opacity-70",
            )}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 space-y-1">
                <p className="flex flex-wrap items-center gap-2 text-sm font-medium">
                  {message.name}
                  <a
                    href={`mailto:${message.email}`}
                    className="font-normal text-muted-foreground underline-offset-4 hover:underline"
                  >
                    {message.email}
                  </a>
                </p>
                <p className="text-xs text-muted-foreground">
                  <time dateTime={message.createdAt.toISOString()}>
                    {formatDate(message.createdAt)}
                  </time>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{topicLabel(message.topic)}</Badge>
                {handled ? (
                  <Badge className="bg-emerald-600 text-white hover:bg-emerald-600">
                    Handled
                  </Badge>
                ) : (
                  <Badge className="bg-brand text-white hover:bg-brand">New</Badge>
                )}
              </div>
            </div>

            <p className="whitespace-pre-wrap wrap-break-word text-sm leading-relaxed">
              {message.message}
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <Button size="sm" asChild>
                <a href={`mailto:${message.email}?subject=${subject}`}>
                  <Reply className="size-4" aria-hidden="true" />
                  Reply by email
                </a>
              </Button>
              <HandledToggle messageId={message.id} handled={handled} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}