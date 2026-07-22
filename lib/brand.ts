/**
 * Geometría compartida de la marca Escenarios Colombia.
 * Misma pieza visual en header, favicon SVG y OG (barras aproximadas).
 * Paleta: void black + iris violet, radio sharp.
 */

export const BRAND = {
  bg: "#000000",
  border: "#292d30",
  accent: "#9281f7",
  fg: "#f0f0f0",
  pageBg: "#000000",
} as const;

/** SVG de marca 32×32 — barras crecientes (lucide chart-column-increasing) */
export function brandMarkSvg(size = 32): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 32 32" fill="none">
  <rect width="32" height="32" rx="0" fill="${BRAND.bg}"/>
  <rect x="1" y="1" width="30" height="30" rx="0" stroke="${BRAND.border}" stroke-width="1"/>
  <g transform="translate(4 4)" stroke="${BRAND.accent}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none">
    <path d="M13 17V9m5 8V5M3 3v16a2 2 0 0 0 2 2h16M8 17v-3"/>
  </g>
</svg>`;
}
