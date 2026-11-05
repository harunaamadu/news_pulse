import {
  Eye,
  FilePenLine,
  Scale,
  SearchCheck,
  ShieldCheck,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";

import type { StandardSlug } from "@/content/standards";

const icons: Record<StandardSlug, LucideIcon> = {
  "editorial-independence": ShieldCheck,
  "fact-checking": SearchCheck,
  transparency: Eye,
  "code-of-ethics": Scale,
  corrections: FilePenLine,
};

export function StandardIcon({
  slug,
  ...props
}: { slug: StandardSlug } & LucideProps) {
  const Icon = icons[slug];
  return <Icon aria-hidden="true" {...props} />;
}