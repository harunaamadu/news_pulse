import type { Role } from "@/generated/prisma/enums";

export const RANGES = [7, 30, 90] as const;
export type RangeDays = (typeof RANGES)[number];

export function parseRange(value: string | string[] | undefined): RangeDays {
  const parsed = Number(Array.isArray(value) ? value[0] : value);
  return (RANGES as readonly number[]).includes(parsed)
    ? (parsed as RangeDays)
    : 30;
}

export const ROLES: Role[] = ["USER", "EDITOR", "ADMIN"];

export const ROLE_LABELS: Record<Role, string> = {
  USER: "Reader",
  EDITOR: "Editor",
  ADMIN: "Admin",
};

export const PROVIDER_LABELS: Record<string, string> = {
  github: "GitHub",
  google: "Google",
};

export type Delta =
  | { kind: "new" }
  | { kind: "flat" }
  | { kind: "change"; percent: number };

export function computeDelta(current: number, previous: number): Delta {
  if (previous === 0) return current > 0 ? { kind: "new" } : { kind: "flat" };

  const percent = Math.round(((current - previous) / previous) * 100);
  return percent === 0 ? { kind: "flat" } : { kind: "change", percent };
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// Works on "YYYY-MM-DD" strings so there is no timezone or locale drift
export function formatShortDate(iso: string): string {
  const [, month, day] = iso.split("-").map(Number);
  return `${MONTHS[month - 1] ?? ""} ${day}`;
}

const numberFormatter = new Intl.NumberFormat("en-US");
export const formatNumber = (value: number) => numberFormatter.format(value);

export type ActivityPoint = {
  date: string;
  signups: number;
  stories: number;
  comments: number;
  bookmarks: number;
};

export type AdminKpis = {
  totalUsers: number;
  newUsers: number;
  prevUsers: number;
  totalStories: number;
  newStories: number;
  prevStories: number;
  newComments: number;
  prevComments: number;
  newBookmarks: number;
  prevBookmarks: number;
};

export type CategoryStat = { name: string; stories: number; followers: number };
export type RoleCount = { role: Role; count: number };

export type TopStory = {
  id: string;
  slug: string;
  title: string;
  category: string;
  comments: number;
  bookmarks: number;
};

export type AdminUserRow = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: Role;
  createdAt: Date;
  hasPassword: boolean;
  providers: string[];
  _count: { articles: number; comments: number; bookmarks: number };
};