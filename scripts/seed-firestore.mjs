import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleAuth } from "google-auth-library";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT = "escenarios-politicos-co";
const BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents`;

function encodeValue(v) {
  if (v === null || v === undefined) return { nullValue: null };
  if (typeof v === "boolean") return { booleanValue: v };
  if (typeof v === "number") {
    return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
  }
  if (typeof v === "string") return { stringValue: v };
  if (Array.isArray(v)) {
    return { arrayValue: { values: v.map(encodeValue) } };
  }
  if (typeof v === "object") {
    const fields = {};
    for (const [k, val] of Object.entries(v)) fields[k] = encodeValue(val);
    return { mapValue: { fields } };
  }
  return { stringValue: String(v) };
}

function toDoc(obj) {
  const fields = {};
  for (const [k, v] of Object.entries(obj)) fields[k] = encodeValue(v);
  return { fields };
}

async function getAccessToken() {
  const auth = new GoogleAuth({
    scopes: [
      "https://www.googleapis.com/auth/datastore",
      "https://www.googleapis.com/auth/cloud-platform",
    ],
  });
  const client = await auth.getClient();
  const token = await client.getAccessToken();
  return token.token;
}

async function upsert(collection, id, data, token) {
  const url = `${BASE}/${collection}?documentId=${encodeURIComponent(id)}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(toDoc(data)),
  });
  if (res.status === 409) {
    const patchUrl = `${BASE}/${collection}/${id}`;
    const patch = await fetch(patchUrl, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(toDoc(data)),
    });
    if (!patch.ok) {
      throw new Error(`${collection}/${id} patch ${patch.status} ${await patch.text()}`);
    }
    console.log("patched", collection, id);
    return;
  }
  if (!res.ok) throw new Error(`${collection}/${id} ${res.status} ${await res.text()}`);
  console.log("created", collection, id);
}

async function main() {
  const token = await getAccessToken();
  const casos = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../content/seed/casos.json"), "utf8"),
  );
  const menciones = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../content/seed/menciones.json"), "utf8"),
  );
  const indicadores = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../content/seed/indicadores.json"), "utf8"),
  );
  for (const c of casos) await upsert("casos", c.id, c, token);
  for (const m of menciones) await upsert("menciones", m.id, m, token);
  for (const i of indicadores) await upsert("indicadores", i.id, i, token);
  await upsert(
    "alertas",
    "ruido-empleo-eslogan",
    {
      id: "ruido-empleo-eslogan",
      tipo: "ruido_vacio",
      caso_id: "empleo-eslogan",
      mensaje: "Alta frecuencia + baja especificidad",
      created_at: "2026-07-21T20:00:00Z",
    },
    token,
  );
  await upsert(
    "alertas",
    "identidad-paz-factibilidad",
    {
      id: "identidad-paz-factibilidad",
      tipo: "credibilidad_alta_factibilidad_baja",
      caso_id: "paz-total-identidad",
      mensaje: "Discurso identidad con factibilidad baja",
      created_at: "2026-07-21T20:00:00Z",
    },
    token,
  );
  console.log("seed ok");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
