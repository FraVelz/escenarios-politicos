import { workflow, node, trigger, sticky } from '@n8n/workflow-sdk';

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
    out.push({ json: { ingest_error: true, reason: 'missing url', payload: j, workflow_id: 'wf-c-rss' } });
    continue;
  }
  out.push({
    json: {
      id: 'raw-' + Buffer.from(String(url)).toString('base64url').slice(0, 40),
      url: String(url),
      titulo: j.title || 'N/D',
      resumen: j.contentSnippet || j.content || j.description || '',
      fecha: j.pubDate || j.isoDate || 'N/D',
      fuente: 'medio',
      ingerido_en: new Date().toISOString(),
      workflow_id: 'wf-c-rss',
      clasificado: false,
    },
  });
}
return out;`,
    },
  },
});

const note = sticky(
  'WF-C: RSS → raw_items. Dedupe por url antes de WF-D. Añadir más feeds como nodos paralelos + Merge.',
);

export default workflow('wf-c-rss-colombia', 'CO WF-C RSS Discurso/Medios')
  .add(every6h)
  .to(rss)
  .to(toRaw)
  .add(note);
