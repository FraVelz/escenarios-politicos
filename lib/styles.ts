/** Constantes de className Tailwind compartidas (sin CSS custom). */

export const SCORE_MONO =
  "font-mono text-2xl font-normal tracking-tight tabular-nums text-iris";

/** Rejilla de fondo sutil — graphite hairline 24px sobre void */
export const PAGE_GRID_BG =
  "bg-black bg-[linear-gradient(to_right,rgb(41_45_48/0.35)_1px,transparent_1px),linear-gradient(to_bottom,rgb(41_45_48/0.35)_1px,transparent_1px)] bg-[length:24px_24px]";

export const CROSS_GRID =
  "grid rounded-none border-l border-t border-border bg-black";

export const CROSS_CELL =
  "relative border-b border-r border-border p-5 transition-colors duration-150 hover:bg-white/[0.03] after:pointer-events-none after:absolute after:right-[-1.5px] after:bottom-[-1.5px] after:z-[1] after:size-[3px] after:bg-[#464a4d] after:content-['']";

export const CROSS_ROW =
  "col-span-full grid grid-cols-[minmax(0,1fr)_auto_auto] items-baseline gap-x-6 gap-y-4 border-b border-r border-border py-4 pl-5 pr-5 transition-colors duration-150 hover:bg-white/[0.03] after:pointer-events-none after:absolute after:right-[-1.5px] after:bottom-[-1.5px] after:z-[1] after:size-[3px] after:bg-[#464a4d] after:content-[''] relative";
