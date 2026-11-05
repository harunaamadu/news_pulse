import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { getNotifications, getUnreadCount } from "@/lib/queries/notifications";
import type { NotificationItem } from "@/types";

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json(
      { unreadCount: 0, items: [] },
      { status: 401, headers: { "Cache-Control": "private, no-store" } },
    );
  }

  try {
    const [notifications, unreadCount] = await Promise.all([
      getNotifications(userId, 10),
      getUnreadCount(userId),
    ]);

    const items: NotificationItem[] = notifications.map((notification) => ({
      id: notification.id,
      type: notification.type,
      title: notification.title,
      body: notification.body,
      href: notification.href,
      createdAt: notification.createdAt.toISOString(),
      read: notification.readAt !== null,
    }));

    return NextResponse.json(
      { unreadCount, items },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch {
    return NextResponse.json({ error: "Failed to load" }, { status: 500 });
  }
}