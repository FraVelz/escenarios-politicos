"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { AlertTriangle, Fingerprint, TrendingUp } from "lucide-react";
import type { Alerta, Caso } from "@/lib/types";
import { useLiveCasos } from "@/components/LiveCasos";
import { AnimatedNumber } from "@/components/AnimatedNumber";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

function GapIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M9.5 4h5" />
      <path d="M8 8h8" />
      <path d="M7 12h10" />
      <path d="M9.5 16h5" />
      <path d="M11 20h2" />
      <circle cx="18" cy="6" r="2" />
    </svg>
  );
}

export function CasosHomeClient({
  initialCasos,
  identidad,
  topCred,
  alertas,
  gapsCount,
}: {
  initialCasos: Caso[];
  identidad: Caso[];
  topCred: Caso[];
  alertas: Alerta[];
  gapsCount: number;
}) {
  const { source } = useLiveCasos(initialCasos);
  const reduce = useReducedMotion();

  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduce ? 0 : 0.06 },
    },
  };

  const item = {
    hidden: reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <div className="space-y-10">
      <p className="text-xs text-muted-foreground">
        Fuente de datos:{" "}
        <span className="font-medium text-foreground">{source}</span>
      </p>

      <motion.div
        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item}>
          <Card className="border-border/80 bg-card/80">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1.5">
                <Fingerprint className="size-3.5" />
                Identidad
              </CardDescription>
              <CardTitle className="score-mono text-2xl">
                {identidad.length}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              Casos con discurso identidad
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={item}>
          <Card className="border-border/80 bg-card/80">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1.5">
                <TrendingUp className="size-3.5" />
                Top credibilidad
              </CardDescription>
              <CardTitle className="score-mono text-2xl">
                {topCred[0] ? `${topCred[0].credibilidad}%` : "—"}
              </CardTitle>
            </CardHeader>
            <CardContent className="truncate text-xs text-muted-foreground">
              {topCred[0]?.titulo ?? "Sin casos"}
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={item}>
          <Card className="border-border/80 bg-card/80">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1.5">
                <AlertTriangle className="size-3.5 text-warn" />
                Alertas
              </CardDescription>
              <CardTitle className="score-mono text-2xl">
                {alertas.length}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              Señales activas
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={item}>
          <Card className="border-border/80 bg-card/80">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1.5">
                <GapIcon className="size-3.5" />
                Gaps
              </CardDescription>
              <CardTitle className="score-mono text-2xl">{gapsCount}</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              <Link href="/gaps" className="no-underline hover:underline">
                Revisar pendientes →
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <section>
        <h2 className="mb-3 text-lg font-semibold tracking-tight">
          Discurso identidad
        </h2>
        <motion.div
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {identidad.length === 0 && (
            <p className="text-sm text-muted-foreground">Ninguno marcado.</p>
          )}
          {identidad.map((c) => (
            <motion.div key={c.id} variants={item}>
              <Link href={`/casos/${c.id}`} className="block no-underline">
                <Card className="h-full transition-colors hover:border-primary/40 hover:bg-accent/30">
                  <CardHeader>
                    <Badge variant="identidad" className="w-fit">
                      identidad
                    </Badge>
                    <CardTitle className="text-sm leading-snug text-foreground">
                      {c.titulo}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AnimatedNumber
                      value={c.credibilidad}
                      suffix="%"
                      className="text-xl"
                    />
                    <p className="mt-1 text-xs text-muted-foreground">
                      factibilidad: {c.factibilidad}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold tracking-tight">
          Top credibilidad
        </h2>
        <motion.div
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {topCred.map((c) => (
            <motion.div key={c.id} variants={item}>
              <Link href={`/casos/${c.id}`} className="block no-underline">
                <Card className="h-full transition-colors hover:border-primary/40 hover:bg-accent/30">
                  <CardHeader>
                    {c.discurso_identidad && (
                      <Badge variant="identidad" className="w-fit">
                        identidad
                      </Badge>
                    )}
                    <CardTitle className="text-sm leading-snug text-foreground">
                      {c.titulo}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <AnimatedNumber
                      value={c.credibilidad}
                      suffix="%"
                      className="text-xl"
                    />
                    <Progress value={c.credibilidad} />
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold tracking-tight">Alertas</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {alertas.length === 0 && (
            <p className="text-sm text-muted-foreground">Sin alertas.</p>
          )}
          {alertas.map((a) => (
            <Card key={a.id}>
              <CardHeader>
                <Badge variant="warn" className="w-fit">
                  {a.tipo}
                </Badge>
                <CardTitle className="text-sm font-normal leading-snug text-foreground">
                  {a.mensaje}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Link
                  href={`/casos/${a.caso_id}`}
                  className="text-sm no-underline hover:underline"
                >
                  {a.caso_id}
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
