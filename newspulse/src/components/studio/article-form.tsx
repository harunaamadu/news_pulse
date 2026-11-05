"use client";

import { Eye, PenLine } from "lucide-react";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";

import {
  createArticleAction,
  updateArticleAction,
} from "@/actions/studio-actions";
import { ArticleContent } from "@/components/articles/article-content";
import { SubmitButton } from "@/components/auth/submit-button";
import { DeleteArticleButton } from "@/components/studio/delete-article-button";
import { StatusBadge } from "@/components/studio/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { imageHosts } from "@/config/site";
import { cn } from "@/lib/utils";
import type { ActionState } from "@/types";

const initialState: ActionState = {};

const selectClass =
  "h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive dark:bg-input/30";

interface ArticleFormProps {
  categories: { id: string; name: string }[];
  article?: {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    coverImage: string;
    categoryId: string;
    featured: boolean;
    status: "DRAFT" | "PUBLISHED";
  };
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="text-sm text-destructive">
      {message}
    </p>
  );
}

export function ArticleForm({ categories, article }: ArticleFormProps) {
  const action = article
    ? updateArticleAction.bind(null, article.id)
    : createArticleAction;
  const [state, formAction] = useActionState(action, initialState);

  const value = (key: string, fallback = "") => state.values?.[key] ?? fallback;
  const error = (key: string) => state.fieldErrors?.[key]?.[0];

  const [mode, setMode] = useState<"write" | "preview">("write");
  const [previewText, setPreviewText] = useState(
    state.values?.content ?? article?.content ?? "",
  );

  useEffect(() => {
    if (state.success && state.message) toast.success(state.message);
  }, [state]);

  const isPublished = article?.status === "PUBLISHED";
  const words = previewText.trim() ? previewText.trim().split(/\s+/).length : 0;
  const readTime = Math.max(1, Math.ceil(words / 200));
  const featured =
    state.values !== undefined ? state.values.featured === "on" : (article?.featured ?? false);

  return (
    <form action={formAction} className="grid gap-8 lg:grid-cols-3" noValidate>
      {state.error && (
        <div
          role="alert"
          className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive lg:col-span-3"
        >
          {state.error}
        </div>
      )}

      {/* Main column */}
      <div className="space-y-6 lg:col-span-2">
        <div className="space-y-2">
          <Label htmlFor="title">Headline</Label>
          <Input
            id="title"
            name="title"
            maxLength={120}
            defaultValue={value("title", article?.title)}
            placeholder="A clear, specific headline"
            aria-invalid={Boolean(error("title"))}
            aria-describedby={error("title") ? "title-error" : undefined}
            className="h-11 font-serif text-lg"
          />
          <FieldError id="title-error" message={error("title")} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="excerpt">Summary</Label>
          <Textarea
            id="excerpt"
            name="excerpt"
            rows={3}
            maxLength={280}
            defaultValue={value("excerpt", article?.excerpt)}
            placeholder="One or two sentences that make readers want to continue"
            aria-invalid={Boolean(error("excerpt"))}
            aria-describedby={error("excerpt") ? "excerpt-error" : undefined}
          />
          <FieldError id="excerpt-error" message={error("excerpt")} />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="content">Story (Markdown)</Label>
            <div
              role="group"
              aria-label="Editor mode"
              className="inline-flex rounded-lg border p-0.5"
            >
              <Button
                type="button"
                size="sm"
                variant={mode === "write" ? "secondary" : "ghost"}
                aria-pressed={mode === "write"}
                onClick={() => setMode("write")}
                className="h-7 px-2.5"
              >
                <PenLine className="size-3.5" aria-hidden="true" />
                Write
              </Button>
              <Button
                type="button"
                size="sm"
                variant={mode === "preview" ? "secondary" : "ghost"}
                aria-pressed={mode === "preview"}
                onClick={() => setMode("preview")}
                className="h-7 px-2.5"
              >
                <Eye className="size-3.5" aria-hidden="true" />
                Preview
              </Button>
            </div>
          </div>

          {/* Hidden, never unmounted, so its value is always submitted */}
          <Textarea
            id="content"
            name="content"
            rows={22}
            hidden={mode === "preview"}
            defaultValue={value("content", article?.content)}
            onChange={(event) => setPreviewText(event.target.value)}
            placeholder={"Write in Markdown.\n\n## Subheading\n\nParagraphs, **bold**, lists and links are supported."}
            aria-invalid={Boolean(error("content"))}
            aria-describedby={error("content") ? "content-error" : "content-hint"}
            className="min-h-96 font-mono text-sm leading-relaxed"
          />

          {mode === "preview" && (
            <div className="min-h-96 rounded-md border bg-card p-6">
              <ArticleContent
                content={previewText.trim() || "*Nothing to preview yet.*"}
              />
            </div>
          )}

          <FieldError id="content-error" message={error("content")} />
          <p id="content-hint" className="text-xs text-muted-foreground">
            {words} {words === 1 ? "word" : "words"} · about {readTime} min read
          </p>
        </div>
      </div>

      {/* Sidebar */}
      <aside className="space-y-6 lg:sticky lg:top-40 lg:self-start">
        <div className="space-y-4 rounded-2xl border bg-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Status</span>
            <StatusBadge status={article?.status ?? "DRAFT"} />
          </div>

          <div className="grid gap-2">
            {isPublished ? (
              <>
                <SubmitButton name="intent" value="publish">
                  Update story
                </SubmitButton>
                <SubmitButton name="intent" value="draft" variant="outline">
                  Unpublish
                </SubmitButton>
              </>
            ) : (
              <>
                <SubmitButton name="intent" value="publish">
                  Publish
                </SubmitButton>
                <SubmitButton name="intent" value="draft" variant="outline">
                  Save draft
                </SubmitButton>
              </>
            )}
          </div>

          {article && isPublished && (
            <Button variant="link" size="sm" className="h-auto p-0" asChild>
              <Link href={`/article/${article.slug}`}>View live story →</Link>
            </Button>
          )}
        </div>

        <div className="space-y-5 rounded-2xl border bg-card p-5">
          <div className="space-y-2">
            <Label htmlFor="categoryId">Section</Label>
            <select
              id="categoryId"
              name="categoryId"
              defaultValue={value("categoryId", article?.categoryId)}
              aria-invalid={Boolean(error("categoryId"))}
              aria-describedby={error("categoryId") ? "category-error" : undefined}
              className={selectClass}
            >
              <option value="" disabled>
                Choose a section…
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <FieldError id="category-error" message={error("categoryId")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="coverImage">Cover image URL</Label>
            <Input
              id="coverImage"
              name="coverImage"
              type="url"
              defaultValue={value("coverImage", article?.coverImage)}
              placeholder="https://images.unsplash.com/…"
              aria-invalid={Boolean(error("coverImage"))}
              aria-describedby="cover-hint"
            />
            <FieldError id="cover-error" message={error("coverImage")} />
            <p id="cover-hint" className="text-xs text-muted-foreground">
              Optional: leave empty for an automatic cover. Allowed hosts:{" "}
              {imageHosts.join(", ")}.
            </p>
          </div>

          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={featured}
              className="mt-0.5 size-4 rounded border-input accent-[var(--brand)]"
            />
            <span className="space-y-0.5">
              <span className="block text-sm font-medium">Feature on home page</span>
              <span className="block text-xs text-muted-foreground">
                The newest featured story becomes the hero.
              </span>
            </span>
          </label>
        </div>

        {article && (
          <DeleteArticleButton
            articleId={article.id}
            title={article.title}
            redirectTo="/studio"
            variant="outline"
            className={cn("w-full text-destructive hover:text-destructive")}
          />
        )}
      </aside>
    </form>
  );
}