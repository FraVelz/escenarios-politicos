import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-secondary text-muted-foreground",
        primary:
          "border-transparent bg-primary/15 text-primary",
        warn:
          "border-transparent bg-[#3a2e14] text-warn",
        danger:
          "border-transparent bg-[#3a1a1a] text-destructive",
        ok:
          "border-transparent bg-[#143028] text-ok",
        identidad:
          "border-transparent bg-[#1e3a5f] text-[#9ec9ff]",
        outline: "border-border text-foreground",
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
