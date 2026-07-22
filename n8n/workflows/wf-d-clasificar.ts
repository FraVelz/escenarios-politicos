import { workflow, node, trigger, sticky } from '@n8n/workflow-sdk';

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
      jsCode: `// Stub clasificador: produce mencion + actualizacion de caso.
// En produccion: sustituir por nodo LLM con prompt del playbook 02.
const POINTS = { plan_mecanismo:25, responsables_equipo:20, plazos:15, recursos:20, metricas:10, contraste_status_quo:10 };
function scoreEspecificidad(c){ let s=0; for (const k of Object.keys(POINTS)) if (c[k]) s += POINTS[k]; return Math.min(100,s); }
function scoreRepeticion(n){ if(n<=0)return 0; if(n===1)return 20; if(n>=30)return 100; return Math.round(20+(Math.log10(n)/Math.log10(30))*80); }
function calcular({checklist,n,identidad}){ const e=scoreEspecificidad(checklist); const r=scoreRepeticion(n); const cen=identidad?100:20; const cr=Math.round(Math.min(100,Math.max(0,0.45*e+0.25*r+0.3*cen))); return {credibilidad:cr,desglose:{especificidad:e,repeticion_norm:r,centralidad:cen}}; }

const out = [];
for (const item of $input.all()) {
  const j = item.json;
  if (j.ingest_error) { out.push({ json: j }); continue; }
  const required = ['url','titulo'];
  const missing = required.filter(k => !j[k]);
  if (missing.length) {
    out.push({ json: { ingest_error: true, reason: 'missing '+missing.join(','), payload: j, workflow_id: 'wf-d-clasificar' } });
    continue;
  }
  const caso_id = (j.titulo || 'tema').toLowerCase().replace(/[^a-z0-9]+/g,'-').slice(0,40) || 'tema';
  const checklist = { plan_mecanismo:false, responsables_equipo:false, plazos:false, recursos:false, metricas:false, contraste_status_quo:false };
  const n = 1;
  const scores = calcular({ checklist, n, identidad: false });
  const mencion = {
    id: 'men-' + Date.now(),
    caso_id,
    actor_id: 'N/D',
    fecha: j.fecha || 'N/D',
    url: j.url,
    cita_corta: (j.resumen || j.titulo || '').slice(0, 280) || 'N/D',
    tipo_pieza: 'noticia',
    ingerido_en: new Date().toISOString(),
    workflow_id: 'wf-d-clasificar',
    evidencia_checklist: checklist,
  };
  const caso = {
    id: caso_id,
    titulo: j.titulo || caso_id,
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
    campos_pendientes: ['importancia','factibilidad','actor_id'],
    updated_at: new Date().toISOString(),
  };
  out.push({ json: { mencion, caso } });
}
return out;`,
    },
  },
});

const note = sticky(
  'WF-D: clasifica raw_items → menciones/casos + recalcula credibilidad (fórmula playbook). Conectar escritura Firestore. Sustituir Code stub por LLM cuando haya credencial.',
);

export default workflow('wf-d-clasificar-colombia', 'CO WF-D Clasificar Credibilidad')
  .add(manual)
  .to(classify)
  .add(note);
