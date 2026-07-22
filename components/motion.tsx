"use client";

import {
  motion,
  useReducedMotion,
  type HTMLMotionProps,
  type Variants,
} from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const easeOut = [0.22, 1, 0.36, 1] as const;

export function useMotionPresets() {
  const reduce = useReducedMotion();

  const fadeUp: Variants = {
    hidden: reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0 : 0.5, ease: easeOut },
    },
  };

  const fadeBlur: Variants = {
    hidden: reduce
      ? { opacity: 1, y: 0, filter: "blur(0px)" }
      : { opacity: 0, y: 16, filter: "blur(8px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: reduce ? 0 : 0.5, ease: easeOut },
    },
  };

  const item: Variants = {
    hidden: reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0 : 0.4, ease: easeOut },
    },
  };

  const itemBlur: Variants = {
    hidden: reduce
      ? { opacity: 1, y: 0, filter: "blur(0px)" }
      : { opacity: 0, y: 14, filter: "blur(6px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: reduce ? 0 : 0.45, ease: easeOut },
    },
  };

  return {
    reduce: !!reduce,
    fadeUp,
    fadeBlur,
    item,
    itemBlur,
    stagger: (gap = 0.06): Variants => ({
      hidden: {},
      show: {
        transition: { staggerChildren: reduce ? 0 : gap },
      },
    }),
    staggerFast: (): Variants => ({
      hidden: {},
      show: {
        transition: { staggerChildren: reduce ? 0 : 0.04 },
      },
    }),
  };
}

export function FadeIn({
  children,
  className,
  delay = 0,
  y = 16,
  blur = false,
  ...props
}: HTMLMotionProps<"div"> & { delay?: number; y?: number; blur?: boolean }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={
        reduce
          ? false
          : blur
            ? { opacity: 0, y, filter: "blur(8px)" }
            : { opacity: 0, y }
      }
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{
        duration: reduce ? 0 : 0.5,
        delay: reduce ? 0 : delay,
        ease: easeOut,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/** Reveal tipográfico: blur + slide (hero, títulos de sección) */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 20,
  as = "div",
  ...props
}: Omit<HTMLMotionProps<"div">, "children"> & {
  children?: ReactNode;
  delay?: number;
  y?: number;
  as?: "div" | "h1" | "h2" | "p" | "header" | "section";
}) {
  const reduce = useReducedMotion();
  const motionProps = {
    className,
    initial: reduce ? false : { opacity: 0, y, filter: "blur(8px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    transition: {
      duration: reduce ? 0 : 0.55,
      delay: reduce ? 0 : delay,
      ease: easeOut,
    },
    children,
    ...props,
  };

  switch (as) {
    case "h1":
      return <motion.h1 {...motionProps} />;
    case "h2":
      return <motion.h2 {...motionProps} />;
    case "p":
      return <motion.p {...motionProps} />;
    case "header":
      return <motion.header {...motionProps} />;
    case "section":
      return <motion.section {...motionProps} />;
    default:
      return <motion.div {...motionProps} />;
  }
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
  blur = false,
}: {
  children: ReactNode;
  className?: string;
  blur?: boolean;
}) {
  const { item, itemBlur } = useMotionPresets();
  return (
    <motion.div className={className} variants={blur ? itemBlur : item}>
      {children}
    </motion.div>
  );
}

/** Hover sutil para filas / links de ranking */
export function MotionRow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={cn(className)}
      whileHover={
        reduce
          ? undefined
          : { x: 3, transition: { duration: 0.15, ease: easeOut } }
      }
      whileTap={reduce ? undefined : { scale: 0.995 }}
    >
      {children}
    </motion.div>
  );
}

/** @deprecated Prefer MotionRow; hover lift mínimo */
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
