"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { BookOpen } from "lucide-react";
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
        className="mb-2 px-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground"
      >
        Capítulos
      </p>
      <ScrollArea className="max-h-[40vh] lg:max-h-[calc(100vh-8rem)]">
        <nav aria-labelledby="playbook-nav-label">
          <Stagger className="flex flex-col gap-0.5 pr-2" gap={0.04}>
            {items.map((item) => {
              const href = `/playbook/${item.slug}`;
              const active =
                pathname === href || pathname.startsWith(`${href}/`);
              return (
                <StaggerItem key={item.slug}>
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative flex items-start gap-2 rounded-md px-2.5 py-2 text-sm no-underline transition-colors",
                      focusRingNav,
                      active
                        ? "text-foreground"
                        : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId={reduce ? undefined : "playbook-active"}
                        className="absolute inset-0 rounded-md bg-accent"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 32,
                        }}
                        aria-hidden
                      />
                    )}
                    <BookOpen
                      className={cn(
                        "relative z-10 mt-0.5 size-3.5 shrink-0",
                        active ? "text-primary" : "text-muted-foreground",
                      )}
                      aria-hidden
                    />
                    <span className="relative z-10 min-w-0">
                      <span className="block leading-snug">{item.label}</span>
                      <span className="mt-0.5 block font-mono text-[10px] opacity-60">
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
