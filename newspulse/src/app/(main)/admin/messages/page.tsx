import { Inbox } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";

import { AdminShell } from "@/components/admin/admin-shell";
import { AdminPageSkeleton } from "@/components/admin/admin-skeletons";
import { MessageList } from "@/components/admin/message-list";
import { EmptyState } from "@/components/shared/empty-state";
import { requireAdminUser } from "@/lib/auth-guards";
import {
  getContactMessages,
  getOpenMessageCount,
} from "@/lib/queries/messages";

export const metadata: Metadata = { title: "Messages" };

export default function MessagesPage() {
  return (
    <Suspense fallback={<AdminPageSkeleton />}>
      <MessagesContent />
    </Suspense>
  );
}

async function MessagesContent() {
  await requireAdminUser("/admin/messages");

  const [messages, open] = await Promise.all([
    getContactMessages(),
    getOpenMessageCount(),
  ]);

  return (
    <AdminShell
      title="Messages"
      description="Questions, corrections and tips sent through the contact form."
      actions={
        <p className="text-sm text-muted-foreground">
          {open} open · {messages.length} shown
        </p>
      }
    >
      {messages.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="No messages yet"
          description="Messages sent through the contact page will appear here."
        />
      ) : (
        <MessageList messages={messages} />
      )}
    </AdminShell>
  );
}