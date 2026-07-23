import Link from "next/link";
import { FadeIn } from "@/components/motion";
import { focusRingInline } from "@/lib/focus";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Página no encontrada",
};

export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-start justify-center py-12">
      <FadeIn className="max-w-lg space-y-6">
        <p className="font-mono text-5xl font-normal tracking-tight text-iris sm:text-6xl">
          404
        </p>
        <div className="space-y-2">
          <h1 className="text-2xl font-medium tracking-tight text-white sm:text-3xl">
            Página no encontrada
          </h1>
          <p className="text-sm text-muted-foreground sm:text-[0.95rem]">
            La ruta no existe o el caso ya no está disponible. Revisa la URL o
            vuelve al inicio.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <Link
            href="/"
            className={cn(
              "text-bone no-underline hover:text-white",
              focusRingInline,
            )}
          >
            ← Inicio
          </Link>
          <Link
            href="/co/casos"
            className={cn(
              "text-bone no-underline hover:text-white",
              focusRingInline,
            )}
          >
            Ver casos →
          </Link>
        </div>
      </FadeIn>
    </main>
  );
}
