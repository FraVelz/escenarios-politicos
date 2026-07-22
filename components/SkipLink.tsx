import { cn } from "@/lib/utils";
import { focusRing } from "@/lib/focus";

/** Visible solo con :focus-visible (Tab), nunca en carga ni con mouse */
export function SkipLink({
  href = "#contenido-principal",
  className,
}: {
  href?: string;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={cn(
        "sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-[100] focus-visible:m-0 focus-visible:inline-flex focus-visible:border focus-visible:border-border focus-visible:bg-black focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-medium focus-visible:text-white focus-visible:outline-none",
        focusRing,
        className,
      )}
    >
      Saltar al contenido
    </a>
  );
}
