import {
  workflow,
  node,
  trigger,
  sticky,
  expr,
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

const out = [];
for (const item of $input.all()) {
  const j = item.json;
  const raw = j.data || j;
  if (j.ingest_error || raw.ingest_error) {
    out.push({
      json: {
        collection: 'ingest_errors',
        id: 'err-wf-d-' + Date.now(),
        data: { ...(raw.payload || raw), workflow_id: 'wf-d-clasificar', created_at: new Date().toISOString() },
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
        id: 'err-wf-d-' + Date.now(),
        data: { reason: 'missing url', payload: raw, workflow_id: 'wf-d-clasificar', created_at: new Date().toISOString() },
      },
    });
    continue;
  }
  const caso_id = String(titulo).toLowerCase().replace(/[^a-z0-9]+/g,'-').slice(0,40) || 'tema';
  const checklist = { plan_mecanismo:false, responsables_equipo:false, plazos:false, recursos:false, metricas:false, contraste_status_quo:false };
  const n = 1;
  const scores = calcular({ checklist, n, identidad: false });
  const mencionId = 'men-' + Buffer.from(String(url)).toString('base64url').slice(0, 28);
  const mencion = {
    id: mencionId,
    caso_id,
    actor_id: 'N/D',
    fecha: raw.fecha || 'N/D',
    url,
    cita_corta: String(raw.resumen || titulo).slice(0, 280) || 'N/D',
    tipo_pieza: 'noticia',
    ingerido_en: new Date().toISOString(),
    workflow_id: 'wf-d-clasificar',
    evidencia_checklist: checklist,
  };
  const caso = {
    id: caso_id,
    titulo,
    area: 'exterior',
    actor_id: 'N/D',
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
    campos_pendientes: ['importancia','factibilidad','actor_id','area'],
    updated_at: new Date().toISOString(),
    workflow_id: 'wf-d-clasificar',
  };
  out.push({ json: { collection: 'menciones', id: mencion.id, data: mencion } });
  out.push({ json: { collection: 'casos', id: caso.id, data: caso } });
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
      authentication: 'none',
      sendHeaders: true,
      headerParameters: {
        parameters: [
          { name: 'Content-Type', value: 'application/json' },
          { name: 'x-ingest-secret', value: 'escenarios-dev-ingest' },
        ],
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
  },
});

const note = sticky(
  'WF-D: clasifica → menciones + casos vía /api/ingest. Ejecutar a mano. Header x-ingest-secret = INGEST_SECRET.',
);

export default workflow('wf-d-clasificar-colombia', 'CO WF-D Clasificar Credibilidad')
  .add(manual)
  .to(classify)
  .to(postIngest)
  .add(note);
