/**
 * Geometría compartida de la marca Escenarios Colombia.
 * Misma pieza visual en header, favicon SVG y OG (barras aproximadas).
 */

export const BRAND = {
  bg: "#141b24",
  border: "rgba(61,156,253,0.45)",
  accent: "#3d9cfd",
  fg: "#e8eef4",
  pageBg: "#0c1117",
} as const;

/** SVG de marca 32×32 — barras crecientes (lucide chart-column-increasing) */
export function brandMarkSvg(size = 32): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 32 32" fill="none">
  <rect width="32" height="32" rx="8" fill="${BRAND.bg}"/>
  <rect x="1" y="1" width="30" height="30" rx="7" stroke="${BRAND.accent}" stroke-opacity="0.45" stroke-width="1"/>
  <g transform="translate(4 4)" stroke="${BRAND.accent}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none">
    <path d="M13 17V9m5 8V5M3 3v16a2 2 0 0 0 2 2h16M8 17v-3"/>
  </g>
</svg>`;
}
