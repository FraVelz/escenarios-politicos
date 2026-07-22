/**
 * Capas de atmósfera tipo jeraidi.dev: puntos, hatches zonales, viñeta.
 * No es una grilla uniforme — regiones con texturas distintas.
 */

/** Puntos densos (hero / canvas superior) */
export const ATMOS_DOTS =
  "bg-[radial-gradient(rgb(41_45_48/0.55)_0.7px,transparent_0.7px)] bg-[length:14px_14px]";

/** Hatch diagonal 45° — graphite fino */
export const ATMOS_HATCH =
  "bg-[repeating-linear-gradient(45deg,transparent_0_5px,rgb(41_45_48/0.22)_5px_6px)]";

/** Hatch más denso / contraste sutil */
export const ATMOS_HATCH_DENSE =
  "bg-[repeating-linear-gradient(-45deg,transparent_0_4px,rgb(41_45_48/0.18)_4px_5px)]";

export const SCORE_MONO =
  "font-mono text-2xl font-normal tracking-tight tabular-nums text-iris";

export const CROSS_GRID =
  "grid rounded-none border-l border-t border-border bg-black";

export const CROSS_CELL =
  "relative border-b border-r border-border p-5 transition-colors duration-150 hover:bg-white/[0.03] after:pointer-events-none after:absolute after:right-[-1.5px] after:bottom-[-1.5px] after:z-[1] after:size-[3px] after:bg-[#464a4d] after:content-['']";

export const CROSS_ROW =
  "col-span-full grid grid-cols-[minmax(0,1fr)_auto_auto] items-baseline gap-x-6 gap-y-4 border-b border-r border-border py-4 pl-5 pr-5 transition-colors duration-150 hover:bg-white/[0.03] after:pointer-events-none after:absolute after:right-[-1.5px] after:bottom-[-1.5px] after:z-[1] after:size-[3px] after:bg-[#464a4d] after:content-[''] relative";
