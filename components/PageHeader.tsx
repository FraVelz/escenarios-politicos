"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { easeOut } from "@/components/motion";
import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={cn("mb-8 space-y-2", className)}
      initial={reduce ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0 : 0.4, ease: easeOut }}
    >
      <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        {title}
      </h1>
      {description && (
        <motion.p
          className="max-w-2xl text-sm text-muted-foreground sm:text-[0.95rem]"
          initial={reduce ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reduce ? 0 : 0.4,
            delay: reduce ? 0 : 0.06,
            ease: easeOut,
          }}
        >
          {description}
        </motion.p>
      )}
      {children && (
        <motion.div
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: reduce ? 0 : 0.35,
            delay: reduce ? 0 : 0.1,
            ease: easeOut,
          }}
        >
          {children}
        </motion.div>
      )}
    </motion.div>
  );
}
