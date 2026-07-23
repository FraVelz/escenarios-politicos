import {
  workflow,
  node,
  trigger,
  sticky,
  expr,
  newCredential,
} from '@n8n/workflow-sdk';

const every6h = trigger({
  type: 'n8n-nodes-base.scheduleTrigger',
  version: 1.3,
  config: {
    name: 'Every 6h classify',
    parameters: {
      rule: {
        interval: [{ field: 'hours', hoursInterval: 6 }],
      },
    },
  },
});

const classify = node({
  type: 'n8n-nodes-base.httpRequest',
  version: 4.4,
  config: {
    name: 'POST classify-queue',
    parameters: {
      method: 'POST',
      url: 'https://escenarios-politicos.vercel.app/api/classify-queue?country_id=co&limit=40',
      authentication: 'genericCredentialType',
      genericAuthType: 'httpHeaderAuth',
      sendHeaders: true,
      headerParameters: {
        parameters: [{ name: 'Content-Type', value: 'application/json' }],
      },
      sendBody: true,
      contentType: 'json',
      specifyBody: 'json',
      jsonBody: expr('={{ JSON.stringify({ trigger: "wf-d-clasificar" }) }}'),
    },
    credentials: {
      httpHeaderAuth: newCredential('Escenarios Ingest'),
    },
  },
});

const note = sticky(
  'WF-D: POST /api/classify-queue lee raw_items, match catálogo, menciones candidato, promoción contraste, ingest_runs.',
);

export default workflow('wf-d-clasificar-colombia', 'CO WF-D Clasificar Credibilidad')
  .add(every6h)
  .to(classify)
  .add(note);
