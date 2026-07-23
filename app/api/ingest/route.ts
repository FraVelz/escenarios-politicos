import { NextRequest, NextResponse } from "next/server";
import { clientKey, requireIngestSecret } from "@/lib/ingest-auth";
import {
  consolidarCasoFromMenciones,
  promoteMencionesContraste,
} from "@/lib/consolidar-caso";
import { getAdminDb } from "@/lib/firebaseAdmin";
import {
  isHomepageUrl,
  resolveFuenteFromUrl,
} from "@/lib/fuentes-registro";
import { validateDomainPayload } from "@/lib/ingest-domain";
import {
  MAX_BODY_BYTES,
  ingestBodySchema,
} from "@/lib/ingest-schema";
import {
  checkRateLimit,
  ingestRateLimitConfig,
} from "@/lib/rate-limit";
import type { EvidenciaEstado } from "@/lib/types";
import type { MencionEvidencia } from "@/lib/evidencia";

export const runtime = "nodejs";

async function consolidateAndPromote(casoId: string) {
  const db = getAdminDb();
  const casoRef = db.collection("casos").doc(casoId);
  const casoSnap = await casoRef.get();
  if (!casoSnap.exists) {
    return { consolidated: false as const, reason: "caso_missing" };
  }

  const mencionesSnap = await db
    .collection("menciones")
    .where("caso_id", "==", casoId)
    .get();

  const menciones = mencionesSnap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as (MencionEvidencia & { id: string })[];

  const promoted = promoteMencionesContraste(menciones);
  const batch = db.batch();
  let estadoChanges = 0;
  for (let i = 0; i < menciones.length; i++) {
    const prev = menciones[i]!;
    const next = promoted[i]!;
    if (prev.evidencia_estado !== next.evidencia_estado) {
      batch.set(
        db.collection("menciones").doc(prev.id),
        { evidencia_estado: next.evidencia_estado },
        { merge: true },
      );
      estadoChanges += 1;
    }
  }
  if (estadoChanges > 0) await batch.commit();

  const patch = consolidarCasoFromMenciones(casoSnap.data() || {}, promoted);
  await casoRef.set(patch, { merge: true });
  return {
    consolidated: true as const,
    n_menciones: patch.n_menciones,
    n_menciones_credibles: patch.n_menciones_credibles,
    n_menciones_candidato: patch.n_menciones_candidato,
    credibilidad: patch.credibilidad,
    evidencia_nivel: patch.evidencia_nivel,
    estado_changes: estadoChanges,
  };
}

function enrichMencionData(data: Record<string, unknown>): Record<string, unknown> {
  const url = typeof data.url === "string" ? data.url : "";
  const fuente =
    (typeof data.fuente_id === "string" && data.fuente_id
      ? null
      : resolveFuenteFromUrl(url)) || null;

  const out: Record<string, unknown> = { ...data };
  if (fuente) {
    if (!out.fuente_id) out.fuente_id = fuente.id;
    if (!out.fuente_clase) out.fuente_clase = fuente.clase;
    if (!out.fuente_linea) out.fuente_linea = fuente.linea;
  }

  const estado = out.evidencia_estado as EvidenciaEstado | undefined;
  if (!estado) {
    if (isHomepageUrl(url)) {
      out.evidencia_estado = "candidato";
    } else {
      out.evidencia_estado = "candidato";
    }
  }

  return out;
}

/**
 * Ingesta desde n8n (u otros pipelines).
 * Header: x-ingest-secret: <INGEST_SECRET>
 * Body: { collection, id, data }
 *
 * Tras escribir una mención: promoción por contraste + consolidación del caso.
 */
export async function POST(req: NextRequest) {
  const authErr = requireIngestSecret(req);
  if (authErr) return authErr;

  const { limit, windowMs } = ingestRateLimitConfig();
  const rl = checkRateLimit(`ingest:${clientKey(req)}`, limit, windowMs);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "rate limit exceeded", retry_after_sec: rl.retryAfterSec },
      {
        status: 429,
        headers: { "Retry-After": String(rl.retryAfterSec) },
      },
    );
  }

  const contentLength = Number(req.headers.get("content-length") || 0);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "payload too large" }, { status: 413 });
  }

  let rawText: string;
  try {
    rawText = await req.text();
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }
  if (rawText.length > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "payload too large" }, { status: 413 });
  }

  let json: unknown;
  try {
    json = JSON.parse(rawText);
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const parsed = ingestBodySchema.safeParse(json);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return NextResponse.json(
      { error: issue?.message ?? "invalid payload" },
      { status: 400 },
    );
  }

  const { collection, id, data } = parsed.data;
  let payload = { ...data, id } as Record<string, unknown>;

  if (collection === "menciones") {
    payload = enrichMencionData(payload);
    const url = String(payload.url || "");
    if (url && isHomepageUrl(url) && !payload._allow_homepage) {
      // Homepage → forzar candidato; no rechazar (seed/oficiales indexados)
      payload.evidencia_estado = "candidato";
    }
    delete payload._allow_homepage;
  }

  const domain = validateDomainPayload(collection, payload);
  if (!domain.ok) {
    return NextResponse.json({ error: domain.message }, { status: 400 });
  }

  try {
    await getAdminDb()
      .collection(collection)
      .doc(id)
      .set(domain.data, { merge: true });

    if (collection === "ingest_runs") {
      const wf = String(domain.data.workflow_id || "");
      const cid = String(domain.data.country_id || "co");
      const key =
        wf.includes("wf-a")
          ? "last_wf_a"
          : wf.includes("wf-b")
            ? "last_wf_b"
            : wf.includes("wf-c")
              ? "last_wf_c"
              : wf.includes("wf-d")
                ? "last_wf_d"
                : wf.includes("wf-e")
                  ? "last_wf_e"
                  : null;
      if (key) {
        await getAdminDb()
          .collection("ops_summary")
          .doc(cid)
          .set(
            {
              id: cid,
              country_id: cid,
              updated_at: new Date().toISOString(),
              [key]: {
                id,
                status: domain.data.status,
                started_at: domain.data.started_at,
                finished_at: domain.data.finished_at,
                n_ok: domain.data.n_ok,
                n_error: domain.data.n_error,
              },
            },
            { merge: true },
          );
      }
    }

    let consolidation:
      | Awaited<ReturnType<typeof consolidateAndPromote>>
      | undefined;
    if (collection === "menciones") {
      const casoId = domain.data.caso_id;
      if (typeof casoId === "string" && casoId.length > 0) {
        consolidation = await consolidateAndPromote(casoId);
      }
    }

    return NextResponse.json({
      ok: true,
      collection,
      id,
      consolidation,
    });
  } catch (e) {
    console.error("ingest write failed", e);
    return NextResponse.json({ error: "write failed" }, { status: 500 });
  }
}
