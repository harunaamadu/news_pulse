import ReactMarkdown from "react-markdown";

import { cn } from "@/lib/utils";

const dropCap =
  "[&>p:first-of-type]:first-letter:float-left [&>p:first-of-type]:first-letter:mr-3 [&>p:first-of-type]:first-letter:font-serif [&>p:first-of-type]:first-letter:text-6xl [&>p:first-of-type]:first-letter:font-bold [&>p:first-of-type]:first-letter:leading-[0.85] [&>p:first-of-type]:first-letter:text-brand";

export function ArticleContent({ content }: { content: string }) {
  return (
    <div
      className={cn(
        "prose prose-lg dark:prose-invert max-w-none",
        "prose-headings:font-serif prose-headings:tracking-tight",
        "prose-p:leading-relaxed",
        "prose-a:text-brand prose-a:no-underline hover:prose-a:underline",
        "prose-blockquote:border-l-brand prose-img:rounded-xl",
        dropCap,
      )}
    >
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}