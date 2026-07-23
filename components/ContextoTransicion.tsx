"use client";

import Image from "next/image";
import { useState } from "react";
import type { MarcoActor, MarcoPolitico } from "@/lib/types";
import { Reveal } from "@/components/motion";
import { focusRingInline } from "@/lib/focus";
import { cn } from "@/lib/utils";

const ESTADO_LABEL: Record<MarcoPolitico["estado_acto"], string> = {
  gobierno_estable: "Gobierno estable",
  transicion_pre_posesion: "Transición — posesión pendiente",
  post_transicion_reciente: "Post-transición reciente",
  sin_sucesor_conocido: "Sin sucesor conocido",
};

function initials(nombre: string): string {
  return nombre
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

function ActorPortrait({ actor }: { actor: MarcoActor }) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const showImage =
    Boolean(actor.imagen_url) && failedUrl !== actor.imagen_url;

  return (
    <article className="flex flex-col gap-4 border border-border bg-black p-5 sm:p-6">
      <div className="relative aspect-[3/4] w-full max-w-[220px] overflow-hidden border border-border bg-zinc-950">
        {showImage && actor.imagen_url ? (
          <Image
            src={actor.imagen_url}
            alt={`Retrato de ${actor.nombre}`}
            fill
            className="object-cover object-top"
            sizes="220px"
            onError={() => setFailedUrl(actor.imagen_url ?? null)}
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-900 to-zinc-950"
            aria-label={
              actor.imagen_url
                ? `Imagen no disponible — ${actor.nombre}`
                : `Sin imagen (N/D) — ${actor.nombre}`
            }
          >
            <span className="text-4xl font-medium tracking-tight text-bone/80">
              {initials(actor.nombre === "N/D" ? "?" : actor.nombre)}
            </span>
          </div>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
          {actor.rol_label}
        </p>
        <h2 className="text-xl font-medium tracking-tight text-white sm:text-2xl">
          {actor.nombre}
        </h2>
        {actor.posesion_at && (
          <p className="text-sm text-bone">
            Posesión:{" "}
            <time dateTime={actor.posesion_at}>{actor.posesion_at}</time>
          </p>
        )}
        {actor.periodo_fin && !actor.posesion_at && (
          <p className="text-sm text-bone">
            Mandato hasta:{" "}
            <time dateTime={actor.periodo_fin}>{actor.periodo_fin}</time>
          </p>
        )}
        {actor.periodo_inicio && actor.periodo_fin && actor.posesion_at && (
          <p className="text-sm text-muted-foreground">
            Periodo: {actor.periodo_inicio} → {actor.periodo_fin}
          </p>
        )}
        {actor.vice_nombre && (
          <p className="text-sm text-muted-foreground">
            Vice: {actor.vice_nombre}
          </p>
        )}
        {!showImage && (
          <p className="text-xs text-muted-foreground">Imagen: N/D</p>
        )}
        {actor.imagen_credito && showImage && (
          <p className="text-xs text-muted-foreground">
            Foto: {actor.imagen_credito}
            {actor.imagen_fuente_url && (
              <>
                {" · "}
                <a
                  href={actor.imagen_fuente_url}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(
                    "text-smoke no-underline hover:text-white",
                    focusRingInline,
                  )}
                >
                  fuente
                </a>
              </>
            )}
          </p>
        )}
      </div>
      <ul className="space-y-1.5 border-t border-border pt-3">
        {actor.fuentes.map((f) => (
          <li key={f.url} className="text-xs leading-relaxed text-muted-foreground">
            <a
              href={f.url}
              target="_blank"
              rel="noreferrer"
              className={cn(
                "text-smoke no-underline hover:text-white",
                focusRingInline,
              )}
            >
              {f.medio}
            </a>
            {" · "}
            <time dateTime={f.fecha}>{f.fecha}</time>
            {f.nota ? ` — ${f.nota}` : null}
          </li>
        ))}
      </ul>
    </article>
  );
}

export function ContextoTransicion({ marco }: { marco: MarcoPolitico }) {
  return (
    <div className="space-y-12">
      <Reveal className="space-y-2">
        <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
          Tipo de análisis
        </p>
        <p className="max-w-3xl text-sm leading-relaxed text-bone sm:text-[0.95rem]">
          {marco.tipo_analisis}
        </p>
        <p className="text-sm text-muted-foreground">
          Estado: {ESTADO_LABEL[marco.estado_acto]} · Actualizado{" "}
          <time dateTime={marco.actualizado_at}>
            {marco.actualizado_at.slice(0, 10)}
          </time>
        </p>
      </Reveal>

      <section aria-labelledby="transicion-dual">
        <Reveal delay={0.06}>
          <h2
            id="transicion-dual"
            className="mb-4 text-lg font-medium tracking-tight text-white"
          >
            Transición
          </h2>
        </Reveal>
        <div className="grid gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-start">
          <Reveal delay={0.1} y={16}>
            <ActorPortrait actor={marco.presidente_ejercicio} />
          </Reveal>
          <Reveal
            delay={0.14}
            className="hidden flex-col items-center justify-center gap-2 self-center px-2 lg:flex"
            aria-hidden
          >
            <span className="text-2xl text-primary">→</span>
            <span className="max-w-[6rem] text-center text-xs text-muted-foreground">
              Empalme
            </span>
          </Reveal>
          <Reveal delay={0.16} y={16}>
            <ActorPortrait actor={marco.presidente_electo_o_sucesor} />
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="timeline-transicion">
        <Reveal>
          <h2
            id="timeline-transicion"
            className="mb-4 text-lg font-medium tracking-tight text-white"
          >
            Timeline
          </h2>
        </Reveal>
        <ol className="relative space-y-0 border-l border-border pl-6">
          {marco.timeline.map((item, i) => (
            <li key={`${item.fecha}-${item.titulo}`}>
              <Reveal delay={0.05 * i}>
                <div className="relative pb-8 last:pb-0">
                  <span
                    aria-hidden
                    className="absolute -left-[1.625rem] top-1.5 size-2.5 border border-primary bg-black"
                  />
                  <p className="font-mono text-xs tabular-nums text-iris">
                    <time dateTime={item.fecha}>{item.fecha}</time>
                  </p>
                  <h3 className="mt-1 text-base font-medium text-white">
                    {item.titulo}
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                    {item.detalle}
                  </p>
                  {item.fuente_url ? (
                    <a
                      href={item.fuente_url}
                      target="_blank"
                      rel="noreferrer"
                      className={cn(
                        "mt-1 inline-block text-xs text-smoke no-underline hover:text-white",
                        focusRingInline,
                      )}
                    >
                      Fuente →
                    </a>
                  ) : (
                    <span className="mt-1 inline-block text-xs text-muted-foreground">
                      Fuente: N/D
                    </span>
                  )}
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="contraste-ejes">
        <Reveal>
          <h2
            id="contraste-ejes"
            className="mb-2 text-lg font-medium tracking-tight text-white"
          >
            Contraste por ejes
          </h2>
          <p className="mb-4 max-w-2xl text-sm text-muted-foreground">
            Status quo / relato saliente vs discurso o programa del entrante.
            Sin fuente fiable → N/D.
          </p>
        </Reveal>
        <div className="overflow-x-auto border border-border">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="px-4 py-3 font-medium">Eje</th>
                <th className="px-4 py-3 font-medium">
                  {marco.presidente_ejercicio.rol_label}
                </th>
                <th className="px-4 py-3 font-medium">
                  {marco.presidente_electo_o_sucesor.rol_label}
                </th>
                <th className="px-4 py-3 font-medium">Fuente</th>
              </tr>
            </thead>
            <tbody>
              {marco.contraste_ejes.map((eje) => (
                <tr key={eje.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 align-top font-medium text-white">
                    {eje.titulo}
                  </td>
                  <td className="px-4 py-3 align-top text-bone">{eje.lado_a}</td>
                  <td className="px-4 py-3 align-top text-bone">{eje.lado_b}</td>
                  <td className="px-4 py-3 align-top text-muted-foreground">
                    {eje.fuente_url ? (
                      <a
                        href={eje.fuente_url}
                        target="_blank"
                        rel="noreferrer"
                        className={cn(
                          "text-smoke no-underline hover:text-white",
                          focusRingInline,
                        )}
                      >
                        Ver
                      </a>
                    ) : (
                      "N/D"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Reveal as="p" className="max-w-2xl text-sm text-muted-foreground">
        Pregunta central: {marco.pregunta_central} Horizontes:{" "}
        {marco.horizontes_dias.join(" / ")} días.
      </Reveal>
    </div>
  );
}
