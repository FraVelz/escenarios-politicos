import {
  workflow,
  node,
  trigger,
  sticky,
  expr,
  newCredential,
} from '@n8n/workflow-sdk';

const daily = trigger({
  type: 'n8n-nodes-base.scheduleTrigger',
  version: 1.3,
  config: {
    name: 'Daily oficiales',
    parameters: {
      rule: {
        interval: [
          {
            field: 'days',
            daysInterval: 1,
            triggerAtHour: 9,
            triggerAtMinute: 0,
          },
        ],
      },
    },
  },
});

const harvest = node({
  type: 'n8n-nodes-base.httpRequest',
  version: 4.4,
  config: {
    name: 'POST oficiales-harvest',
    parameters: {
      method: 'POST',
      url: 'https://escenarios-politicos.vercel.app/api/oficiales-harvest?country_id=co',
      authentication: 'genericCredentialType',
      genericAuthType: 'httpHeaderAuth',
      sendHeaders: true,
      headerParameters: {
        parameters: [{ name: 'Content-Type', value: 'application/json' }],
      },
      sendBody: true,
      contentType: 'json',
      specifyBody: 'json',
      jsonBody: expr('={{ JSON.stringify({ trigger: "wf-b-oficiales" }) }}'),
    },
    credentials: {
      httpHeaderAuth: newCredential('Escenarios Ingest'),
    },
  },
});

const note = sticky(
  'WF-B: POST /api/oficiales-harvest → eventos (fuente oficial/datos) desde RSS del registro. Sin rss_url → ingest_errors.',
);

export default workflow('wf-b-oficiales-colombia', 'CO WF-B Oficiales')
  .add(daily)
  .to(harvest)
  .add(note);
