import {
  workflow,
  node,
  trigger,
  sticky,
  expr,
} from '@n8n/workflow-sdk';

const every6h = trigger({
  type: 'n8n-nodes-base.scheduleTrigger',
  version: 1.3,
  config: {
    name: 'Every 6h',
    parameters: {
      rule: {
        interval: [{ field: 'hours', hoursInterval: 6 }],
      },
    },
  },
});

const rss = node({
  type: 'n8n-nodes-base.rssFeedRead',
  version: 1.2,
  config: {
    name: 'RSS El Espectador',
    parameters: {
      url: 'https://www.elespectador.com/rss.xml',
    },
  },
});

const toRaw = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Normalize raw_items',
    parameters: {
      mode: 'runOnceForAllItems',
      language: 'javaScript',
      jsCode: `const items = $input.all();
const out = [];
for (const item of items) {
  const j = item.json;
  const url = j.link || j.guid || '';
  if (!url) {
    out.push({
      json: {
        collection: 'ingest_errors',
        id: 'err-wf-c-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7),
        data: {
          reason: 'missing url',
          payload: j,
          workflow_id: 'wf-c-rss',
          created_at: new Date().toISOString(),
        },
      },
    });
    continue;
  }
  const id = 'raw-' + Buffer.from(String(url)).toString('base64url').slice(0, 40);
  out.push({
    json: {
      collection: 'raw_items',
      id,
      data: {
        id,
        url: String(url),
        titulo: j.title || 'N/D',
        resumen: j.contentSnippet || j.content || j.description || '',
        fecha: j.pubDate || j.isoDate || 'N/D',
        fuente: 'medio',
        ingerido_en: new Date().toISOString(),
        workflow_id: 'wf-c-rss',
        clasificado: false,
      },
    },
  });
}
return out.slice(0, 15);`,
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
  'WF-C → raw_items en Firestore vía /api/ingest. Header x-ingest-secret = INGEST_SECRET. Max 15 items/run.',
);

export default workflow('wf-c-rss-colombia', 'CO WF-C RSS Discurso/Medios')
  .add(every6h)
  .to(rss)
  .to(toRaw)
  .to(postIngest)
  .add(note);
