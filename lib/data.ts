import seedCasos from "@/content/seed/casos.json";
import seedMenciones from "@/content/seed/menciones.json";
import seedMarco from "@/content/seed/marco.json";
import seedInstituciones from "@/content/seed/instituciones.json";
import seedPartidos from "@/content/seed/partidos.json";
import seedActores from "@/content/seed/actores.json";
import seedEscenarios from "@/content/seed/escenarios.json";
import seedSenales from "@/content/seed/senales.json";
import type {
  ActorPolitico,
  Alerta,
  Caso,
  EscenarioSeed,
  Institucion,
  MarcoPolitico,
  Mencion,
  Partido,
  SenalSeed,
} from "./types";

function allCasos(): Caso[] {
  return seedCasos as Caso[];
}

function allMenciones(): Mencion[] {
  return seedMenciones as Mencion[];
}

export function getMarcoSync(countryId?: string): MarcoPolitico | null {
  const marco = seedMarco as MarcoPolitico;
  if (countryId && marco.country_id !== countryId) return null;
  return marco;
}

export function listCasosSync(countryId?: string): Caso[] {
  const all = allCasos();
  return countryId ? all.filter((c) => c.country_id === countryId) : all;
}

export function getCasoSync(id: string, countryId?: string): Caso | null {
  const c = allCasos().find((x) => x.id === id) ?? null;
  if (!c) return null;
  if (countryId && c.country_id !== countryId) return null;
  return c;
}

export function listMencionesSync(opts?: {
  casoId?: string;
  countryId?: string;
}): Mencion[] {
  let all = allMenciones();
  if (opts?.countryId) {
    all = all.filter((m) => m.country_id === opts.countryId);
  }
  if (opts?.casoId) {
    all = all.filter((m) => m.caso_id === opts.casoId);
  }
  return all;
}

export function listInstitucionesSync(countryId?: string): Institucion[] {
  const all = seedInstituciones as Institucion[];
  return countryId ? all.filter((i) => i.country_id === countryId) : all;
}

export function listPartidosSync(countryId?: string): Partido[] {
  const all = seedPartidos as Partido[];
  return countryId ? all.filter((p) => p.country_id === countryId) : all;
}

export function listActoresSync(countryId?: string): ActorPolitico[] {
  const all = seedActores as ActorPolitico[];
  return countryId ? all.filter((a) => a.country_id === countryId) : all;
}

export function listEscenariosSync(countryId?: string): EscenarioSeed[] {
  const all = seedEscenarios as EscenarioSeed[];
  return countryId ? all.filter((e) => e.country_id === countryId) : all;
}

export function listSenalesSync(countryId?: string): SenalSeed[] {
  const all = seedSenales as SenalSeed[];
  return countryId ? all.filter((s) => s.country_id === countryId) : all;
}

export function listAlertasSync(countryId?: string): Alerta[] {
  const alertas: Alerta[] = [
    {
      id: "ruido-empleo-eslogan",
      tipo: "ruido_vacio",
      caso_id: "empleo-eslogan",
      mensaje: "Alta frecuencia + baja especificidad",
      created_at: "2026-07-21T20:00:00Z",
    },
    {
      id: "identidad-paz-factibilidad",
      tipo: "credibilidad_alta_factibilidad_baja",
      caso_id: "paz-total-identidad",
      mensaje: "Discurso identidad con factibilidad baja",
      created_at: "2026-07-21T20:00:00Z",
    },
  ];
  if (!countryId) return alertas;
  const casoIds = new Set(listCasosSync(countryId).map((c) => c.id));
  return alertas.filter((a) => casoIds.has(a.caso_id));
}

export function gapsFromCasos(casos: Caso[]): { caso_id: string; campos: string[] }[] {
  return casos
    .filter(
      (c) =>
        (c.campos_pendientes?.length ?? 0) > 0 ||
        c.importancia === "N/D" ||
        c.factibilidad === "N/D",
    )
    .map((c) => ({
      caso_id: c.id,
      campos: [
        ...(c.campos_pendientes ?? []),
        ...(c.importancia === "N/D" ? ["importancia"] : []),
        ...(c.factibilidad === "N/D" ? ["factibilidad"] : []),
      ].filter((v, i, a) => a.indexOf(v) === i),
    }));
}
