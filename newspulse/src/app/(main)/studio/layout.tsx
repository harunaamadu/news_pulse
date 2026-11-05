import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: { default: "Studio", template: "%s | Studio" },
  robots: { index: false, follow: false },
};

// Access control is enforced in each page and action, not here:
// layouts render in parallel with pages and must not be a security boundary
export default function StudioLayout({ children }: { children: ReactNode }) {
  return children;
}