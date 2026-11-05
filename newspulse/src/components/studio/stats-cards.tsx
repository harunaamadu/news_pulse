import { Bookmark, MessageSquare, Newspaper, PenLine } from "lucide-react";

interface StatsCardsProps {
  stats: {
    published: number;
    drafts: number;
    comments: number;
    bookmarks: number;
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  const items = [
    { label: "Published", value: stats.published, icon: Newspaper },
    { label: "Drafts", value: stats.drafts, icon: PenLine },
    { label: "Comments", value: stats.comments, icon: MessageSquare },
    { label: "Bookmarks", value: stats.bookmarks, icon: Bookmark },
  ];

  return (
    <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {items.map(({ label, value, icon: Icon }) => (
        <div key={label} className="rounded-2xl border bg-card p-5">
          <div className="flex items-center justify-between">
            <dt className="text-sm text-muted-foreground">{label}</dt>
            <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
          </div>
          <dd className="mt-2 font-serif text-3xl font-bold tabular-nums">
            {value}
          </dd>
        </div>
      ))}
    </dl>
  );
}