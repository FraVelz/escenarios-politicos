import {
  workflow,
  node,
  trigger,
  sticky,
  expr,
  newCredential,
} from '@n8n/workflow-sdk';

const manual = trigger({
  type: 'n8n-nodes-base.manualTrigger',
  version: 1,
  config: { name: 'Manual / cola raw' },
});

const classify = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Clasificar y credibilidad',
    parameters: {
      mode: 'runOnceForAllItems',
      language: 'javaScript',
      jsCode: `const POINTS = { plan_mecanismo:25, responsables_equipo:20, plazos:15, recursos:20, metricas:10, contraste_status_quo:10 };
function scoreEspecificidad(c){ let s=0; for (const k of Object.keys(POINTS)) if (c[k]) s += POINTS[k]; return Math.min(100,s); }
function scoreRepeticion(n){ if(n<=0)return 0; if(n===1)return 20; if(n>=30)return 100; return Math.round(20+(Math.log10(n)/Math.log10(30))*80); }
function calcular({checklist,n,identidad}){ const e=scoreEspecificidad(checklist); const r=scoreRepeticion(n); const cen=identidad?100:20; const cr=Math.round(Math.min(100,Math.max(0,0.45*e+0.25*r+0.3*cen))); return {credibilidad:cr,desglose:{especificidad:e,repeticion_norm:r,centralidad:cen}}; }

/** Catálogo CO: no inventar casos desde títulos RSS. */
const CATALOG = [
  { id:'paz-total-identidad', actor_id:'co-abelardo-espriella', area:'paz_seguridad', keys:['paz total','paz','seguridad'] },
  { id:'seguridad-rural-eslogan', actor_id:'co-abelardo-espriella', area:'paz_seguridad', keys:['seguridad rural','rural'] },
  { id:'empleo-con-plan', actor_id:'co-abelardo-espriella', area:'empleo', keys:['empleo plan','plan de empleo','trabajo formal'] },
  { id:'empleo-eslogan', actor_id:'co-abelardo-espriella', area:'empleo', keys:['empleo','trabajo'] },
  { id:'reforma-fiscal-tecnica', actor_id:'co-abelardo-espriella', area:'fiscal', keys:['reforma fiscal','tributaria'] },
  { id:'regla-fiscal-relajacion', actor_id:'co-abelardo-espriella', area:'fiscal', keys:['regla fiscal'] },
  { id:'salud-plan-hospitales', actor_id:'co-abelardo-espriella', area:'salud', keys:['hospital','salud plan'] },
  { id:'salud-eslogan-gratis', actor_id:'co-abelardo-espriella', area:'salud', keys:['salud gratis','salud'] },
  { id:'educacion-jornada-unica', actor_id:'co-abelardo-espriella', area:'educacion', keys:['jornada unica','educacion'] },
  { id:'infra-metro-regional', actor_id:'co-abelardo-espriella', area:'infraestructura', keys:['metro','infraestructura'] },
  { id:'vivienda-subsidios', actor_id:'co-abelardo-espriella', area:'vivienda_social', keys:['vivienda','subsidio'] },
  { id:'justicia-reforma-procesal', actor_id:'co-abelardo-espriella', area:'justicia', keys:['justicia','procesal'] },
  { id:'exterior-discurso-soberania', actor_id:'co-abelardo-espriella', area:'exterior', keys:['soberania','exterior','diplomatic'] },
  { id:'energia-transicion-electo', actor_id:'co-abelardo-espriella', area:'energia_clima', keys:['energia','transicion energetica','clima'] },
  { id:'agro-seguridad-alimentaria', actor_id:'co-abelardo-espriella', area:'agro_rural', keys:['agro','alimentaria','campo'] },
  { id:'estado-digital-tramites', actor_id:'co-abelardo-espriella', area:'tecnologia_estado', keys:['estado digital','tramite','digital'] },
];

function matchCaso(text, explicitId) {
  if (explicitId && CATALOG.some(c => c.id === explicitId)) {
    return CATALOG.find(c => c.id === explicitId);
  }
  const t = String(text || '').toLowerCase();
  let best = null;
  let bestScore = 0;
  for (const c of CATALOG) {
    let score = 0;
    for (const k of c.keys) if (t.includes(k)) score += k.length;
    if (score > bestScore) { bestScore = score; best = c; }
  }
  return bestScore > 0 ? best : null;
}

function sanitizePayload(raw) {
  return {
    url: raw.url || null,
    titulo: raw.titulo ? String(raw.titulo).slice(0, 120) : null,
    fecha: raw.fecha || null,
  };
}

const out = [];
for (const item of $input.all()) {
  const j = item.json;
  const raw = j.data || j;
  const country_id = raw.country_id || j.country_id || 'co';
  if (j.ingest_error || raw.ingest_error) {
    out.push({
      json: {
        collection: 'ingest_errors',
        id: 'err-wf-d-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7),
        data: {
          reason: String(raw.reason || 'ingest_error'),
          payload: sanitizePayload(raw.payload || raw),
          country_id,
          workflow_id: 'wf-d-clasificar',
          created_at: new Date().toISOString(),
        },
      },
    });
    continue;
  }
  const url = raw.url || j.url;
  const titulo = raw.titulo || j.titulo || 'N/D';
  if (!url) {
    out.push({
      json: {
        collection: 'ingest_errors',
        id: 'err-wf-d-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7),
        data: {
          reason: 'missing url',
          payload: sanitizePayload(raw),
          country_id,
          workflow_id: 'wf-d-clasificar',
          created_at: new Date().toISOString(),
        },
      },
    });
    continue;
  }
  const hit = matchCaso([titulo, raw.resumen, raw.caso_id].filter(Boolean).join(' '), raw.caso_id || j.caso_id);
  if (!hit) {
    out.push({
      json: {
        collection: 'ingest_errors',
        id: 'err-wf-d-unmatched-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7),
        data: {
          reason: 'unmatched_caso',
          payload: sanitizePayload({ ...raw, url, titulo }),
          country_id,
          workflow_id: 'wf-d-clasificar',
          created_at: new Date().toISOString(),
        },
      },
    });
    continue;
  }
  const checklist = { plan_mecanismo:false, responsables_equipo:false, plazos:false, recursos:false, metricas:false, contraste_status_quo:false };
  const n = 1;
  const scores = calcular({ checklist, n, identidad: false });
  const mencionId = 'men-' + Buffer.from(String(url)).toString('base64url').slice(0, 28);
  const mencion = {
    id: mencionId,
    country_id,
    caso_id: hit.id,
    actor_id: hit.actor_id,
    fecha: raw.fecha || 'N/D',
    url,
    cita_corta: String(raw.resumen || titulo).slice(0, 280) || 'N/D',
    tipo_pieza: 'noticia',
    ingerido_en: new Date().toISOString(),
    workflow_id: 'wf-d-clasificar',
    evidencia_checklist: checklist,
  };
  // Solo mención + gap de caso (no inventar actor N/D ni slug nuevo).
  // Recalcular n_menciones/credibilidad queda a un job de consolidación / revisión humana.
  const casoPatch = {
    id: hit.id,
    country_id,
    titulo: hit.id,
    area: hit.area,
    actor_id: hit.actor_id,
    fase: 'campana',
    n_menciones: n,
    especificidad: scores.desglose.especificidad,
    especificidad_checklist: checklist,
    credibilidad: scores.credibilidad,
    credibilidad_desglose: scores.desglose,
    discurso_identidad: false,
    importancia: 'N/D',
    factibilidad: 'N/D',
    revision: 'pendiente',
    campos_pendientes: ['importancia','factibilidad','recalcular_n_menciones'],
    updated_at: new Date().toISOString(),
    workflow_id: 'wf-d-clasificar',
  };
  out.push({ json: { collection: 'menciones', id: mencion.id, data: mencion } });
  // No overwrite título del caso seed: omitir casoPatch si solo queremos mención.
  // Emite ingest_runs marker vía campos_pendientes en mención; caso solo si raw.force_caso_patch.
  if (raw.force_caso_patch) {
    out.push({ json: { collection: 'casos', id: casoPatch.id, data: casoPatch } });
  }
}
return out;`,
    },
  },
});

const postIngest = node({
  type: 'n8n-nodes-base.httpRequest',
  version: 4.4,
  config: {
    name: 'POST Firebase via API',
    parameters: {
      method: 'POST',
      url: 'https://escenarios-politicos.vercel.app/api/ingest',
      authentication: 'genericCredentialType',
      genericAuthType: 'httpHeaderAuth',
      sendHeaders: true,
      headerParameters: {
        parameters: [{ name: 'Content-Type', value: 'application/json' }],
      },
      sendBody: true,
      contentType: 'json',
      specifyBody: 'json',
      jsonBody: expr(
        '={{ JSON.stringify({ collection: $json.collection, id: $json.id, data: $json.data }) }}',
      ),
      options: {
        batching: {
          batch: { batchSize: 5, batchInterval: 400 },
        },
      },
    },
    credentials: {
      httpHeaderAuth: newCredential('Escenarios Ingest'),
    },
  },
});

const note = sticky(
  'WF-D: empareja raw a catálogo CO (sin inventar casos/actor N/D). unmatched → ingest_errors. force_caso_patch=true para parchear caso.',
);

export default workflow('wf-d-clasificar-colombia', 'CO WF-D Clasificar Credibilidad')
  .add(manual)
  .to(classify)
  .to(postIngest)
  .add(note);
