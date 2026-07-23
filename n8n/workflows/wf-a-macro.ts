import {
  workflow,
  node,
  trigger,
  sticky,
  expr,
  newCredential,
} from '@n8n/workflow-sdk';

const schedule = trigger({
  type: 'n8n-nodes-base.scheduleTrigger',
  version: 1.3,
  config: {
    name: 'Weekly Macro',
    parameters: {
      rule: {
        interval: [
          {
            field: 'weeks',
            weeksInterval: 1,
            triggerAtDay: [1],
            triggerAtHour: 8,
            triggerAtMinute: 0,
          },
        ],
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
      jsCode: `const items = $input.all().map(i => i.json);
let rows = [];
const first = items[0];
if (Array.isArray(first) && Array.isArray(first[1])) {
  rows = first[1];
} else if (items.length >= 2 && Array.isArray(items[1]) && items[1][0]?.countryiso3code) {
  rows = items[1];
} else if (items.some(i => i && i.countryiso3code)) {
  rows = items.filter(i => i && i.countryiso3code);
} else {
  for (const it of items) {
    if (Array.isArray(it) && Array.isArray(it[1])) { rows = it[1]; break; }
    if (Array.isArray(it) && it[0]?.countryiso3code) { rows = it; break; }
  }
}
const latest = rows.find(r => r && r.value !== null && r.value !== undefined) || rows[0] || {};
const indicador = {
  id: 'ind-inflacion-col',
  codigo: 'FP.CPI.TOTL.ZG',
  nombre: 'Inflacion IPC (World Bank)',
  valor: latest.value ?? 'N/D',
  fecha: latest.date ? String(latest.date) : 'N/D',
  fuente_url: 'https://api.worldbank.org/v2/country/COL/indicator/FP.CPI.TOTL.ZG?format=json',
  pais: 'COL',
  country_id: 'co',
  unidad: '%',
  updated_at: new Date().toISOString(),
  workflow_id: 'wf-a-macro',
};
const required = ['id','codigo','valor','fecha','fuente_url','pais'];
const missing = required.filter(k => indicador[k] === undefined || indicador[k] === null || indicador[k] === '');
if (missing.length) {
  return [{
    json: {
      collection: 'ingest_errors',
      id: 'err-wf-a-' + Date.now(),
        data: {
          reason: 'missing fields: ' + missing.join(','),
          payload: { id: indicador.id, codigo: indicador.codigo },
          country_id: 'co',
          workflow_id: 'wf-a-macro',
          created_at: new Date().toISOString(),
        },
    },
  }];
}
return [{
  json: {
    collection: 'indicadores',
    id: indicador.id,
    data: indicador,
  },
}];`,
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
    },
    credentials: {
      httpHeaderAuth: newCredential('Escenarios Ingest'),
    },
  },
});

const note = sticky(
  'WF-A → /api/ingest (Admin SDK). Credencial Header Auth "Escenarios Ingest": Name=x-ingest-secret, Value=<INGEST_SECRET de Vercel>. Nunca pegar el secreto en el nodo.',
);

export default workflow('wf-a-macro-colombia', 'CO WF-A Macro World Bank')
  .add(schedule)
  .to(fetchWb)
  .to(normalize)
  .to(postIngest)
  .add(note);
