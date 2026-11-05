import { cache } from "react";

import type { Prisma, Role } from "@/generated/prisma/client";
import {
  ROLES,
  type ActivityPoint,
  type AdminKpis,
  type AdminUserRow,
  type CategoryStat,
  type RangeDays,
  type RoleCount,
  type TopStory,
} from "@/lib/admin";
import { prisma } from "@/lib/prisma";

// cache() dedupes identical calls within one request, so the KPI cards and
// charts can share the same series without a second database round trip
export const getActivitySeries = cache(
  async (days: RangeDays): Promise<ActivityPoint[]> => {
    return prisma.$queryRaw<ActivityPoint[]>`
      WITH days AS (
        SELECT generate_series(
          date_trunc('day', now() AT TIME ZONE 'UTC') - (${days - 1}::int * interval '1 day'),
          date_trunc('day', now() AT TIME ZONE 'UTC'),
          interval '1 day'
        ) AS day
      )
      SELECT
        to_char(days.day, 'YYYY-MM-DD') AS "date",
        (SELECT COUNT(*) FROM users u
           WHERE u."createdAt" >= days.day
             AND u."createdAt" < days.day + interval '1 day')::int AS "signups",
        (SELECT COUNT(*) FROM articles a
           WHERE a.status = 'PUBLISHED'
             AND a."publishedAt" >= days.day
             AND a."publishedAt" < days.day + interval '1 day')::int AS "stories",
        (SELECT COUNT(*) FROM comments c
           WHERE c."createdAt" >= days.day
             AND c."createdAt" < days.day + interval '1 day')::int AS "comments",
        (SELECT COUNT(*) FROM bookmarks b
           WHERE b."createdAt" >= days.day
             AND b."createdAt" < days.day + interval '1 day')::int AS "bookmarks"
      FROM days
      ORDER BY days.day
    `;
  },
);

// "Current" = the same window the chart shows; "prev" = the window before it
export const getAdminKpis = cache(async (days: RangeDays): Promise<AdminKpis> => {
  const rows = await prisma.$queryRaw<AdminKpis[]>`
    WITH bounds AS (
      SELECT
        date_trunc('day', now() AT TIME ZONE 'UTC') - (${days - 1}::int * interval '1 day') AS since,
        date_trunc('day', now() AT TIME ZONE 'UTC') - (${days * 2 - 1}::int * interval '1 day') AS prev_since
    )
    SELECT
      (SELECT COUNT(*) FROM users)::int AS "totalUsers",
      (SELECT COUNT(*) FROM users u, bounds b
         WHERE u."createdAt" >= b.since)::int AS "newUsers",
      (SELECT COUNT(*) FROM users u, bounds b
         WHERE u."createdAt" >= b.prev_since AND u."createdAt" < b.since)::int AS "prevUsers",

      (SELECT COUNT(*) FROM articles WHERE status = 'PUBLISHED')::int AS "totalStories",
      (SELECT COUNT(*) FROM articles a, bounds b
         WHERE a.status = 'PUBLISHED' AND a."publishedAt" >= b.since)::int AS "newStories",
      (SELECT COUNT(*) FROM articles a, bounds b
         WHERE a.status = 'PUBLISHED'
           AND a."publishedAt" >= b.prev_since AND a."publishedAt" < b.since)::int AS "prevStories",

      (SELECT COUNT(*) FROM comments c, bounds b
         WHERE c."createdAt" >= b.since)::int AS "newComments",
      (SELECT COUNT(*) FROM comments c, bounds b
         WHERE c."createdAt" >= b.prev_since AND c."createdAt" < b.since)::int AS "prevComments",

      (SELECT COUNT(*) FROM bookmarks k, bounds b
         WHERE k."createdAt" >= b.since)::int AS "newBookmarks",
      (SELECT COUNT(*) FROM bookmarks k, bounds b
         WHERE k."createdAt" >= b.prev_since AND k."createdAt" < b.since)::int AS "prevBookmarks"
  `;

  return rows[0];
});

export const getCategoryStats = cache(async (): Promise<CategoryStat[]> => {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: {
      name: true,
      _count: {
        select: {
          articles: { where: { status: "PUBLISHED" } },
          followers: true,
        },
      },
    },
  });

  return categories.map((category) => ({
    name: category.name,
    stories: category._count.articles,
    followers: category._count.followers,
  }));
});

export const getRoleBreakdown = cache(async (): Promise<RoleCount[]> => {
  const rows = await prisma.user.groupBy({
    by: ["role"],
    _count: { _all: true },
  });

  return ROLES.map((role) => ({
    role,
    count: rows.find((row) => row.role === role)?._count._all ?? 0,
  }));
});

export const getTopStories = cache(async (): Promise<TopStory[]> => {
  return prisma.$queryRaw<TopStory[]>`
    SELECT * FROM (
      SELECT
        a.id, a.slug, a.title, c.name AS category,
        (SELECT COUNT(*) FROM comments cm WHERE cm."articleId" = a.id)::int AS comments,
        (SELECT COUNT(*) FROM bookmarks bk WHERE bk."articleId" = a.id)::int AS bookmarks
      FROM articles a
      JOIN categories c ON c.id = a."categoryId"
      WHERE a.status = 'PUBLISHED'
    ) t
    ORDER BY (t.comments + t.bookmarks) DESC, t.title ASC
    LIMIT 5
  `;
});

export const getRecentSignups = cache(async () => {
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 6,
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      createdAt: true,
    },
  });
});

export const USERS_PAGE_SIZE = 10;

interface UsersQuery {
  q?: string;
  role?: Role;
  page: number;
}

export async function getAdminUsers({ q, role, page }: UsersQuery) {
  const where: Prisma.UserWhereInput = {
    ...(role ? { role } : {}),
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const total = await prisma.user.count({ where });
  const pageCount = Math.max(1, Math.ceil(total / USERS_PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);

  const rows = await prisma.user.findMany({
    where,
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    skip: (currentPage - 1) * USERS_PAGE_SIZE,
    take: USERS_PAGE_SIZE,
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      createdAt: true,
      passwordHash: true,
      accounts: { select: { provider: true } },
      _count: { select: { articles: true, comments: true, bookmarks: true } },
    },
  });

  // The hash is reduced to a boolean here and never leaves this function
  const users: AdminUserRow[] = rows.map(
    ({ passwordHash, accounts, ...user }) => ({
      ...user,
      hasPassword: passwordHash !== null,
      providers: accounts.map((account) => account.provider),
    }),
  );

  return { users, total, pageCount, page: currentPage };
}