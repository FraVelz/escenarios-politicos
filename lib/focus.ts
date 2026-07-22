/** Estilos de foco por teclado (solo :focus-visible). */

/** Controles estándar: botones, links en texto, triggers */
export const focusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

/** Nav compacta / pills / tabs — ring inset para no desplazar layout */
export const focusRingNav =
  "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset";

/** Card clickable (Link envolviendo Card) */
export const focusRingCard =
  "rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

/** Link inline en tablas / párrafos */
export const focusRingInline =
  "rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background";
