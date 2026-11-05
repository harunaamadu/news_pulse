import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

// Built once and reused. Raw HTML in the Markdown source is dropped by
// remark-rehype (no allowDangerousHtml), and rehype-sanitize strips unsafe
// URLs (e.g. javascript:) and attributes from whatever is left.
const processor = unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeSanitize)
  .use(rehypeStringify);

export async function markdownToHtml(markdown: string): Promise<string> {
  const file = await processor.process(markdown);
  return String(file);
}