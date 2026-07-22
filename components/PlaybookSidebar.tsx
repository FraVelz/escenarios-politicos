"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { Stagger, StaggerItem } from "@/components/motion";
import { focusRingNav } from "@/lib/focus";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

export type PlaybookNavItem = {
  slug: string;
  file: string;
  label: string;
};

export function PlaybookSidebar({ items }: { items: PlaybookNavItem[] }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();

  return (
    <aside className="w-full shrink-0 lg:sticky lg:top-14 lg:w-56 xl:w-64">
      <p
        id="playbook-nav-label"
        className="mb-2 px-1 text-sm text-muted-foreground"
      >
        Capítulos
      </p>
      <ScrollArea className="max-h-[40vh] lg:max-h-[calc(100vh-8rem)]">
        <nav aria-labelledby="playbook-nav-label">
          <Stagger className="flex flex-col border-t border-border pr-2" gap={0.04}>
            {items.map((item, i) => {
              const href = `/playbook/${item.slug}`;
              const active =
                pathname === href || pathname.startsWith(`${href}/`);
              return (
                <StaggerItem key={item.slug}>
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative flex items-start gap-3 border-b border-border px-1 py-2.5 text-sm no-underline transition-colors duration-150",
                      focusRingNav,
                      active
                        ? "text-white"
                        : "text-muted-foreground hover:text-white",
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId={reduce ? undefined : "playbook-active"}
                        className="absolute left-0 top-1/2 h-3 w-px -translate-y-1/2 bg-primary"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 32,
                        }}
                        aria-hidden
                      />
                    )}
                    <span className="relative z-10 w-6 shrink-0 text-sm text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="relative z-10 min-w-0">
                      <span className="block text-base leading-snug">
                        {item.label}
                      </span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">
                        {item.file}
                      </span>
                    </span>
                  </Link>
                </StaggerItem>
              );
            })}
          </Stagger>
        </nav>
      </ScrollArea>
    </aside>
  );
}
