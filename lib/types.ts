import type { EspecificidadChecklist, CredibilidadDesglose } from "./credibilidad";

export type Caso = {
  id: string;
  titulo: string;
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
};

export type Mencion = {
  id: string;
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
  tipo: string;
  caso_id: string;
  mensaje: string;
  created_at: string;
};
