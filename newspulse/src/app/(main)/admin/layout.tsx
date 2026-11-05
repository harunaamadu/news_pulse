import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Admin" },
  robots: { index: false, follow: false },
};

// Access control lives in each page and action, not here
export default function AdminLayout({ children }: { children: ReactNode }) {
  return children;
}