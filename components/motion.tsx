"use client";

import {
  m,
  useReducedMotion,
  type HTMLMotionProps,
  type Variants,
} from "motion/react";
import type { ReactNode } from "react";
import { easeOut } from "@/lib/ease";

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
    <m.div
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
    </m.div>
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
      return <m.h1 {...motionProps} />;
    case "h2":
      return <m.h2 {...motionProps} />;
    case "p":
      return <m.p {...motionProps} />;
    case "header":
      return <m.header {...motionProps} />;
    case "section":
      return <m.section {...motionProps} />;
    default:
      return <m.div {...motionProps} />;
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
    <m.div
      className={className}
      variants={stagger(gap)}
      initial="hidden"
      animate="show"
    >
      {children}
    </m.div>
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
    <m.div className={className} variants={blur ? itemBlur : item}>
      {children}
    </m.div>
  );
}
