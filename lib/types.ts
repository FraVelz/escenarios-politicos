import type { EspecificidadChecklist, CredibilidadDesglose } from "./credibilidad";
import type { AreaId } from "./areas";

/** Slug ISO-ish en minúsculas (`co`, `mx`, …). */
export type CountryId = string;

export type PaisMeta = {
  id: CountryId;
  nombre: string;
  nombre_corto: string;
  locale: string;
};

export type Caso = {
  id: string;
  country_id: CountryId;
  titulo: string;
  area: AreaId;
  actor_id: string;
  fase: "campana" | "transicion" | "gobierno";
  n_menciones: number;
  primera_mencion_at?: string | null;
  ultima_mencion_at?: string | null;
  especificidad: number;
  especificidad_checklist?: EspecificidadChecklist;
  credibilidad: number;
  credibilidad_desglose: CredibilidadDesglose;
  discurso_identidad: boolean;
  importancia: "alta" | "media" | "baja" | "N/D";
  factibilidad: "alta" | "media" | "baja" | "N/D";
  funcion_retorica?: string;
  revision: "pendiente" | "en_seguimiento" | "archivado";
  campos_pendientes: string[];
  updated_at: string;
  notas?: string;
  workflow_id?: string;
};

export type Mencion = {
  id: string;
  country_id: CountryId;
  caso_id: string;
  actor_id: string;
  fecha: string;
  url: string;
  cita_corta: string;
  tipo_pieza: string;
  ingerido_en: string;
  workflow_id: string;
};

export type Alerta = {
  id: string;
  country_id?: string;
  tipo: string;
  caso_id: string;
  mensaje: string;
  created_at: string;
};

export type MarcoFuente = {
  medio: string;
  url: string;
  fecha: string;
  nota?: string;
};

export type MarcoActor = {
  nombre: string;
  rol_label: string;
  periodo_inicio?: string;
  periodo_fin?: string;
  posesion_at?: string;
  vice_nombre?: string;
  imagen_url?: string | null;
  imagen_credito?: string | null;
  imagen_fuente_url?: string | null;
  fuentes: MarcoFuente[];
};

export type MarcoTimelineItem = {
  fecha: string;
  titulo: string;
  detalle: string;
  fuente_url?: string | null;
};

export type MarcoContrasteEje = {
  id: string;
  titulo: string;
  lado_a: string;
  lado_b: string;
  fuente_url?: string | null;
};

export type EstadoActo =
  | "gobierno_estable"
  | "transicion_pre_posesion"
  | "post_transicion_reciente"
  | "sin_sucesor_conocido";

export type MarcoPolitico = {
  country_id: CountryId;
  tipo_analisis: string;
  estado_acto: EstadoActo;
  actualizado_at: string;
  pregunta_central: string;
  horizontes_dias: number[];
  presidente_ejercicio: MarcoActor;
  presidente_electo_o_sucesor: MarcoActor;
  timeline: MarcoTimelineItem[];
  contraste_ejes: MarcoContrasteEje[];
};


export type CapaPoder =
  | "ejecutivo"
  | "legislativo"
  | "judicial"
  | "macro"
  | "seguridad"
  | "regional"
  | "elites";

export type FuenteRef = {
  medio: string;
  url: string;
  fecha: string;
  nota?: string;
};

export type Institucion = {
  id: string;
  country_id: CountryId;
  nombre: string;
  capa: CapaPoder;
  rol: string;
  veto_notes: string;
  caso_ids: string[];
  fuentes: FuenteRef[];
};

export type Partido = {
  id: string;
  country_id: CountryId;
  nombre: string;
  coalicion: string;
  espectro: string;
  fuentes: FuenteRef[];
};

export type ActorPolitico = {
  id: string;
  country_id: CountryId;
  nombre: string;
  partido_id: string | null;
  roles: string[];
  caso_ids: string[];
  fuentes: FuenteRef[];
};

export type EscenarioSeed = {
  id: string;
  country_id: CountryId;
  tipo: "base" | "optimista" | "pesimista";
  titulo: string;
  resumen: string;
  horizonte_dias: number;
  fuente_url?: string | null;
};

export type SenalSeed = {
  id: string;
  country_id: CountryId;
  titulo: string;
  detalle: string;
  escenario_id?: string | null;
  caso_id?: string | null;
  fuente_url?: string | null;
  created_at: string;
};
