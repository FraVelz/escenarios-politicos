"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const easeOut = [0.22, 1, 0.36, 1] as const;

export function useMotionPresets() {
  const reduce = useReducedMotion();

  return {
    reduce: !!reduce,
    fadeUp: {
      hidden: reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 },
      show: {
        opacity: 1,
        y: 0,
        transition: { duration: reduce ? 0 : 0.4, ease: easeOut },
      },
    },
    fade: {
      hidden: reduce ? { opacity: 1 } : { opacity: 0 },
      show: {
        opacity: 1,
        transition: { duration: reduce ? 0 : 0.35, ease: easeOut },
      },
    },
    stagger: (gap = 0.06) => ({
      hidden: {},
      show: {
        transition: { staggerChildren: reduce ? 0 : gap },
      },
    }),
    item: {
      hidden: reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 },
      show: {
        opacity: 1,
        y: 0,
        transition: { duration: reduce ? 0 : 0.35, ease: easeOut },
      },
    },
  };
}

export function FadeIn({
  children,
  className,
  delay = 0,
  y = 12,
  ...props
}: HTMLMotionProps<"div"> & { delay?: number; y?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0 : 0.4, delay: reduce ? 0 : delay, ease: easeOut }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function Stagger({
  children,
  className,
  gap = 0.06,
}: {
  children: ReactNode;
  className?: string;
  gap?: number;
}) {
  const { stagger } = useMotionPresets();
  return (
    <motion.div
      className={className}
      variants={stagger(gap)}
      initial="hidden"
      animate="show"
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { item } = useMotionPresets();
  return (
    <motion.div className={className} variants={item}>
      {children}
    </motion.div>
  );
}

/** Hover lift sutil para cards interactivos */
export function MotionCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={cn("h-full", className)}
      whileHover={
        reduce
          ? undefined
          : { y: -2, transition: { duration: 0.2, ease: easeOut } }
      }
      whileTap={reduce ? undefined : { scale: 0.985 }}
    >
      {children}
    </motion.div>
  );
}
