"use client";

import {
  ArrowRight,
  Bookmark,
  Hash,
  Loader2,
  MessageSquare,
  Search,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { siteConfig } from "@/config/site";
import type { SearchResult } from "@/types";

type Status = "idle" | "loading" | "done" | "error" | "limited";

const pageLinks = [
  { label: "Choose topics", href: "/topics", icon: Sparkles },
  { label: "Discussions", href: "/discussions", icon: MessageSquare },
  { label: "Bookmarks", href: "/bookmarks", icon: Bookmark },
];

const subscribe = () => () => {};
const getIsMac = () => /Mac|iPhone|iPad/.test(navigator.userAgent);

export function SearchCommand() {
  const router = useRouter();
  // Server snapshot is false, so there's no hydration mismatch
  const isMac = useSyncExternalStore(subscribe, getIsMac, () => false);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [status, setStatus] = useState<Status>("idle");

  const trimmed = query.trim();
  const canSearch = trimmed.length >= 2;

  const handleOpenChange = useCallback((next: boolean) => {
    setOpen(next);
    if (!next) {
      setQuery("");
      setResults([]);
      setStatus("idle");
    }
  }, []);

  // Cmd/Ctrl + K
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((current) => !current);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  // Debounced, cancellable search
  useEffect(() => {
    if (!canSearch) return;

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setStatus("loading");
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(trimmed)}`,
          { signal: controller.signal },
        );

        if (response.status === 429) {
          setStatus("limited");
          return;
        }
        if (!response.ok) throw new Error("Search failed");

        const data = (await response.json()) as { results: SearchResult[] };
        setResults(data.results);
        setStatus("done");
      } catch {
        if (controller.signal.aborted) return;
        setStatus("error");
      }
    }, 250);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [canSearch, trimmed]);

  function go(href: string) {
    handleOpenChange(false);
    router.push(href);
  }

  const shortcut = isMac ? "⌘K" : "Ctrl K";

  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={() => setOpen(true)}
        className="hidden h-9 w-52 justify-start gap-2 px-3 font-normal text-muted-foreground lg:inline-flex"
      >
        <Search className="size-4" aria-hidden="true" />
        Search stories…
        <kbd className="ml-auto rounded border bg-muted px-1.5 font-sans text-[10px] font-medium">
          {shortcut}
        </kbd>
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        aria-label="Search"
        className="lg:hidden"
      >
        <Search className="size-4" />
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="top-[20%] translate-y-0 gap-0 overflow-hidden p-0 sm:max-w-xl">
          <DialogTitle className="sr-only">Search</DialogTitle>
          <DialogDescription className="sr-only">
            Search stories or jump to a section.
          </DialogDescription>

          <Command shouldFilter={false}>
            <CommandInput
              value={query}
              onValueChange={setQuery}
              placeholder="Search stories, topics…"
            />
            <CommandList className="max-h-96">
              {canSearch ? (
                <>
                  <CommandGroup heading="Stories">
                    {status === "loading" && (
                      <p className="flex items-center gap-2 px-2 py-3 text-sm text-muted-foreground">
                        <Loader2
                          className="size-4 animate-spin"
                          aria-hidden="true"
                        />
                        Searching…
                      </p>
                    )}
                    {status === "error" && (
                      <p
                        role="alert"
                        className="px-2 py-3 text-sm text-destructive"
                      >
                        Search is unavailable right now. Please try again.
                      </p>
                    )}
                    {status === "limited" && (
                      <p
                        role="alert"
                        className="px-2 py-3 text-sm text-muted-foreground"
                      >
                        You&apos;re searching too fast. Give it a moment.
                      </p>
                    )}
                    {status === "done" && results.length === 0 && (
                      <p className="px-2 py-3 text-sm text-muted-foreground">
                        No stories match &ldquo;{trimmed}&rdquo;.
                      </p>
                    )}
                    {status === "done" &&
                      results.map((result) => (
                        <CommandItem
                          key={result.id}
                          value={result.id}
                          onSelect={() => go(`/article/${result.slug}`)}
                          className="items-start gap-3 py-2.5"
                        >
                          <Search
                            className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                            aria-hidden="true"
                          />
                          <span className="min-w-0 space-y-0.5">
                            <span className="line-clamp-2 block font-serif font-semibold leading-snug">
                              {result.title}
                            </span>
                            <span className="block text-xs text-muted-foreground">
                              {result.category}
                            </span>
                          </span>
                        </CommandItem>
                      ))}
                  </CommandGroup>
                  <CommandSeparator />
                  <CommandGroup>
                    <CommandItem
                      value="__all__"
                      onSelect={() =>
                        go(`/search?q=${encodeURIComponent(trimmed)}`)
                      }
                    >
                      <ArrowRight className="size-4" aria-hidden="true" />
                      See all results for &ldquo;{trimmed}&rdquo;
                    </CommandItem>
                  </CommandGroup>
                </>
              ) : (
                <>
                  <CommandGroup heading="Sections">
                    {siteConfig.categories.map((category) => (
                      <CommandItem
                        key={category.slug}
                        value={`section-${category.slug}`}
                        onSelect={() => go(`/category/${category.slug}`)}
                      >
                        <Hash className="size-4" aria-hidden="true" />
                        {category.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  <CommandSeparator />
                  <CommandGroup heading="Pages">
                    {pageLinks.map(({ label, href, icon: Icon }) => (
                      <CommandItem
                        key={href}
                        value={`page-${href}`}
                        onSelect={() => go(href)}
                      >
                        <Icon className="size-4" aria-hidden="true" />
                        {label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
}
