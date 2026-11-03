"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const groupVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

interface BaseProps {
  children: ReactNode;
  className?: string;
}

export function Reveal({ children, className }: BaseProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

interface StaggerGroupProps extends BaseProps {
  as?: "div" | "ul";
}

export function StaggerGroup({
  children,
  className,
  as = "div",
}: StaggerGroupProps) {
  const Tag = motion[as];

  return (
    <Tag
      className={className}
      variants={groupVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
    >
      {children}
    </Tag>
  );
}

interface StaggerItemProps extends BaseProps {
  as?: "div" | "li";
}

export function StaggerItem({
  children,
  className,
  as = "div",
}: StaggerItemProps) {
  const Tag = motion[as];

  return (
    <Tag className={className} variants={itemVariants}>
      {children}
    </Tag>
  );
}