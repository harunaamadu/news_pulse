"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { ReactNode } from "react";

interface AuthCardProps {
  title: string;
  description: string;
  footerText: string;
  footerLinkLabel: string;
  footerHref: string;
  children: ReactNode;
}

export function AuthCard({
  title,
  description,
  footerText,
  footerLinkLabel,
  footerHref,
  children,
}: AuthCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full max-w-sm space-y-6"
    >
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      {children}

      <p className="text-center text-sm text-muted-foreground">
        {footerText}{" "}
        <Link
          href={footerHref}
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          {footerLinkLabel}
        </Link>
      </p>
    </motion.div>
  );
}