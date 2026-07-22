"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { easeOut } from "@/components/motion";

/** Transición de ruta con exit/enter (blur + slide) */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={
          reduce
            ? false
            : { opacity: 0, y: 14, filter: "blur(6px)" }
        }
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={
          reduce
            ? undefined
            : { opacity: 0, y: -8, filter: "blur(4px)" }
        }
        transition={{
          duration: reduce ? 0 : 0.35,
          ease: easeOut,
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
