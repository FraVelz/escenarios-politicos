import { workflow, node, trigger, sticky } from '@n8n/workflow-sdk';

const schedule = trigger({
  type: 'n8n-nodes-base.scheduleTrigger',
  version: 1.3,
  config: {
    name: 'Weekly Macro',
    parameters: {
      rule: {
        interval: [{ field: 'weeks', weeksInterval: 1, triggerAtDay: [1], triggerAtHour: 8, triggerAtMinute: 0 }],
      },
    },
  },
});

const fetchWb = node({
  type: 'n8n-nodes-base.httpRequest',
  version: 4.4,
  config: {
    name: 'World Bank COL CPI',
    parameters: {
      method: 'GET',
      url: 'https://api.worldbank.org/v2/country/COL/indicator/FP.CPI.TOTL.ZG?format=json&per_page=5',
      authentication: 'none',
    },
  },
});

const normalize = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Normalize Indicador',
    parameters: {
      mode: 'runOnceForAllItems',
      language: 'javaScript',
      jsCode: `const body = $input.first().json;
// World Bank returns [meta, data[]]
const rows = Array.isArray(body) ? body[1] : (body?.[1] || []);
const latest = (rows || []).find(r => r && r.value !== null) || rows?.[0] || {};
const indicador = {
  id: 'ind-inflacion-col',
  codigo: 'FP.CPI.TOTL.ZG',
  nombre: 'Inflacion IPC (World Bank)',
  valor: latest.value ?? 'N/D',
  fecha: latest.date ? String(latest.date) : 'N/D',
  fuente_url: 'https://api.worldbank.org/v2/country/COL/indicator/FP.CPI.TOTL.ZG?format=json',
  pais: 'COL',
  unidad: '%',
  updated_at: new Date().toISOString(),
  workflow_id: 'wf-a-macro',
};
// Validacion minima schema indicador
const required = ['id','codigo','valor','fecha','fuente_url','pais'];
const missing = required.filter(k => indicador[k] === undefined || indicador[k] === null || indicador[k] === '');
if (missing.length) {
  return [{ json: { ingest_error: true, reason: 'missing fields: ' + missing.join(','), payload: indicador } }];
}
return [{ json: indicador }];`,
    },
  },
});

const note = sticky(
  'WF-A Macro Colombia: World Bank → indicador normalizado. Conectar HTTP Firebase/Admin o Data Table para persistir. Si ingest_error=true → colección ingest_errors.',
);

export default workflow('wf-a-macro-colombia', 'CO WF-A Macro World Bank')
  .add(schedule)
  .to(fetchWb)
  .to(normalize)
  .add(note);
