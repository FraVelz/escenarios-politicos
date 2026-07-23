#!/usr/bin/env node
/**
 * Upsert de todo el seed del tablero a Firestore (Admin vía ADC / service account).
 * Uso: GOOGLE_APPLICATION_CREDENTIALS=.firebase-admin.json node scripts/seed-firestore.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleAuth } from "google-auth-library";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT = "escenarios-politicos-co";
const BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents`;
const SEED = path.join(__dirname, "../content/seed");

function encodeValue(v) {
  if (v === null || v === undefined) return { nullValue: null };
  if (typeof v === "boolean") return { booleanValue: v };
  if (typeof v === "number") {
    return Number.isInteger(v)
      ? { integerValue: String(v) }
      : { doubleValue: v };
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
    const patchUrl = `${BASE}/${collection}/${encodeURIComponent(id)}`;
    const patch = await fetch(patchUrl, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(toDoc(data)),
    });
    if (!patch.ok) {
      throw new Error(
        `${collection}/${id} patch ${patch.status} ${await patch.text()}`,
      );
    }
    console.log("patched", collection, id);
    return;
  }
  if (!res.ok) {
    throw new Error(`${collection}/${id} ${res.status} ${await res.text()}`);
  }
  console.log("created", collection, id);
}

function readJson(name) {
  return JSON.parse(fs.readFileSync(path.join(SEED, name), "utf8"));
}

function buildAlertas(casos) {
  const now = "2026-07-22T20:00:00Z";
  const out = [];
  for (const c of casos) {
    if (c.discurso_identidad && c.factibilidad === "baja") {
      out.push({
        id: `alerta-identidad-${c.id}`,
        country_id: c.country_id,
        tipo: "credibilidad_alta_factibilidad_baja",
        caso_id: c.id,
        mensaje: "Discurso identidad con factibilidad baja",
        created_at: now,
        workflow_id: "seed-manual",
      });
    }
    if (c.n_menciones >= 10 && c.especificidad < 20) {
      out.push({
        id: `alerta-ruido-${c.id}`,
        country_id: c.country_id,
        tipo: "ruido_vacio",
        caso_id: c.id,
        mensaje: "Alta frecuencia + baja especificidad",
        created_at: now,
        workflow_id: "seed-manual",
      });
    }
  }
  return out;
}

async function seedCollection(token, collection, rows, idOf = (r) => r.id) {
  for (const row of rows) {
    const id = idOf(row);
    await upsert(collection, id, { ...row, id }, token);
  }
}

async function main() {
  const token = await getAccessToken();
  const casos = readJson("casos.json");
  const menciones = readJson("menciones.json");
  const indicadores = readJson("indicadores.json");
  const actores = readJson("actores.json");
  const partidos = readJson("partidos.json");
  const instituciones = readJson("instituciones.json");
  const escenarios = readJson("escenarios.json");
  const senales = readJson("senales.json");
  const marco = readJson("marco.json");
  const paises = readJson("paises.json");

  await seedCollection(token, "paises", paises);
  await seedCollection(token, "casos", casos);
  await seedCollection(token, "menciones", menciones);
  await seedCollection(token, "indicadores", indicadores);
  await seedCollection(token, "actores", actores);
  await seedCollection(token, "partidos", partidos);
  await seedCollection(token, "instituciones", instituciones);
  await seedCollection(token, "escenarios", escenarios);
  await seedCollection(token, "senales", senales);

  const marcoId = marco.country_id || "co";
  await upsert("marco", marcoId, { ...marco, id: marcoId }, token);

  const alertas = buildAlertas(casos);
  await seedCollection(token, "alertas", alertas);

  console.log(
    "seed ok",
    JSON.stringify({
      casos: casos.length,
      menciones: menciones.length,
      indicadores: indicadores.length,
      actores: actores.length,
      partidos: partidos.length,
      instituciones: instituciones.length,
      escenarios: escenarios.length,
      senales: senales.length,
      alertas: alertas.length,
      marco: 1,
      paises: paises.length,
    }),
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
