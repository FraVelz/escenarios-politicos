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
    name: 'Daily alertas',
    parameters: {
      rule: {
        interval: [
          {
            field: 'days',
            daysInterval: 1,
            triggerAtHour: 10,
            triggerAtMinute: 0,
          },
        ],
      },
    },
  },
});

const refresh = node({
  type: 'n8n-nodes-base.httpRequest',
  version: 4.4,
  config: {
    name: 'POST alertas-refresh',
    parameters: {
      method: 'POST',
      url: 'https://escenarios-politicos.vercel.app/api/alertas-refresh?country_id=co',
      authentication: 'genericCredentialType',
      genericAuthType: 'httpHeaderAuth',
      sendHeaders: true,
      headerParameters: {
        parameters: [{ name: 'Content-Type', value: 'application/json' }],
      },
      sendBody: true,
      contentType: 'json',
      specifyBody: 'json',
      jsonBody: expr('={{ JSON.stringify({ trigger: "wf-e-alertas" }) }}'),
    },
    credentials: {
      httpHeaderAuth: newCredential('Escenarios Ingest'),
    },
  },
});

const note = sticky(
  'WF-E: POST /api/alertas-refresh materializa alertas del playbook desde casos Firestore.',
);

export default workflow('wf-e-alertas-colombia', 'CO WF-E Alertas')
  .add(daily)
  .to(refresh)
  .add(note);
