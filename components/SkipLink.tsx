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
    <a href={href} className={cn("skip-link", focusRing, className)}>
      Saltar al contenido
    </a>
  );
}
