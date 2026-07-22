import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-none border px-1.5 py-0.5 font-mono text-[11px] font-normal tracking-wide transition-colors",
  {
    variants: {
      variant: {
        default: "border-border bg-transparent text-muted-foreground",
        primary: "border-border bg-transparent text-primary",
        warn: "border-border bg-transparent text-warn",
        danger: "border-border bg-transparent text-destructive",
        ok: "border-border bg-transparent text-ok",
        identidad: "border-border bg-transparent text-identidad",
        outline: "border-border text-bone",
        iris: "border-border bg-transparent text-iris",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
