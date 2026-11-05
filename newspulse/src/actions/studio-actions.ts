"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { canManageArticle, getStudioUser } from "@/lib/auth-guards";
import { notifyFollowersOfArticle } from "@/lib/notifications";
import { prisma } from "@/lib/prisma";
import { generateUniqueSlug } from "@/lib/slug";
import { articleSchema } from "@/lib/validations";
import type { ActionState } from "@/types";

const NO_ACCESS = "You don't have access to the studio.";

function readString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function readForm(formData: FormData) {
  return {
    title: readString(formData, "title"),
    excerpt: readString(formData, "excerpt"),
    categoryId: readString(formData, "categoryId"),
    coverImage: readString(formData, "coverImage"),
    content: readString(formData, "content"),
    featured: formData.get("featured") === "on",
  };
}

function toValues(raw: ReturnType<typeof readForm>): Record<string, string> {
  return { ...raw, featured: raw.featured ? "on" : "" };
}

function estimateReadTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

function revalidatePublicPages(slug: string) {
  revalidatePath("/");
  revalidatePath("/topics");
  revalidatePath("/discussions");
  revalidatePath(`/article/${slug}`);
  revalidatePath("/category/[slug]", "page");
  revalidatePath("/studio");
}

// A failed notification must never fail the publish itself
async function notifySafely(article: {
  id: string;
  slug: string;
  title: string;
  categoryId: string;
  authorId: string;
}) {
  try {
    await notifyFollowersOfArticle(article);
  } catch (error) {
    console.error("Failed to notify followers", error);
  }
}

export async function createArticleAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await getStudioUser();
  if (!user) return { error: NO_ACCESS };

  const raw = readForm(formData);
  const values = toValues(raw);
  const publish = readString(formData, "intent") === "publish";

  const parsed = articleSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors, values };
  }
  const data = parsed.data;

  const category = await prisma.category.findUnique({
    where: { id: data.categoryId },
    select: { id: true },
  });
  if (!category) {
    return { fieldErrors: { categoryId: ["Choose a valid category."] }, values };
  }

  const slug = await generateUniqueSlug(data.title);
  let articleId: string;

  try {
    const article = await prisma.article.create({
      data: {
        slug,
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        coverImage:
          data.coverImage || `https://picsum.photos/seed/${slug}/1200/800`,
        featured: data.featured,
        readTimeMinutes: estimateReadTime(data.content),
        status: publish ? "PUBLISHED" : "DRAFT",
        publishedAt: new Date(),
        authorId: user.id,
        categoryId: data.categoryId,
      },
      select: { id: true },
    });
    articleId = article.id;
  } catch {
    return {
      error: "Couldn't save your story. Please try again.",
      values,
    };
  }

  if (publish) {
    await notifySafely({
      id: articleId,
      slug,
      title: data.title,
      categoryId: data.categoryId,
      authorId: user.id,
    });
    revalidatePublicPages(slug);
  } else {
    revalidatePath("/studio");
  }

  // redirect() throws, so it must stay outside the try/catch
  redirect(
    `/studio/${articleId}/edit?notice=${publish ? "published" : "created"}`,
  );
}

export async function updateArticleAction(
  articleId: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await getStudioUser();
  if (!user) return { error: NO_ACCESS };

  const existing = await prisma.article.findUnique({
    where: { id: articleId },
    select: { id: true, slug: true, authorId: true, status: true, coverImage: true },
  });
  if (!existing) return { error: "This story no longer exists." };
  if (!canManageArticle(user, existing.authorId)) return { error: NO_ACCESS };

  const raw = readForm(formData);
  const values = toValues(raw);
  const publish = readString(formData, "intent") === "publish";

  const parsed = articleSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors, values };
  }
  const data = parsed.data;

  const category = await prisma.category.findUnique({
    where: { id: data.categoryId },
    select: { id: true },
  });
  if (!category) {
    return { fieldErrors: { categoryId: ["Choose a valid category."] }, values };
  }

  const firstPublish = publish && existing.status !== "PUBLISHED";

  try {
    await prisma.article.update({
      where: { id: articleId },
      data: {
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        coverImage:
          data.coverImage || `https://picsum.photos/seed/${existing.slug}/1200/800`,
        featured: data.featured,
        readTimeMinutes: estimateReadTime(data.content),
        categoryId: data.categoryId,
        status: publish ? "PUBLISHED" : "DRAFT",
        ...(firstPublish ? { publishedAt: new Date() } : {}),
      },
    });
  } catch {
    return { error: "Couldn't save your changes. Please try again.", values };
  }

  if (firstPublish) {
    await notifySafely({
      id: articleId,
      slug: existing.slug,
      title: data.title,
      categoryId: data.categoryId,
      authorId: existing.authorId,
    });
  }

  revalidatePublicPages(existing.slug);
  revalidatePath(`/studio/${articleId}/edit`);

  return {
    success: true,
    values,
    message: firstPublish
      ? "Story published"
      : publish
        ? "Changes saved"
        : existing.status === "PUBLISHED"
          ? "Story unpublished"
          : "Draft saved",
  };
}

export async function deleteArticleAction(
  articleId: string,
): Promise<{ ok: boolean }> {
  const user = await getStudioUser();
  if (!user) return { ok: false };

  const existing = await prisma.article.findUnique({
    where: { id: articleId },
    select: { slug: true, authorId: true },
  });
  if (!existing || !canManageArticle(user, existing.authorId)) {
    return { ok: false };
  }

  try {
    // Comments and bookmarks are removed by the schema's cascade rules
    await prisma.article.delete({ where: { id: articleId } });
  } catch {
    return { ok: false };
  }

  revalidatePublicPages(existing.slug);
  return { ok: true };
}