import { cache } from "react";

import { prisma } from "@/lib/prisma";

export const getCategoryBySlug = cache(async (slug: string) => {
  return prisma.category.findUnique({ where: { slug } });
});