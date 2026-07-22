import {
  ATMOS_DOTS,
  ATMOS_HATCH,
  ATMOS_HATCH_DENSE,
} from "@/lib/styles";
import { cn } from "@/lib/utils";

/**
 * Fondo atmosférico (referencia jeraidi.dev):
 * puntos + hatches en bloques asimétricos + viñeta — no grilla uniforme.
 */
export function PageAtmosphere() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-black"
    >
      {/* Capa base: puntos en todo el canvas, muy bajos */}
      <div className={cn("absolute inset-0 opacity-[0.45]", ATMOS_DOTS)} />

      {/* Bloque superior-izq: más puntos (zona “hero”) */}
      <div
        className={cn(
          "absolute -left-[5%] -top-[5%] h-[55vh] w-[70%] opacity-70",
          ATMOS_DOTS,
        )}
        style={{
          maskImage:
            "radial-gradient(ellipse 80% 70% at 30% 20%, black 20%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 70% at 30% 20%, black 20%, transparent 75%)",
        }}
      />

      {/* Panel hatch diagonal — banda media derecha */}
      <div
        className={cn(
          "absolute right-0 top-[18%] h-[42vh] w-[48%] border-l border-border/60 opacity-80",
          ATMOS_HATCH,
        )}
        style={{
          maskImage:
            "linear-gradient(to left, black 40%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to left, black 40%, transparent 100%)",
        }}
      />

      {/* Panel hatch cruzado — inferior izq */}
      <div
        className={cn(
          "absolute bottom-0 left-0 h-[38vh] w-[55%] border-t border-border/50 opacity-70",
          ATMOS_HATCH_DENSE,
        )}
        style={{
          maskImage:
            "linear-gradient(to top right, black 30%, transparent 85%)",
          WebkitMaskImage:
            "linear-gradient(to top right, black 30%, transparent 85%)",
        }}
      />

      {/* Líneas estructurales gruesas (marco asimétrico, no celda 24px) */}
      <div className="absolute left-[12%] top-0 h-full w-px bg-border/40" />
      <div className="absolute right-[22%] top-0 h-full w-px bg-border/30" />
      <div className="absolute left-0 top-[32%] h-px w-full bg-border/35" />
      <div className="absolute left-0 top-[68%] h-px w-full bg-border/25" />

      {/* Viñeta: el contenido respira al centro */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,transparent_0%,rgb(0_0_0/0.55)_72%,rgb(0_0_0/0.85)_100%)]" />
    </div>
  );
}
