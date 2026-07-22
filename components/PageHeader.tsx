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
      initial={
        reduce ? false : { opacity: 0, y: 16, filter: "blur(6px)" }
      }
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: reduce ? 0 : 0.5, ease: easeOut }}
    >
      <h1 className="text-2xl font-medium tracking-tight text-white sm:text-3xl">
        {title}
      </h1>
      {description && (
        <motion.div
          className="max-w-2xl text-sm text-muted-foreground sm:text-[0.95rem]"
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reduce ? 0 : 0.45,
            delay: reduce ? 0 : 0.08,
            ease: easeOut,
          }}
        >
          {description}
        </motion.div>
      )}
      {children && (
        <motion.div
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: reduce ? 0 : 0.4,
            delay: reduce ? 0 : 0.12,
            ease: easeOut,
          }}
        >
          {children}
        </motion.div>
      )}
    </motion.div>
  );
}
